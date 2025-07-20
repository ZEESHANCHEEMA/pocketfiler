import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./ForgotPassword.css";
import Button from "@mui/material/Button";
import EmailSentSuccess from "../../../Components/Modals/EmailSentSuccess/EmailSentSuccess";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../services/redux/middleware/signin";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useDispatch } from "react-redux";
import ScreenLoader from "../../../Components/loader/ScreenLoader";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [email, setEmail] = useState("");
  const [modalShow, setModalShow] = useState(false);

 const formValidation = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    ErrorToast("Please Enter Email");
    return false;
  } else if (!emailRegex.test(email)) {
    ErrorToast("Please Enter a Valid Email");
    return false;
  }
};

  const onForgotPassword = () => {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    const data = {
      email: email,
    };
    try {
      dispatch(forgetPassword(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          SuccessToast("Email Sent Successfully");
          setModalShow(true);
          // navigate("/New-Password");
        } else {
          ErrorToast(res?.payload?.message);
          setLoader(false);
        }
      });
    } catch (error) {
      setLoader(false);
    }
  };

  const [iconSrc, setIconSrc] = useState({
    input1: "/Images/Auth/at-sign1.svg",
  });
  const handleFocus = (inputNumber, iconSource) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [inputNumber]: iconSource,
    }));
  };

  const handleBlur = (inputNumber, inputValue) => {
    // Check if the input field is empty
    const isEmpty = !inputValue.trim();
    // Set the icon source based on whether the input field is empty
    const iconSource = isEmpty
      ? "/Images/Auth/at-sign1.svg"
      : "/Images/Auth/at-sign.svg";

    // Update the icon source state
    setIconSrc((prevState) => ({
      ...prevState,
      [inputNumber]: iconSource,
    }));
  };
  const handleInput = (inputNumber, iconSource) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [inputNumber]: iconSource,
    }));
  };

  // const handleBlur = (inputNumber, iconSource) => {
  //   const isEmpty = !inputValue.trim();
  //   const iconSource = isEmpty && "/Images/Auth/at-sign1.svg"
  //      ;

  //   setIconSrc((prevState) => ({
  //     ...prevState,
  //     [inputNumber]: iconSource,
  //   }));
  // };
  const [isInputClicked, setIsInputClicked] = useState(false);

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  return (
    <>
      {loader && <ScreenLoader />}
      <Container fluid className="login-main">
        <Row className="row-login row-forgot">
          <Col lg={6} md={12} sm={12} className="forgot-col-lhs">
            <div className="LHS-forgot">
              <div className="back-div" onClick={() => navigate(-1)}>
                <img src="/Images/Auth/arrow-narrow-left.svg" alt="Back-icon" />
                <p className="back-forgot">Back</p>
              </div>
              <div className="login-logo-div">
                <img src="/Images/Auth/pocketfiler - logo.svg" alt="logo" />
              </div>

              <h2 className="login-head">Reset password?</h2>
              <p className="login-subtxt">
                Don’t worry! It happens. Please enter the email address<br></br>
                associated with your account.
              </p>

              <div>
                <Form.Group className="email-div">
                  <Form.Label className="common-label">
                    Email address
                  </Form.Label>
                  <div className="email-input-contain">
                    <div className="email-input-div">
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        className="email-input"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && onForgotPassword()
                        }
                        // onClick={handleInputClick}
                        // onBlur={() =>
                        //   handleBlur("input1", "/Images/Auth/at-sign1.svg")
                        // }
                        onBlur={(e) => handleBlur("input1", e.target.value)}
                        onInput={() =>
                          handleInput("input1", "/Images/Auth/at-sign.svg")
                        }
                      />
                    </div>
                    <img src={iconSrc.input1} alt="@" className="img-at" />
                    {/* {isInputClicked ? (
                        <img
                          src="/Images/Auth/at-sign.svg"
                          alt="@"
                          className="img-at"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/at-sign1.svg"
                          alt="@"
                          className="img-at"
                        />
                      )} */}
                  </div>
                </Form.Group>
              </div>
              <Button
                className="Forgot-Submit-btn"
                onClick={onForgotPassword}
                // onClick={() => setModalShow(true)}
              >
                Submit
              </Button>
              <EmailSentSuccess
                show={modalShow}
                onHide={() => setModalShow(false)}
                email={email}
              />
            </div>
          </Col>
          <Col className="rhs-login-col " md={6}>
            <div className="login-img-div  ">
              <img
                src="/Images/Auth/login-bg.png"
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
