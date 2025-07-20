import React from "react";
import Button from "@mui/material/Button";
import "./CreateContract.css";
import { useState, useEffect } from "react";
import AddContract from "../../Modals/AddContract/AddContract";
import { getContract } from "../../../services/redux/middleware/getContract";
import { useDispatch } from "react-redux";

export default function CreateContract() {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className="contract-card">
        <p className="card-contract-head">Create Contract</p>
        <p className="card-contract-sub">
          You have currently no contract at this moment
        </p>
        <div className="d-flex align-items-center justify-content-center">
          <Button
            className="card-contract-btn"
            onClick={() => setModalShow(true)}
          >
            Create contract
          </Button>
        </div>
      </div>
      <AddContract
        show={modalShow}
        onHide={() => setModalShow(false)}
        showpreview={true}
      />
    </>
  );
}
