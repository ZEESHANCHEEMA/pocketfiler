import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder01, Folder as Folders, DotsVertical } from "../../assets/svgs";
import AddLockerModalWeb from "../../Components/Modals/AddLockerModalWeb";
import Header from "../../Components/Header/Header";
import ConfirmModal from "../../Components/Modals/ConfirmModal";
import { ErrorToast, SuccessToast } from "../../Components/toast/Toast";
import Loader from "../../Components/loader/ScreenLoader";
import "./EncryptedLocker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createLocker,
  getLockers,
  renameLocker,
  deleteLocker,
} from "../../services/redux/middleware/locker";
import { setLockers, upsertLocker } from "../../services/redux/reducer/lockers";
import { getLockerDownload } from "../../services/redux/middleware/locker";
import { getLockerPeople } from "../../services/redux/middleware/locker";
// import { updateLockerItemShare } from "../../services/redux/middleware/locker";
import { upsertLockerAssociates } from "../../services/redux/middleware/locker";
import { getLockerItemDownloadUrl } from "../../services/redux/middleware/locker";
// Reuse the unified Share modal used in Locker screen

function EncryptedLocker() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddLockerModal, setShowAddLockerModal] = useState(false);
  const lockersState = useSelector((s) => s?.lockers?.list || []);
  const [lockers, setLockersLocal] = useState(() => lockersState);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("last_month");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [existingAssociateEmails, setExistingAssociateEmails] = useState([]);

  function triggerDownload(url, suggestedName) {
    try {
      const a = document.createElement("a");
      a.href = url;
      if (suggestedName) a.download = suggestedName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      SuccessToast("Download started");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("download error", e);
      window.open(url, "_blank");
    }
  }

  const gridLockers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const now = new Date();
    let from = null;
    if (range === "today") {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "last_week") {
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "last_month") {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "last_year") {
      from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    return lockers.filter((l) => {
      const nameOk = term
        ? String(l.name || "")
            .toLowerCase()
            .includes(term)
        : true;
      const created = l.createdAt ? new Date(l.createdAt) : null;
      const dateOk = from ? (created ? created >= from : true) : true;
      return nameOk && dateOk;
    });
  }, [lockers, search, range]);

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(getLockers())
      .then((res) => {
        const list = res?.payload?.data?.lockers || [];
        dispatch(setLockers(list));
        setLockersLocal(list);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [dispatch]);

  // Keep in sync with global store in case other screens update lockers
  React.useEffect(() => {
    setLockersLocal(lockersState);
  }, [lockersState]);

  // Load existing associates when opening Share
  React.useEffect(() => {
    if (!shareTarget?.id) return;
    dispatch(getLockerPeople({ lockerId: shareTarget.id })).then((res) => {
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
  }, [dispatch, shareTarget?.id]);

  function handleCreateLocker({ name, associates }) {
    // Dispatch API to create locker
    return dispatch(createLocker({ name, associates })).then((res) => {
      const created = res?.payload?.data?.locker;
      if (created) {
        dispatch(upsertLocker(created));
        setLockersLocal((prev) => [...prev, created]);
      }
      return created;
    });
  }

  return (
    <div className="el-container">
      <Header headername="Encrypted Locker" />

      <div className="el-content">
        {isLoading ? (
          <div className="el-card">
            <Loader />
          </div>
        ) : lockers.length === 0 ? (
          <div className="el-card py-20">
            <div className="el-empty">
              <div className="el-empty-icon">
                <Folders />
              </div>
              <div className="el-empty-title">No Lockers Created Yet</div>
              <div className="el-empty-desc">
                Start by creating your first locker to securely store, organize,
                and access your important files whenever you need them.
              </div>
              <button
                className="el-primary"
                onClick={() => setShowAddLockerModal(true)}
              >
                Create Locker
              </button>
            </div>
          </div>
        ) : (
          <div className="el-card">
            <div className="el-row el-row-between el-row-center">
              <div className="el-section-title">Your Lockers</div>
              <div className="el-actions">
                <div className="el-search">
                  <span className="el-search-icon">
                    <img
                      src="/Images/File/search-md.png"
                      alt="History"
                      width={18}
                      height={18}
                    />
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search locker..."
                    className="el-search-input-locker"
                  />
                </div>
                <div className="el-filter">
                  <img
                    src="/Images/File/calendar.png"
                    alt="Calendar"
                    className="el-filter-icon-left"
                  />
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="el-filter-select"
                  >
                    <option value="today">Today</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_year">Last Year</option>
                  </select>
                  <img
                    src="/Images/File/Icon.png"
                    alt="Dropdown"
                    className="el-filter-icon-right"
                  />
                </div>
                <button
                  className="el-primary-sm"
                  onClick={() => setShowAddLockerModal(true)}
                >
                  Add Locker
                </button>
              </div>
            </div>
            {gridLockers.length === 0 ? (
              <div className="el-empty" style={{ padding: 30 }}>
                <div className="el-empty-icon">
                  <Folders />
                </div>
                <div className="el-empty-title">No Lockers Found</div>
                <div className="el-empty-desc">
                  Start by creating your first locker to securely store,
                  organize, and access your important files whenever you need
                  them.
                </div>
              </div>
            ) : (
              <div className="el-grid">
                {gridLockers.map((item) => (
                  <div
                    key={item.id}
                    className="el-tile"
                    onClick={() =>
                      navigate(
                        `/Locker/${encodeURIComponent(
                          item.name
                        )}?lockerId=${encodeURIComponent(item.id)}`
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(
                          `/Locker/${encodeURIComponent(
                            item.name
                          )}?lockerId=${encodeURIComponent(item.id)}`
                        );
                      }
                    }}
                  >
                    <Folder01 />
                    <div className="el-tile-texts">
                      <div className="el-tile-title">{item.name}</div>
                      <div className="el-tile-sub">In my locker</div>
                    </div>
                    <div className="el-dot">
                      <button
                        className="el-dot-btn"
                        type="button"
                        aria-label="Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) =>
                            prev === item.id ? null : item.id
                          );
                        }}
                      >
                        <DotsVertical />
                      </button>
                      {openMenuId === item.id && (
                        <div
                          className="el-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="el-menu-item"
                            type="button"
                            onClick={() => {
                              setRenameTarget(item);
                              setOpenMenuId(null);
                            }}
                          >
                            ✎ Rename
                          </button>
                          <button
                            className="el-menu-item"
                            type="button"
                            onClick={() => {
                              // Simple share: grant viewer access to entered emails
                              setShareTarget(item);
                              setOpenMenuId(null);
                            }}
                          >
                            ⇪ Share
                          </button>
                          <button
                            className="el-menu-item"
                            type="button"
                            onClick={() => {
                              // eslint-disable-next-line no-console
                              console.log("[encrypted] download:locker click", {
                                lockerId: item.id,
                                name: item.name,
                              });
                              dispatch(
                                getLockerDownload({ lockerId: item.id })
                              ).then((res) => {
                                // eslint-disable-next-line no-console
                                console.log(
                                  "[encrypted] download:locker result",
                                  res?.payload || res
                                );
                                const urls = res?.payload?.urls || [];
                                if (
                                  res?.payload?.status &&
                                  res?.payload?.status !== 200
                                ) {
                                  ErrorToast(
                                    res?.payload?.message ||
                                      "You don't have permission to download from this locker"
                                  );
                                  return;
                                }
                                if (!urls.length) {
                                  ErrorToast(
                                    "No downloadable files found in this locker"
                                  );
                                  return;
                                }
                                const entry = urls[0] || {};
                                const entryUrl = entry?.url || entry;
                                const entryName = entry?.name || undefined;
                                if (
                                  typeof entryUrl === "string" &&
                                  entryUrl.startsWith("http")
                                ) {
                                  triggerDownload(entryUrl, entryName);
                                } else if (entry?.id) {
                                  dispatch(
                                    getLockerItemDownloadUrl({
                                      itemId: entry.id,
                                    })
                                  ).then((pre) => {
                                    const presigned = pre?.payload?.url;
                                    if (presigned) {
                                      triggerDownload(presigned, entryName);
                                    } else {
                                      ErrorToast(
                                        "Download URL not provided by server"
                                      );
                                    }
                                  });
                                } else {
                                  ErrorToast(
                                    "Download URL not provided by server"
                                  );
                                }
                              });
                              setOpenMenuId(null);
                            }}
                          >
                            ⤓ Download
                          </button>
                          <button
                            className="el-menu-item el-danger"
                            type="button"
                            onClick={() => {
                              setDeleteTarget(item);
                              setOpenMenuId(null);
                            }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AddLockerModalWeb
        visible={showAddLockerModal}
        onClose={() => setShowAddLockerModal(false)}
        onCreateLocker={handleCreateLocker}
      />

      {renameTarget && (
        <AddLockerModalWeb
          visible={!!renameTarget}
          onClose={() => setRenameTarget(null)}
          modalType="rename"
          lockerName={renameTarget?.name}
          onRenameLocker={({ name }) =>
            dispatch(renameLocker({ lockerId: renameTarget.id, name })).then(
              () => {
                setLockersLocal((prev) =>
                  prev.map((l) =>
                    l.id === renameTarget.id ? { ...l, name } : l
                  )
                );
                setRenameTarget(null);
              }
            )
          }
        />
      )}

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete locker?"
        description={`Locker "${
          deleteTarget?.name || ""
        }" and its contents will be removed. This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const id = deleteTarget.id;
          dispatch(deleteLocker({ lockerId: id, skipAuthRedirect: true })).then(
            (res) => {
              if (res?.payload?.status === 200) {
                setLockersLocal((prev) => prev.filter((l) => l.id !== id));
                SuccessToast("Locker deleted successfully");
              } else {
                const msg = res?.payload?.message || "Failed to delete locker";
                ErrorToast(msg);
              }
              setDeleteTarget(null);
            }
          );
        }}
      />

      {shareTarget && (
        <AddLockerModalWeb
          visible={!!shareTarget}
          onClose={() => setShareTarget(null)}
          modalType="share"
          lockerName={shareTarget?.name}
          existingEmails={existingAssociateEmails}
          onShareLocker={({ associates, add }) => {
            let payloadAdd = add;
            if (!payloadAdd && Array.isArray(associates)) {
              payloadAdd = associates.map((a) => {
                if (typeof a === "string") return { email: a, role: "viewer" };
                if (a?.email)
                  return { email: a.email, role: a.role || "viewer" };
                if (a?.name) return { email: a.name, role: a.role || "viewer" };
                return { email: String(a || "").trim(), role: "viewer" };
              });
            }
            return dispatch(
              upsertLockerAssociates({
                lockerId: shareTarget.id,
                add: payloadAdd,
              })
            ).then((res) => {
              const status = res?.payload?.status;
              const message = res?.payload?.message;
              if (status && status !== 200) {
                if (message) ErrorToast(message);
              } else if (message) {
                SuccessToast(message);
              } else {
                SuccessToast("Locker shared successfully");
              }
              setShareTarget(null);
              return res;
            });
          }}
        />
      )}
    </div>
  );
}

export default EncryptedLocker;
