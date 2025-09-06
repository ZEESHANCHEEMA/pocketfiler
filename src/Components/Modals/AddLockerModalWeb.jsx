import React, { useEffect, useMemo, useState } from "react";

import "./AddLockerModalWeb.css";
import { SuccessTicks } from "../../assets/svgs";

const DEFAULT_ASSOCIATES = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "David Brown",
];

function AddLockerModalWeb({
  visible,
  onClose,
  onCreateLocker,
  modalType = "locker",
  lockerName: parentLockerName,
  onShareLocker,
}) {
  const [lockerName, setLockerName] = useState("");
  const [selectedAssociates, setSelectedAssociates] = useState(["Majid Ali"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lockerNameError, setLockerNameError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (modalType === "folder") {
      setLockerName("");
      setSelectedAssociates([]);
    } else if (modalType === "share") {
      setLockerName(parentLockerName || "My Home Docs");
      setSelectedAssociates(["Majid Ali"]);
    } else {
      setLockerName("My Home Docs");
      setSelectedAssociates(["Majid Ali"]);
    }
    setLockerNameError("");
    setIsSuccess(false);
    setIsLoading(false);
  }, [modalType, visible, parentLockerName]);

  const dropdownOptions = useMemo(
    () => DEFAULT_ASSOCIATES.filter((name) => !selectedAssociates.includes(name)),
    [selectedAssociates]
  );

  function getModalTitle() {
    if (modalType === "folder") return "Add folder";
    if (modalType === "share") return "Share Locker";
    return "Add locker";
  }

  function getModalDescription() {
    if (modalType === "folder") return `Create a folder in '${parentLockerName || "My Home Docs"}'`;
    if (modalType === "share") return "Give access to selected associates";
    return "Create a locker to securely store & share";
  }

  function getActionText() {
    if (modalType === "folder") return isLoading ? "Creating..." : "Create Folder";
    if (modalType === "share") return isLoading ? "Sharing..." : "Share Locker";
    return isLoading ? "Creating..." : "Create Locker";
  }

  function validate() {
    if (modalType === "share") return true;
    if (!lockerName.trim()) {
      setLockerNameError("Please enter a locker name.");
      return false;
    }
    if (lockerName.trim().length < 3) {
      setLockerNameError("Locker name must be at least 3 characters long.");
      return false;
    }
    if (lockerName.trim().length > 50) {
      setLockerNameError("Locker name must be less than 50 characters.");
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (modalType === "share") {
        await onShareLocker?.({ associates: selectedAssociates });
      } else {
        await onCreateLocker?.({ name: lockerName.trim(), associates: selectedAssociates });
      }
      setIsSuccess(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseSuccess() {
    onClose?.();
  }

  function handleRemoveAssociate(name) {
    setSelectedAssociates((prev) => prev.filter((n) => n !== name));
  }

  function handleAddAssociate(name) {
    if (!name) return;
    setSelectedAssociates((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setShowDropdown(false);
  }

  if (!visible) return null;

  return (
    <div className="alw-overlay" role="dialog" aria-modal>
      <div className="alw-modal" style={{ maxHeight: 850 }}>
        {isSuccess ? (
          <div className="alw-success">
            <div className="alw-success-title">
              <div className="items-center justify-center flex mb-7">
              <SuccessTicks />
              </div>
              {modalType === "share" ? "Locker Shared Successfully!" : `${modalType === "folder" ? "Folder" : "Locker"} Created Successfully!`}
            </div>
            <div className="alw-success-desc">
              {modalType === "share"
                ? "Your locker has been shared with selected associates"
                : `Your ${modalType === "folder" ? "folder" : "locker"} ${lockerName} is now ready to use`}
            </div>
            <button className="alw-primary" onClick={handleCloseSuccess}>
              {modalType === "share" ? "Done" : `View ${modalType === "folder" ? "Folders" : "Lockers"}`}
            </button>
          </div>
        ) : (
          <div className="alw-content">
            <div className="alw-header">
              <div className="alw-header-text">
                <div className="alw-title">{getModalTitle()}</div>
                <div className="alw-desc">{getModalDescription()}</div>
              </div>
              <button className="alw-close" onClick={onClose} aria-label="Close modal">
                ✕
              </button>
            </div>

            {modalType === "share" && (
              <div className="alw-copy">
                <button className="alw-copy-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <span className="alw-copy-icon">⧉</span>
                  <span>Copy locker link</span>
                </button>
              </div>
            )}

            <div className="alw-form">
              {modalType !== "share" && (
                <div className="alw-group">
                  <label className="alw-label">{modalType === "folder" ? "Folder name" : "Locker name"}</label>
                  <input
                    className={`alw-input ${lockerNameError ? "alw-input-error" : ""}`}
                    value={lockerName}
                    onChange={(e) => {
                      setLockerName(e.target.value);
                      if (lockerNameError) setLockerNameError("");
                    }}
                    placeholder={modalType === "folder" ? "" : "Enter locker name"}
                  />
                  {lockerNameError ? <div className="alw-error">{lockerNameError}</div> : null}
                </div>
              )}

              <div className="alw-group">
                <label className="alw-label">Share with associate</label>
                {selectedAssociates.map((name) => (
                  <div key={name} className="alw-chip-row">
                    <div className="alw-chip">{name}</div>
                    <button className="alw-remove" onClick={() => handleRemoveAssociate(name)} aria-label={`Remove ${name}`}>
                      ✕
                    </button>
                  </div>
                ))}

                <button className="alw-dropdown" onClick={() => setShowDropdown((s) => !s)}>
                  <span className="alw-dropdown-ph">Add another associate</span>
                  <span className="alw-drop-icon">▼</span>
                </button>
              </div>

              {showDropdown && (
                <div className="alw-options">
                  <div className="alw-options-scroll">
                    {dropdownOptions.map((opt) => (
                      <button key={opt} className="alw-option" onClick={() => handleAddAssociate(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className={`alw-primary ${isLoading ? "alw-primary-disabled" : ""}`} onClick={handleSubmit} disabled={isLoading}>
              {getActionText()}
            </button>

            {modalType === "share" && <div className="alw-footer">Manage sharing permissions later in locker settings</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddLockerModalWeb;


