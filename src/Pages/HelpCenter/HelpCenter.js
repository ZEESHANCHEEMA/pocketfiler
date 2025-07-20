import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import "./HelpCenter.css";
import Header from "../../Components/Header/Header";
import { useMediaQuery } from "react-responsive";
import Dispute from "../../Components/Modals/Dispute/Dispute";
import { helpCenter } from "../../services/redux/middleware/helpCenter";
import { useDispatch, useSelector } from "react-redux";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { ErrorToast, SuccessToast } from "../../Components/toast/Toast";
import { getProfile } from "../../services/redux/middleware/signin";

export default function HelpCenter() {
  const userData = useSelector((state) => state?.profile?.profile?.data);
  console.log(userData, "userDatakkkkkkjjjj");
  useEffect(() => {
    const id = localStorage.getItem("_id");

    dispatch(getProfile(id));
  }, []);

  const dispatch = useDispatch();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneNo] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    setEmail(userData?.email ?? "");
    setPhoneNo(userData?.phoneNo ?? "");
  }, [userData]);
  const handlePhoneNoChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numeric values
    setPhoneNo(value);
  };

  const formValidation = () => {
    if (!email) {
      ErrorToast("Please Enter Email");
      return false;
    } else if (!phoneno) {
      ErrorToast("Please Enter Contact Number");
      return false;
    } else if (!description.trim()) {
      ErrorToast("Please Enter Description");
      return false;
    }
    return true;
  };

  async function handleDisputes() {
    const isValid = formValidation();
    if (!isValid) {
      return;
    }
    setLoader(true);
    try {
      const data = { email, contactNo: phoneno, description };
      await dispatch(helpCenter(data)).then((res) => {
        console.log(res, "resuuuuuuuuuu");
        setLoader(false);
        if (res?.payload?.status == 201) {
          SuccessToast("Details Submitted Successfully");
          setDescription("");
          // setModalShow(true);
        } else {
          ErrorToast(res?.payload?.message || "Something went wrong");
        }
      });
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
      ErrorToast("An error occurred. Please try again.");
    }
  }

  return (
    <>
      <Header headername={"Help center"} />
      <div className="help-body">
        <div className="help-r1">
          <Form.Group className="email-div">
            <Form.Label className="common-label">Email address</Form.Label>
            <div className="email-input-contain">
              <Form.Control
                type="email"
                disabled
                placeholder="Enter Email"
                className="email-input-noicon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Form.Label className="common-label mt-2">
              Contact number
            </Form.Label>
            <div className="email-input-contain mt-2">
              <Form.Control
                type="text"
                disabled
                placeholder="Contact number"
                className="email-input-noicon"
                value={phoneno}
                onChange={handlePhoneNoChange}
              />
            </div>

            <Form.Label className="common-label mt-2">Description</Form.Label>
            <div className="email-input-contain mt-2">
              <Form.Control
                as="textarea"
                rows={6} // Big text area for description
                placeholder="Enter Description"
                className="email-input-noicon"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </Form.Group>
        </div>

        <div className="help-r2-box">
          <p className="important-head">Important notice</p>
          <p className="imp-subtxt">
            For any issues or disputes regarding PocketFiler, please do not
            hesitate to reach out to our support team. <br /> We are committed
            to providing you with the best service possible and addressing any
            concerns you may have. <br />
            You can contact us at info@pocketfiler.com, and our dedicated team
            will assist you promptly. Your satisfaction is our priority, and we
            are here to help resolve any problems you encounter.
          </p>
        </div>

        <button
          className="helpCenter__btn"
          onClick={!loader ? () => handleDisputes() : () => {}}
        >
          Submit
        </button>
        {modalShow && (
          <Dispute show={modalShow} onHide={() => setModalShow(false)} />
        )}
      </div>
    </>
  );
}
