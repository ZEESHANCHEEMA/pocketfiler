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
    // Convert string to boolean
    setProfileStatus(userProfile === "true");
  }, []);

  async function Letsgo() {
    console.log("After Verification");
    console.log("Profile Status:", profileStatus);

    // Add error handling and fallback
    try {
      if (profileStatus === true) {
        console.log("Navigating to login");
        navigate("/login");
      } else {
        console.log("Navigating to login");
        navigate("/login");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
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
