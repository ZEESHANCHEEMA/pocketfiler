import React, { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Folder01, SettingsIcon } from "../../assets/svgs";
import AddLockerModalWeb from "../../Components/Modals/AddLockerModalWeb";
import SettingsModalWeb from "../../Components/Modals/SettingsModalWeb";
import AddAssociateModalWeb from "../../Components/Modals/AddAssociateModalWeb";
import "./LockerScreen.css";
import Header from "../../Components/Header/Header";
import ConfirmModal from "../../Components/Modals/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import {
  upsertLockerAssociates,
  getLockerItems,
  createFolder,
  uploadLockerFiles,
  getLockerPeople,
  deleteLockerItem,
  getLockerItemDownloadUrl,
  getLockerHistory,
} from "../../services/redux/middleware/locker";
import { setLockerPeople } from "../../services/redux/reducer/lockerPeople";
import { getAssociatesForShare } from "../../services/redux/middleware/getAssociatesForShare";
import Loader from "../../Components/loader/ScreenLoader";
import { ErrorToast, SuccessToast } from "../../Components/toast/Toast";

function LockerScreen() {
  const { lockerName } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(
    (s) => s?.authSlice?.user?._id || s?.profile?.data?._id
  );
  const searchParams = new URLSearchParams(location.search);
  const lockerId =
    searchParams.get("lockerId") || decodeURIComponent(lockerName || "Locker");
  const decodedLockerName = decodeURIComponent(lockerName || "Locker");
  const [associateOptions, setAssociateOptions] = useState([]);

  React.useEffect(() => {
    if (!userId) return;
    dispatch(getAssociatesForShare(userId)).then((res) => {
      const list = res?.payload?.data || [];
      const opts = list
        .map((u) => u?.email || u?.name || u?.fullName)
        .filter(Boolean);
      setAssociateOptions(opts);
    });
  }, [dispatch, userId]);

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = React.useRef(null);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showShareLockerModal, setShowShareLockerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddAssociate, setShowAddAssociate] = useState(false);
  const [existingAssociateEmails, setExistingAssociateEmails] = useState([]);
  const [openItemMenuId, setOpenItemMenuId] = useState(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(getLockerItems({ lockerId }))
      .then((res) => {
        const data = res?.payload?.data || {};
        setFolders(data.folders || []);
        setFiles(data.files || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [dispatch, lockerId]);

  // Keep a live cache of existing associate emails to help the Share modal filter duplicates
  React.useEffect(() => {
    dispatch(getLockerPeople({ lockerId })).then((res) => {
      const data = res?.payload?.data || {};
      const assoc = Array.isArray(data?.associates) ? data.associates : [];
      const emails = assoc
        .map((a) =>
          String(a?.email || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);
      setExistingAssociateEmails(emails);
    });
  }, [dispatch, lockerId]);

  function handleCreateFolder({ name }) {
    return dispatch(createFolder({ lockerId, name })).then((res) => {
      const f = res?.payload?.data?.folder;
      if (f) setFolders((prev) => [...prev, f]);
      return f;
    });
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(uploadLockerFiles({ lockerId, files: [file] })).then((res) => {
      const uploaded = res?.payload?.data?.files || [];
      if (uploaded?.length) setFiles((prev) => [...prev, ...uploaded]);
      e.target.value = "";
    });
  }

  function handleShareLocker({ associates, add }) {
    let payloadAdd = add;
    if (!payloadAdd && Array.isArray(associates)) {
      payloadAdd = associates.map((a) => {
        if (typeof a === "string") return { email: a, role: "viewer" };
        if (a?.email) return { email: a.email, role: a.role || "viewer" };
        if (a?.name) return { email: a.name, role: a.role || "viewer" };
        return { email: String(a || "").trim(), role: "viewer" };
      });
    }
    return dispatch(getLockerPeople({ lockerId })).then((existingRes) => {
      const apiData = existingRes?.payload?.data || {};
      const people = apiData?.data || apiData;
      const assoc = Array.isArray(people?.associates) ? people.associates : [];
      const currentRoleByEmail = {};
      assoc.forEach((p) => {
        if (p?.email)
          currentRoleByEmail[String(p.email).trim().toLowerCase()] = String(
            p?.role || ""
          ).toLowerCase();
      });
      const normalizedAdds = (payloadAdd || []).map((e) =>
        typeof e === "string"
          ? { email: e, role: "viewer" }
          : { email: e.email, role: e.role || "viewer" }
      );
      const duplicateAny = normalizedAdds.find(
        (e) =>
          currentRoleByEmail[String(e.email).trim().toLowerCase()] !== undefined
      );
      if (duplicateAny) {
        ErrorToast("User already existed");
        return { payload: { status: 409, message: "User already existed" } };
      }

      const action = upsertLockerAssociates({ lockerId, add: payloadAdd });
      return dispatch(action).then((res) => {
        // If API returns a message (e.g., user already present), surface it
        const status = res?.payload?.status;
        const message = res?.payload?.message;
        if (status && status !== 200) {
          if (message) ErrorToast(message);
        } else if (message) {
          SuccessToast(message);
        }
        dispatch(getLockerPeople({ lockerId })).then((p) => {
          const apiData = p?.payload?.data || {};
          const data = apiData?.data || apiData;
          const owner = data?.owner
            ? {
                id: data.owner._id,
                email: data.owner.email,
                name: data.owner.fullname || data.owner.email,
              }
            : null;
          const associatesList = (data?.associates || []).map((a) => ({
            id: a._id,
            email: a.email,
            name: a.fullname || a.email,
          }));
          dispatch(
            setLockerPeople({ lockerId, owner, associates: associatesList })
          );
        });
        return res?.payload || res;
      });
    });
  }

  const isEmpty = useMemo(
    () => folders.length === 0 && files.length === 0,
    [folders, files]
  );

  return (
    <>
      <Header headername={"Locker"} />
      <div className="ls-container">
        {isLoading ? (
          <div className="ls-scroll">
            <Loader />
          </div>
        ) : (
          <>
            <div className="ls-toolbar">
              <div className="ls-breadcrumb">
                My Lockers &nbsp;&gt;&nbsp; {decodedLockerName}
              </div>
              <div className="ls-tool-actions">
                <button
                  className="ls-icon-btn-light"
                  onClick={() => {
                    setShowHistory(true);
                    dispatch(getLockerHistory({ lockerId })).then((res) => {
                      const items = res?.payload?.items || [];
                      setHistoryItems(items);
                    });
                  }}
                  aria-label="History"
                >
                  ⏱
                </button>
                <button
                  className="ls-icon-btn-light"
                  onClick={() => setShowSettingsModal(true)}
                  aria-label="Settings"
                >
                  <SettingsIcon width={18} height={18} />
                </button>
                <button
                  className="ls-primary-sm"
                  onClick={() => setShowAddAssociate(true)}
                >
                  Add Associate
                </button>
              </div>
            </div>

            <div className="ls-scroll">
              {showHistory && (
                <div
                  className="ls-history-overlay"
                  role="dialog"
                  aria-modal
                  onClick={() => setShowHistory(false)}
                >
                  <div
                    className="ls-history-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="ls-row-between ls-row-center">
                      <div className="ls-section-title">Locker timeline</div>
                      <button
                        className="ls-icon-btn-light"
                        onClick={() => setShowHistory(false)}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="ls-history-sub">
                      All the time locker timeline
                    </div>
                    <div className="ls-history-list">
                      {historyItems.map((h, i) => (
                        <div key={i} className="ls-history-item">
                          <div>
                            <div className="ls-history-actor">
                              {h?.actor || "User"}
                            </div>
                            <div className="ls-history-action">
                              {h?.action || h?.event || "Activity"}
                            </div>
                          </div>
                          <div className="ls-history-time">
                            {h?.at || h?.createdAt || ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {isEmpty ? (
                <div className="ls-card ls-empty-card ls-empty-surface">
                  <div className="ls-empty-stack">
                    <div className="ls-empty-icon">
                      <Folder01 width={64} height={64} />
                    </div>
                    <div className="ls-empty-title">No Files Uploaded Yet</div>
                    <div className="ls-empty-desc">
                      Upload your first file to securely store and manage it in
                      this locker
                    </div>
                    <div className="ls-row-gap">
                      <button
                        className="ls-primary"
                        onClick={handleUploadClick}
                      >
                        Upload File
                      </button>
                      <button
                        className="ls-outline"
                        onClick={() => setShowAddFolderModal(true)}
                      >
                        Create Folder
                      </button>
                    </div>
                    <div className="ls-foot-note">
                      Up to 5MB only (no larger)
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ls-card">
                    <div className="ls-row-between ls-row-center">
                      <div className="ls-section-title">Folders</div>
                      <button
                        className="ls-outline"
                        onClick={() => setShowAddFolderModal(true)}
                      >
                        Create Folder
                      </button>
                    </div>
                    {folders.length === 0 ? (
                      <div className="ls-empty-list">
                        No folders created yet
                      </div>
                    ) : (
                      <div className="ls-grid">
                        {folders.map((item, idx) => {
                          const menuKey = `folder-${item?.id || idx}`;
                          return (
                            <div key={item?.id || idx} className="ls-tile">
                              <Folder01 />
                              <div className="ls-tile-texts">
                                <div className="ls-tile-title">{item.name}</div>
                                <div className="ls-tile-sub">In my locker</div>
                              </div>
                              <div className="ls-dot">
                                <button
                                  type="button"
                                  className="ls-dot-btn"
                                  aria-label="Folder options"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenItemMenuId((p) =>
                                      p === menuKey ? null : menuKey
                                    );
                                  }}
                                >
                                  ⋮
                                </button>
                                {openItemMenuId === menuKey && (
                                  <div
                                    className="ls-menu"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      className="ls-menu-item"
                                      onClick={() =>
                                        setShowShareLockerModal(true)
                                      }
                                    >
                                      Share
                                    </button>
                                    <button
                                      type="button"
                                      className="ls-menu-item"
                                      onClick={() => {
                                        // eslint-disable-next-line no-console
                                        console.log(
                                          "[locker] download:folder click",
                                          { itemId: item.id, name: item.name }
                                        );
                                        dispatch(
                                          getLockerItemDownloadUrl({
                                            itemId: item.id,
                                          })
                                        ).then((res) => {
                                          // eslint-disable-next-line no-console
                                          console.log(
                                            "[locker] download:folder result",
                                            res?.payload || res
                                          );
                                          const url = res?.payload?.url;
                                          if (url)
                                            triggerDownload(url, item.name);
                                        });
                                        setOpenItemMenuId(null);
                                      }}
                                    >
                                      Download
                                    </button>
                                    <button
                                      type="button"
                                      className="ls-menu-item ls-danger"
                                      onClick={() => {
                                        setDeleteItemTarget({
                                          type: "folder",
                                          id: item.id,
                                          idx,
                                          name: item.name,
                                        });
                                        setOpenItemMenuId(null);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="ls-card">
                    <div className="ls-row-between ls-row-center">
                      <div className="ls-section-title">Files</div>
                      <button
                        onClick={handleUploadClick}
                        className="ls-outline"
                      >
                        Upload File
                      </button>
                    </div>
                    {files.length === 0 ? (
                      <div className="ls-empty-list">No files uploaded yet</div>
                    ) : (
                      <div className="ls-grid">
                        {files.map((item, idx) => {
                          const menuKey = `file-${item?.id || idx}`;
                          return (
                            <div key={item?.id || idx} className="ls-tile">
                              <Folder01 />
                              <div className="ls-tile-texts">
                                <div className="ls-tile-title">{item.name}</div>
                                <div className="ls-tile-sub">In my locker</div>
                              </div>
                              <div className="ls-dot">
                                <button
                                  type="button"
                                  className="ls-dot-btn"
                                  aria-label="File options"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenItemMenuId((p) =>
                                      p === menuKey ? null : menuKey
                                    );
                                  }}
                                >
                                  ⋮
                                </button>
                                {openItemMenuId === menuKey && (
                                  <div
                                    className="ls-menu"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      className="ls-menu-item"
                                      onClick={() =>
                                        setShowShareLockerModal(true)
                                      }
                                    >
                                      Share
                                    </button>
                                    <button
                                      type="button"
                                      className="ls-menu-item"
                                      onClick={() => {
                                        // eslint-disable-next-line no-console
                                        console.log(
                                          "[locker] download:file click",
                                          { itemId: item.id, name: item.name }
                                        );
                                        dispatch(
                                          getLockerItemDownloadUrl({
                                            itemId: item.id,
                                          })
                                        ).then((res) => {
                                          // eslint-disable-next-line no-console
                                          console.log(
                                            "[locker] download:file result",
                                            res?.payload || res
                                          );
                                          if (
                                            res?.payload?.status &&
                                            res?.payload?.status !== 200
                                          ) {
                                            ErrorToast(
                                              res?.payload?.message ||
                                                "You don't have permission to download this file"
                                            );
                                            return;
                                          }
                                          const url = res?.payload?.url;
                                          if (url)
                                            triggerDownload(url, item.name);
                                        });
                                        setOpenItemMenuId(null);
                                      }}
                                    >
                                      Download
                                    </button>
                                    <button
                                      type="button"
                                      className="ls-menu-item ls-danger"
                                      onClick={() => {
                                        setDeleteItemTarget({
                                          type: "file",
                                          id: item.id,
                                          idx,
                                          name: item.name,
                                        });
                                        setOpenItemMenuId(null);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <ConfirmModal
              visible={!!deleteItemTarget}
              title={
                deleteItemTarget?.type === "file"
                  ? "Delete file?"
                  : "Delete folder?"
              }
              description={`This ${deleteItemTarget?.type || "item"} "${""}${
                deleteItemTarget?.name || ""
              }" will be removed. This cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onClose={() => setDeleteItemTarget(null)}
              onConfirm={() => {
                const t = deleteItemTarget;
                if (!t) return;
                // Optimistic UI update
                if (t.type === "file") {
                  setFiles((prev) =>
                    prev.filter((f, i) => (f.id || i) !== (t.id || t.idx))
                  );
                } else {
                  setFolders((prev) =>
                    prev.filter((f, i) => (f.id || i) !== (t.id || t.idx))
                  );
                }
                // Call API to delete
                dispatch(deleteLockerItem({ itemId: t.id })).finally(() => {
                  setDeleteItemTarget(null);
                  // Refresh items to ensure consistency
                  dispatch(getLockerItems({ lockerId }));
                });
              }}
            />

            {/* Hidden file input for uploads (available in any state) */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              style={{ display: "none" }}
            />

            <AddLockerModalWeb
              visible={showAddFolderModal}
              onClose={() => setShowAddFolderModal(false)}
              onCreateLocker={handleCreateFolder}
              modalType="folder"
              lockerName={decodedLockerName}
              onShareLocker={handleShareLocker}
            />

            <AddLockerModalWeb
              visible={showShareLockerModal}
              onClose={() => setShowShareLockerModal(false)}
              onCreateLocker={handleCreateFolder}
              modalType="share"
              lockerName={decodedLockerName}
              onShareLocker={handleShareLocker}
              existingEmails={existingAssociateEmails}
            />

            <SettingsModalWeb
              visible={showSettingsModal}
              onClose={() => setShowSettingsModal(false)}
              lockerName={decodedLockerName}
              lockerId={lockerId}
            />

            <AddAssociateModalWeb
              visible={showAddAssociate}
              onClose={() => setShowAddAssociate(false)}
              lockerName={decodedLockerName}
              onShare={(data) => handleShareLocker(data)}
              associateOptions={associateOptions}
            />
          </>
        )}
      </div>
    </>
  );
}

// Force download helper
function triggerDownload(url, suggestedName) {
  if (!url) {
    ErrorToast("No download URL");
    return;
  }
  try {
    const a = document.createElement("a");
    a.href = url;
    if (suggestedName) a.download = suggestedName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    SuccessToast("Download started");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("download-fallback", err);
    window.open(url, "_blank");
  }
}

export default LockerScreen;
