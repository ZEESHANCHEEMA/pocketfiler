import React, { useState, useRef } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./SignUpVerify.css";
import Button from "@mui/material/Button";
import AccountSuccess from "../../../Components/Modals/AccountCreatedSuccess/AccountSuccess";
import { useMediaQuery } from "react-responsive";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useDispatch } from "react-redux";
import { verifysignup } from "../../../services/redux/middleware/signin";
import { updateverifycode } from "../../../services/redux/middleware/signin";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [otpinputValue, setOtpInputValue] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // const handlseInputChange = (index, value) => {
  //   // Allow only numeric characters
  //   const newValue = value.replace(/\D/, ""); // Remove non-numeric characters
  //   const newValues = [...otpinputValue];
  //   newValues[index] = newValues.charAt(0); // Use newValue instead of value
  //   setOtpInputValue(newValues);

  //   // Move focus to the next input if the current input is filled
  //   if (newValue && index < inputRefs.length - 1) {
  //     inputRefs[index + 1].current.focus();
  //   }
  // };

  const handleInputChange = (index, value) => {
    // Allow only alphanumeric characters and limit to one character
    const newValue = value.replace(/[^a-zA-Z0-9]/g, "").charAt(0);
    // Keep only alphanumeric characters and limit to one character
    const newValues = [...otpinputValue];
    newValues[index] = newValue;
    setOtpInputValue(newValues);

    // Move focus to the next input if the current input is filled
    if (newValue && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };
  const formValidation = () => {
    const isFilled = otpinputValue.every((value) => value !== "");

    if (!isFilled) {
      console.log("form validation error");
      ErrorToast("Please Enter 4-Character Code");
      return false;
    }

    return true; // Return true if all inputs are filled
  };
  const { email } = useParams();

  async function VerifySignUp() {
    console.log("Signup Verification");
    const res = formValidation();
    console.log(res);
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        // google: false,
        email: email,
        code: otpinputValue.join(""),
      };
      dispatch(verifysignup(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(data);
          localStorage.setItem("_id", res?.payload?.data?.id);
          localStorage.setItem("name", res?.payload?.data?.fullname);
          localStorage.setItem("role", res?.payload?.data?.role);
          localStorage.setItem(
            "Profile_Update_Status",
            res?.payload?.data?.profileUpdate
          );
          localStorage.setItem("token", res?.payload?.token);

          SuccessToast("Account Verified Successfully");
          setModalShow(true);
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function ResentCode() {
    console.log("Again Signup Verification");
    // console.log(res);
    // if (res === false) {
    //   return false;
    // }
    setLoader(true);
    try {
      const data = {
        email: email,
      };
      dispatch(updateverifycode(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(data);
          SuccessToast("Again Code Sent Successfully");
          // navigate("/");
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      {loader && <ScreenLoader />}
      <Container fluid className="login-main">
        <Row className="row-login row-forgot">
          <Col lg={6} md={12} sm={12} className="signup-verify-lhs">
            <div className="LHS-forgot">
              <div className="login-logo-div">
                <img src="/Images/Auth/pocketfiler - logo.svg" alt="logo" />
              </div>

              <h2 className="login-head">Account verification</h2>
              <p className="login-subtxt">
                4-Character verification code has been sent on your email
              </p>

              <div className="otp-inputs-main">
                {otpinputValue.map((value, index) => (
                  <Form.Group className="email-div" key={index}>
                    <Form.Control
                      type="text"
                      inputmode="text"
                      className="otp-input"
                      value={value}
                      maxLength={1}
                      ref={inputRefs[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  </Form.Group>
                ))}
              </div>

              <Button
                className="Forgot-Submit-btn"
                // onClick={() => setModalShow(true)}
                onClick={VerifySignUp}
              >
                Verify now
              </Button>
              <AccountSuccess
                show={modalShow}
                onHide={() => setModalShow(false)}
              />

              <div className="receive-code-div">
                <p className="dont-txt txt-btm">
                  Didn’t receive the code?{" "}
                  <span className="signup-span" onClick={ResentCode}>
                    {" "}
                    Request again{" "}
                  </span>
                </p>
              </div>
            </div>
          </Col>
          <Col className="rhs-login-col " md={6}>
            <div className="login-img-div  ">
              <img
                src="/Images/Auth/signup-bg.png"
                alt="img"
                className="login-rhs-img"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
