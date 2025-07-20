import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./NewPassword.css";
import Button from "@mui/material/Button";
import { useMediaQuery } from "react-responsive";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import ResetPassSuccess from "../../../Components/Modals/ResetPasswordSuccess/ResetPassSuccess";
import { useNavigate } from "react-router-dom";
import { newPassword } from "../../../services/redux/middleware/signin";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ScreenLoader from "../../../Components/loader/ScreenLoader";

export default function NewPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [modalShow, setModalShow] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { passcode } = useParams();
  console.log(passcode);

  const [PasswordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 8) {
      ErrorToast(
        "Password must be 8 characters long with at least one special character."
      );

      return "Password must be exactly 8 characters long.";
    }
    if (!specialCharRegex.test(password)) {
      ErrorToast(
        "Password must be 8 characters long with at least one special character."
      );

      return "Password must contain at least one special character.";
    }
    return null;
  };

  const formValidation = () => {
    if (!password) {
      ErrorToast("Please Enter New Password");
      return false;
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setPasswordError(passwordError);

        return false;
      }
    }
  };

  const onNewPassword = () => {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    const data = {
      password: password,
      verificationCode: passcode,
    };
    dispatch(newPassword(data)).then((res) => {
      if (res?.payload?.status === 200) {
        setLoader(false);
        SuccessToast("Password Reset Successfully");
        setModalShow(true);
        // navigate("/New-Password");
      } else {
        ErrorToast(res?.payload?.message);
        setLoader(false);
      }
    });
  };

  return (
    <>
      {loader && <ScreenLoader />}
      <Container fluid className="login-main">
        <Row className="row-login row-forgot">
          <Col lg={6} md={12} sm={12} className="newpass-col-lhs">
            <div className="LHS-newpass">
              <div className="login-logo-div">
                <img src="/Images/Auth/pocketfiler - logo.svg" alt="logo" />
              </div>

              <h2 className="login-head">Reset password?</h2>
              <p className="login-subtxt">Reset your account password</p>

              <div>
                <Form.Group className="email-div">
                  <Form.Label className="common-label ">
                    New Password
                  </Form.Label>
                  <div className="email-input-contain">
                    <div className="email-input-div">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        className="newpass-input"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <img
                      src={
                        password?.length > 0
                          ? "/Images/Auth/lock-01.svg"
                          : "/Images/Auth/Icon.svg"
                      }
                      style={{ height: 20, width: 20, objectFit: "fill" }}
                      alt="@"
                      className="newpass-img-lock"
                    />

                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      className="newpass-img-eye"
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </Form.Group>
                {PasswordError && (
                  <div className="error-message">{PasswordError}</div>
                )}
              </div>
              <Button
                className="Forgot-Submit-btn"
                onClick={onNewPassword}
                // onClick={() => setModalShow(true)}
              >
                Reset password
              </Button>
              <ResetPassSuccess
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </Col>
          <Col className="rhs-login-col " md={6}>
            <div className="login-img-div  ">
              <img
                src="/Images/Auth/newpass-bg.svg"
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
