import React from "react";
import "./ConfirmModal.css";

function ConfirmModal({
  visible,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) {
  if (!visible) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
  };

  return (
    <div
      className="cm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <div className="cm-title">{title}</div>
          <div className="cm-desc">{description}</div>
        </div>
        <div className="cm-actions">
          <button
            className="cm-btn cm-cancel"
            onClick={onClose}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            className="cm-btn cm-danger"
            onClick={onConfirm}
            aria-label={confirmText}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
