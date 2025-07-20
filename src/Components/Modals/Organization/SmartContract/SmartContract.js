import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./SmartContract.css";
import * as React from "react";
import { useState } from "react";
export default function SmartContract(props) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="smart-contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header add-contract-header"
          >
            <div className="add-contract-m-heading">
              <h6 className="mb-0 ">Smart contract</h6>
              <p>Choose a client below or invite by email</p>
            </div>
            <div className="add-project__close add-contract-close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={props.onHide}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "70px", paddingTop: "50px", paddingBottom: "60px" }}
        >
          <div className="add-project-body">
            <div className="add-contract__input">
              <label className="contract-name-head">Title</label>
              <input type="text" placeholder="Enter Title " />
            </div>
            <div className="add-contract__input contract-top">
              <label className="contract-name-head">Total Amount</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Enter Total Amount"
                  className="input-contract input-dollar-space"
                  style={{ position: "relative" }}
                />

                <img
                  src="/Images/Dashboard/dollar-line.svg"
                  alt="dollar"
                  className="img-dollar "
                />
              </div>
            </div>

            <div className="add-contract__main-btn">
              <Button
                className="continue-add-btn "
                onClick={props.onHide}
                
              >
                Create smart contract
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
