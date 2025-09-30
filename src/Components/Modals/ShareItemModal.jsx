import React, { useState } from "react";
import "./ShareItemModal.css";

function ShareItemModal({ visible, onClose, onShare, itemName, copyLink }) {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleAddEmail = () => {
    const splitted = String(emailInput)
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (!splitted.length) return;
    setEmails((prev) => {
      const set = new Set(prev.concat(splitted));
      return Array.from(set);
    });
    setEmailInput("");
  };

  const handleRemove = (rem) => {
    setEmails((prev) => prev.filter((e) => e !== rem));
  };

  const handleSubmit = async () => {
    // If user didn't press Add, include what's in the input
    const pending = String(emailInput).trim();
    let targetEmails = emails;
    if (!targetEmails.length && pending) {
      targetEmails = pending
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    }
    if (!targetEmails.length) return;
    setLoading(true);
    try {
      await onShare?.({ emails: targetEmails, role });
      setEmails([]);
      setEmailInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sim-overlay" role="dialog" aria-modal>
      <div className="sim-modal">
        <div className="sim-header">
          <div>
            <div className="sim-title">Share</div>
            {itemName ? <div className="sim-sub">{itemName}</div> : null}
          </div>
          <button className="sim-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="sim-body">
          {copyLink ? (
            <div>
              <label className="sim-label">Share link</label>
              <div className="sim-input-row" style={{ marginBottom: 12 }}>
                <input
                  value={copyLink}
                  readOnly
                  className="sim-input"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  className="sim-add"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(copyLink);
                    } catch (e) {
                      /* no-op */
                    }
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : null}
          <label className="sim-label">Invite by email</label>
          <div className="sim-input-row">
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email of user"
              className="sim-input"
            />
            <button className="sim-add" onClick={handleAddEmail}>
              Add
            </button>
          </div>
          {emails.length ? (
            <div className="sim-chips">
              {emails.map((e) => (
                <span key={e} className="sim-chip">
                  {e}
                  <button
                    className="sim-chip-x"
                    onClick={() => handleRemove(e)}
                    aria-label={`Remove ${e}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <label className="sim-label">Role</label>
          <div className="sim-select-wrap">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="sim-select"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
        </div>

        <div className="sim-footer">
          <button className="sim-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="sim-btn-primary"
            onClick={handleSubmit}
            disabled={loading || (!emails.length && !emailInput.trim())}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareItemModal;
