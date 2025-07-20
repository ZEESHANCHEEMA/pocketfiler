import React from "react";
import { Modal, Button } from "react-bootstrap";

const FilePreviewModal = ({ isOpen, onClose, file }) => {
  if (!file) {
    return null; // Avoid rendering if no file URL is provided
  }

  const fileURL = file; // Assuming file is a direct URL string

  // Function to determine file type based on URL extension
  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["pdf"].includes(extension)) return "pdf";
    if (["doc", "docx"].includes(extension)) return "word";
    return "unknown";
  };

  const fileType = getFileType(fileURL);
  console.log(fileURL, "fileURL");

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return <img src={fileURL} alt="Preview" className="img-fluid" />;
      case "pdf":
        return (
          <iframe
            src={fileURL}
            className="w-100"
            style={{ height: "500px" }}
            title="PDF Preview"
          ></iframe>
        );
      case "word":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
              fileURL
            )}`}
            className="w-100"
            style={{ height: "500px" }}
            title="Word Preview"
          ></iframe>
        );
      default:
        return <p className="text-danger">Unsupported file type</p>;
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="xl">
      {" "}
      {/* 'xl' for extra width */}
      <Modal.Dialog style={{ maxWidth: "90vw", width: "90%" }}>
        {" "}
        {/* Custom width */}
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{renderPreview()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
};

export default FilePreviewModal;
