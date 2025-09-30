import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./AccountSuccess.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountSuccess(props) {
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState();

  useEffect(() => {
    const userProfile = localStorage.getItem("Profile_Update_Status");
    console.log("USER PROFILE IS", userProfile);
    setProfileStatus(userProfile);
  }, [profileStatus]);

  async function Letsgo() {
    console.log("After Verification");
    if (profileStatus === true) {
      navigate("/Dashboard");
    } else {
      navigate("/Profile");
    }
  }

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        className="account-create-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              src="/Images/Auth/account-created-successfully-icon.svg"
              alt="account-created-icon"
            />
            <p className="email-sent-head">
              Account created <br /> successfully!
            </p>
            <p className="email-msg">
              Your PocketFiler account created successfully.
            </p>
            <Button
              onClick={() => {
                Letsgo();
              }}
              className="btn-awesome"
            >
              Let’s go 🎉
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
