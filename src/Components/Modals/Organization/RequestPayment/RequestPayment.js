import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./RequestPayment.css";
import * as React from "react";

export default function RequestPayment(props) {
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="request-pay-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              src="/Images/Clients/payment-icon.svg"
              alt="request-payment"
              width={"80px"}
              height={"80px"}
            />
            <p className="email-sent-head">
              Jimmy Carter <br></br>requested payment
            </p>
            <p className="email-msg">
            Request your client to realise payment from smart contract.
            </p>
            <Button onClick={props.onHide} className="btn-request-pay" >
              Request payment
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
