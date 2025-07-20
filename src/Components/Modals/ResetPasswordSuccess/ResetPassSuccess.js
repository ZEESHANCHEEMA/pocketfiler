import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import * as React from "react";
import "./ResetPassSuccess.css";
import { useNavigate } from "react-router-dom";

export default function ResetPassSuccess(props) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="email-reset-sent-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              src="/Images/Auth/passowrd-reset-successfully-icon.svg"
              alt="reset-password-icon"
            />
            <p className="email-sent-head  top-pd btm-pd">
              Password reset<br></br> successfully!
            </p>
            <p className="email-msg">
              Your PocketFiler account password<br></br> changed successfully.
            </p>
            <Button
              // onClick={props.onHide}
              className="btn-awesome"
              onClick={() => navigate("/")}
            >
              Login now
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
