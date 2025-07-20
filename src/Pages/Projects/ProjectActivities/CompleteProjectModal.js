import React from "react";
import { Modal, Button } from "react-bootstrap";

const CompleteProjectModal = ({
  modalVisible,
  onModalClose,
  onCompleteProject,
}) => {
  const handleClose = () => {
    onModalClose();
  };

  const handleCompleteProject = () => {
    onCompleteProject();
    onModalClose();
  };

  return (
    <>
      <Modal show={modalVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to complete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCompleteProject}>
            Complete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompleteProjectModal;
