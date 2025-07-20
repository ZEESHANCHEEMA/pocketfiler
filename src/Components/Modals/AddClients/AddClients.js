import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";

import "./addClients.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addClient } from "../../../services/redux/middleware/getContract";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { getClient } from "../../../services/redux/middleware/getContract";
import { userDetails } from "../../../services/redux/middleware/signin";

export default function AddClients(props) {
  const [email, setEmail] = useState();
  const [userId, setUserId] = useState();
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const formValidation = () => {
    if (!email) {
      ErrorToast("Please Enter Email");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    console.log("user id ", userId);
  }, []);

  async function AddClient() {
    setError(false);

    const res = formValidation();
    if (res === false) {
      return false;
    }
    console.log("indside the add cliemt");
    try {
      const data = {
        email: email,
        userId: userId,
      };
      dispatch(addClient(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          SuccessToast("User added Successfully");
          props.onHide();
          const userid = localStorage.getItem("_id");
          console.log("user id ", userid);
          setUserId(userid);
          const data = {
            id: userid,
            page: 1,
          };
          dispatch(getClient(data));
          console.log("user id ", data);
        } else if (res?.payload?.status === 400) {
          ErrorToast(res.payload.message);
          setError(true);
        } else {
          ErrorToast(res.payload.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  const isEmail = (text) => /\S+@\S+\.\S+/.test(text);
  const isPhoneNumber = (text) => /^[0-9]{10,15}$/.test(text); // Allows 10-15 digits

  async function handleAddClient() {
    const userData = await dispatch(userDetails(userId));

    if (email === userData?.payload?.data?.email) {
      ErrorToast("You cannot request to yourself.");

      return;
    }
    if (!formValidation()) {
      return;
    }

    if (!isEmail(email) && !isPhoneNumber(email)) {
      ErrorToast("Please enter a valid email or phone number (10-15 digits).");
      return;
    }
    const data = isEmail(email)
      ? { email, userId }
      : { phoneNo: email, userId };

    try {
      dispatch(addClient(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          SuccessToast("User added Successfully");
          props.onHide();
          const userid = localStorage.getItem("_id");
          console.log("user id ", userid);
          setUserId(userid);
          const data = {
            id: userid,
            page: 1,
          };
          dispatch(getClient(data));
          console.log("user id ", data);
        } else if (res?.payload?.status === 400) {
          ErrorToast(res.payload.message);
          // setError(true);
        } else {
          ErrorToast(res.payload.message);
        }
      });
    } catch (error) {
      console.log(error, "handleAddClient Error");
      ErrorToast(error.message || "An error occurred");
    }
  }

  async function CopyLink() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const hostWithProtocol = protocol + "//" + host;

    await navigator.clipboard.writeText(
      `${hostWithProtocol}/SignUp?userId=${userId}`
    );
    SuccessToast("Link copied to clipboard");
  }

  const [userRoles, setUserRoles] = useState();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRoles(userRole);
  }, [userRoles]);

  return (
    <>
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-project-modal "
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
          >
            <div
              className="add-project__main-header"
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              <h6 className="mb-0">
                {userRoles == "user" ? "Add associate" : "Add Client"}
              </h6>
              <p>
                Fill the details below to{" "}
                {userRoles == "user" ? "add associate" : "Add Client"}
              </p>
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
        <Modal.Body
          style={{ padding: "70px", paddingTop: "50px", paddingBottom: "60px" }}
        >
          <div className="add-project-body">
            <div className="client__copy">
              <Button className="client__copy-btn" onClick={CopyLink}>
                <img
                  className="client__copy-btn-img"
                  src="/Images/Clients/copylink.svg"
                  alt="/"
                />
                Copy invite link
              </Button>
              <div className="client__copy-other">
                <p>Or add manually</p>
                <div className="client__copy-other-border"></div>
              </div>
            </div>
            <div className="client__copy-input">
              <label>Email address / Contact number</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                type="email"
                placeholder="Enter... "
              />
              {error && (
                <div className="client__userExist">
                  <p className="client__userExist1">* Client not exists</p>
                  <p className="client__userExist-border"></p>
                  <p className="client__userExist2">Copy link to invite</p>
                </div>
              )}
            </div>

            <div className="add-project__main-btn">
              <Button className="client-project__btn" onClick={handleAddClient}>
                {userRoles == "user" ? "Add Associate" : "Add Client"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
