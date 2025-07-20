import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./EmailSentSuccess.css";
import * as React from "react";

export default function EmailSentSuccess(props) {
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="email-sent-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              src="/Images/Auth/email-sent-successfully-icon.svg"
              alt="email-sent-icon"
              width={"100px"}
              height={"100px"}
            />
            <p className="email-sent-head">Email sent successfully!</p>
            <p className="email-msg">
              We have sent you a email on <br></br>{" "}
              <span className="email-span">{props.email} </span>
              with reset <br></br> password instructions.
            </p>
            <Button onClick={props.onHide} className="btn-awesome">
              Awesome
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
