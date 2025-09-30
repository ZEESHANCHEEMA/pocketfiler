import React, { useMemo, useState } from "react";
import "./SettingsModalWeb.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getLockerPeople,
  upsertLockerAssociates,
  updateLockerAccess,
} from "../../services/redux/middleware/locker";
import { ErrorToast, SuccessToast } from "../toast/Toast";
import { setLockerPeople } from "../../services/redux/reducer/lockerPeople";

function SettingsModalWeb({ visible, onClose, lockerName, lockerId }) {
  const [generalAccess, setGeneralAccess] = useState(
    "Restricted (Only invited people)"
  );
  const [showGeneralAccessDropdown, setShowGeneralAccessDropdown] =
    useState(false);
  const [showEditorDropdown, setShowEditorDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingAdd, setPendingAdd] = useState([]); // [{email, role}]
  const [pendingRemove, setPendingRemove] = useState([]); // [email]
  const [people, setPeople] = useState({ owner: null, associates: [] });
  const dispatch = useDispatch();

  const generalAccessOptions = useMemo(
    () => ["Restricted (Only invited people)", "Anyone with the link"],
    []
  );

  const editorAccessOptions = useMemo(
    () => ["Owner", "Editor", "Viewer", "Remove access"],
    []
  );

  const cached = useSelector((s) => s?.lockerPeople?.byLockerId?.[lockerId]);

  React.useEffect(() => {
    if (!visible || !lockerId) return;
    if (cached) {
      setPeople({ owner: cached.owner, associates: cached.associates });
      setPendingAdd([]);
      setPendingRemove([]);
      return;
    }
    setLoading(true);
    dispatch(getLockerPeople({ lockerId }))
      .then((res) => {
        const apiData = res?.payload?.data || {};
        const data = apiData?.data || apiData;
        console.log("data===========", data);
        const owner =
          data && (data.owner || data.Owner)
            ? {
                id: (data.owner || data.Owner)._id,
                email: (data.owner || data.Owner).email,
                name:
                  (data.owner || data.Owner).fullname ||
                  (data.owner || data.Owner).fullName ||
                  (data.owner || data.Owner).name ||
                  (data.owner || data.Owner).email,
                avatarUrl:
                  (data.owner || data.Owner).avatar ||
                  (data.owner || data.Owner).photo ||
                  (data.owner || data.Owner).profileImageUrl,
                role: "Owner",
              }
            : null;
        const associates = (data?.associates || data?.Associates || []).map(
          (a) => ({
            id: a._id || a.id,
            email: a.email,
            name: a.fullname || a.fullName || a.name || a.email,
            avatarUrl: a.avatar || a.photo || a.profileImageUrl,
            role: (a.role || "viewer").replace(/^./, (c) => c.toUpperCase()),
          })
        );
        setPeople({ owner, associates });
        setPendingAdd([]);
        setPendingRemove([]);
        console.log("owner", owner);
        console.log("associates", associates);
        dispatch(setLockerPeople({ lockerId, owner, associates }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [visible, lockerId, dispatch, cached]);

  if (!visible) return null;

  return (
    <div className="smw-overlay" role="dialog" aria-modal>
      <div className="smw-modal" style={{ maxHeight: 850 }}>
        <div className="smw-content">
          <div className="smw-header">
            <div className="smw-header-text">
              <div className="smw-title">Settings</div>
              <div className="smw-desc">
                Manage who can view, or edit this locker
              </div>
            </div>
            <button
              className="smw-close"
              onClick={onClose}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="smw-section">
            <div className="smw-section-title">People with access</div>
            {loading ? <div className="smw-loading">Loading...</div> : null}
            <div className="smw-people">
              {people.owner ? (
                <div className="smw-person" key={people.owner.id}>
                  <div className="smw-person-info">
                    <div className="smw-avatar">
                      {people.owner?.avatarUrl ? (
                        <img
                          src={people.owner.avatarUrl}
                          alt={people.owner.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="smw-person-name">{people.owner.name}</div>
                  </div>
                  <div className="smw-role-static">Owner</div>
                </div>
              ) : null}
              {(people.associates || []).map((person) => (
                <div className="smw-person" key={person.id}>
                  <div className="smw-person-info">
                    <div className="smw-avatar">
                      {person?.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="smw-person-name">{person.name}</div>
                  </div>
                  <button
                    className="smw-role"
                    onClick={() => setShowEditorDropdown(person.id)}
                  >
                    <span>{person.role || "Viewer"}</span>
                    <span className="smw-caret">▼</span>
                  </button>
                </div>
              ))}
            </div>
            {showEditorDropdown && (
              <div className="smw-options">
                {editorAccessOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`smw-option ${
                      opt === "Remove access" ? "smw-danger" : ""
                    }`}
                    onClick={() => {
                      const targetId = showEditorDropdown;
                      const target = (people.associates || []).find(
                        (a) => a.id === targetId
                      );
                      const targetEmail = target?.email || targetId;
                      setShowEditorDropdown(null);
                      if (opt === "Remove access") {
                        // Queue removal; don't call API now
                        setPendingRemove((prev) =>
                          prev.includes(targetEmail)
                            ? prev
                            : [...prev, targetEmail]
                        );
                        setPeople((p) => ({
                          ...p,
                          associates: p.associates.filter(
                            (a) => a.id !== targetId
                          ),
                        }));
                      } else {
                        const role = opt.toLowerCase();
                        // Queue role update; don't call API now
                        setPendingAdd((prev) => {
                          const next = prev.filter(
                            (x) => x.email !== targetEmail
                          );
                          next.push({ email: targetEmail, role });
                          return next;
                        });
                        setPeople((p) => ({
                          ...p,
                          associates: p.associates.map((a) =>
                            a.id === targetId ? { ...a, role: opt } : a
                          ),
                        }));
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="smw-section">
            <div className="smw-section-title">General access</div>
            <button
              className="smw-general"
              onClick={() => setShowGeneralAccessDropdown((s) => !s)}
            >
              <div className="smw-general-icon">👥</div>
              <div className="smw-general-text">{generalAccess}</div>
              <div className="smw-caret">▼</div>
            </button>
            <div className="smw-general-desc">
              {generalAccess === "Anyone with the link"
                ? "Anyone who has the link will be able to open it."
                : "Only people you've invited can access this locker."}
            </div>
            {showGeneralAccessDropdown && (
              <div className="smw-options">
                {generalAccessOptions.map((opt) => (
                  <button
                    key={opt}
                    className="smw-option"
                    onClick={() => {
                      setGeneralAccess(opt);
                      setShowGeneralAccessDropdown(false);
                      // Call API to update access immediately
                      const accessTypeMap = {
                        "Restricted (Only invited people)": "restricted",
                        "Anyone with the link": "public",
                      };
                      const accessType = accessTypeMap[opt] || "restricted";
                      dispatch(updateLockerAccess({ lockerId, accessType }))
                        .then((res) => {
                          if (res?.payload?.status === 200) {
                            SuccessToast("General access updated");
                          } else {
                            ErrorToast("Failed to update general access");
                          }
                        })
                        .catch(() => {
                          ErrorToast("Failed to update general access");
                        });
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="smw-primary"
            onClick={() => {
              if (!lockerId) return;
              setLoading(true);
              const payload = {
                lockerId,
                add: pendingAdd,
                remove: pendingRemove,
              };
              dispatch(upsertLockerAssociates(payload))
                .then((res) => {
                  if (res?.payload?.status === 200) {
                    SuccessToast("Access updated");
                    // Refresh from server to be sure
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
                      const associates = (data?.associates || []).map((a) => ({
                        id: a._id,
                        email: a.email,
                        name: a.fullname || a.email,
                      }));
                      setPeople({ owner, associates });
                      dispatch(
                        setLockerPeople({ lockerId, owner, associates })
                      );
                      setPendingAdd([]);
                      setPendingRemove([]);
                      onClose?.();
                    });
                  } else {
                    ErrorToast("Failed to update access");
                  }
                })
                .finally(() => setLoading(false));
            }}
          >
            Update Access
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModalWeb;
