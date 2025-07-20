
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./DemoModal.css"


import * as React from "react";

export default function DemoModal(props) {
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="custom-create"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          {/* <img
            src={cross}
            alt="cross-icon"
            className="close-btn-img"
            onClick={props.onHide}
          /> */}
          <h4>Demo</h4>
        </Modal.Header>
        <Modal.Body>
          <div>
           <h1>Your Modal body</h1>
           <Button onClick={props.onHide}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
