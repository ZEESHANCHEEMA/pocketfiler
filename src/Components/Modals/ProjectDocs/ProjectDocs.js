import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
// import { useState, useEffect } from "react";
import "./projectDocs.css";
import * as React from "react";
// import { BorderBottom } from "@mui/icons-material";

export default function ProjectDocs(props) {
  return (
    <>
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="project-docs-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
            style={{ marginBottom: "34px" , display:"flex", justifyContent:"space-between" , alignItems: "center" }}
          >
            <div className="add-project__main-header">
              <h6 className="mb-0">Project docs</h6>
              {/* <p>Fill the details below to add project</p> */}
            </div>
            <div className="add-project__close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={props.onHide}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="project-docs-body">
              <img src="/Images/Projects/docs.svg" alt="/" />
            </div>
            <div className="project-docs-body-images">
              <img
                className="project-docs-body-images1"
                src="/Images/Projects/arrowleft.svg"
                alt="/"
              />
              <img
                className="project-docs-body-images2"
                src="/Images/Projects/arrowright.svg"
                alt="/"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
