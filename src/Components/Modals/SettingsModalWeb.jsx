import React, { useMemo, useState } from "react";
import "./SettingsModalWeb.css";

function SettingsModalWeb({ visible, onClose, lockerName }) {
  const [generalAccess, setGeneralAccess] = useState("Anyone with the link");
  const [showGeneralAccessDropdown, setShowGeneralAccessDropdown] = useState(false);
  const [showEditorDropdown, setShowEditorDropdown] = useState(null);

  const generalAccessOptions = useMemo(
    () => ["Anyone with the link", "Only people with access", "Restricted"],
    []
  );

  const editorAccessOptions = useMemo(
    () => ["Owner", "Editor", "Viewer", "Remove access"],
    []
  );

  const peopleWithAccess = useMemo(
    () => [
      { id: 1, name: "Majid Ali", role: "Owner", avatar: "👨‍💼", canChangeRole: false },
      { id: 2, name: "Corey Stranger", role: "Editor", avatar: "🧔‍♂️", canChangeRole: true },
    ],
    []
  );

  if (!visible) return null;

  return (
    <div className="smw-overlay" role="dialog" aria-modal>
      <div className="smw-modal" style={{ maxHeight: 850 }}>
        <div className="smw-content">
          <div className="smw-header">
            <div className="smw-header-text">
              <div className="smw-title">Settings</div>
              <div className="smw-desc">Manage who can view, or edit this locker</div>
            </div>
            <button className="smw-close" onClick={onClose} aria-label="Close settings">✕</button>
          </div>

          <div className="smw-section">
            <div className="smw-section-title">People with access</div>
            {peopleWithAccess.map((person) => (
              <div className="smw-person" key={person.id}>
                <div className="smw-person-info">
                  <div className="smw-avatar"><span>{person.avatar}</span></div>
                  <div className="smw-person-name">{person.name}</div>
                </div>
                {person.canChangeRole ? (
                  <button className="smw-role" onClick={() => setShowEditorDropdown(person.id)}>
                    <span>{editorAccessOptions[1]}</span>
                    <span className="smw-caret">▼</span>
                  </button>
                ) : (
                  <div className="smw-role-static">{person.role}</div>
                )}
              </div>
            ))}
            {showEditorDropdown && (
              <div className="smw-options">
                {editorAccessOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`smw-option ${opt === "Remove access" ? "smw-danger" : ""}`}
                    onClick={() => setShowEditorDropdown(null)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="smw-section">
            <div className="smw-section-title">General access</div>
            <button className="smw-general" onClick={() => setShowGeneralAccessDropdown((s) => !s)}>
              <div className="smw-general-icon">👥</div>
              <div className="smw-general-text">{generalAccess}</div>
              <div className="smw-caret">▼</div>
            </button>
            <div className="smw-general-desc">Anyone who has the link will be able to open it.</div>
            {showGeneralAccessDropdown && (
              <div className="smw-options">
                {generalAccessOptions.map((opt) => (
                  <button key={opt} className="smw-option" onClick={() => { setGeneralAccess(opt); setShowGeneralAccessDropdown(false); }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="smw-primary" onClick={onClose}>Update Access</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModalWeb;


