import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./Login.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import LoginService from "../../../services/loginService";

export default function LoginExample() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  
  const input1 = "/Images/Auth/at-sign1.svg";
  const input2 = "/Images/Auth/Icon.svg";
  const nonEmpty1 = "/Images/Auth/at-sign.svg";
  const nonEmpty2 = "Images/Auth/lock-01.svg";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Google login using new service
  const logingoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoader(true);
      try {
        const datas = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );

        const googleData = {
          email: datas?.data?.email,
          name: datas?.data?.name,
        };

        const result = await LoginService.loginWithGoogle(googleData);
        
        if (result.success) {
          setLoader(false);
          navigate(result.redirectTo);
        } else {
          setLoader(false);
          if (result.redirectTo) {
            navigate(result.redirectTo);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error("Error:", error);
        ErrorToast("Google login failed. Please try again.");
      }
    },
  });

  // LinkedIn login using new service
  const { linkedInLogin } = useLinkedIn({
    clientId: "77oc0z5qmkqij2",
    redirectUri: `https://webapp.pocketfiler.com/linkedin`,
    scope: "openid,profile,email",
    onSuccess: async (code) => {
      setLoader(true);
      try {
        const result = await LoginService.loginWithLinkedIn(code);
        
        if (result.success) {
          setLoader(false);
          navigate(result.redirectTo);
        } else {
          setLoader(false);
          if (result.redirectTo) {
            navigate(result.redirectTo);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error("LinkedIn login error:", error);
        ErrorToast("LinkedIn login failed. Please try again.");
      }
    },
    onError: (error) => {
      setLoader(false);
      console.log("LinkedIn error", error);
      ErrorToast("LinkedIn login failed. Please try again.");
    },
  });

  async function LinkdinAuthLogin() {
    try {
      await linkedInLogin();
    } catch (error) {
      console.error("LinkedIn login error:", error);
    }
  }

  const formValidation = () => {
    if (!email) {
      ErrorToast("Please Enter Email");
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      ErrorToast("Please Enter a Valid Email");
      return false;
    } else if (!password) {
      ErrorToast("Please Enter Password");
      return false;
    }
    return true;
  };

  // Login using new service
  async function login() {
    if (!formValidation()) {
      return;
    }
    
    setLoader(true);
    try {
      const result = await LoginService.loginWithCredentials(email, password);
      
      if (result.success) {
        setLoader(false);
        navigate(result.redirectTo);
      } else {
        setLoader(false);
        if (result.requiresVerification) {
          navigate(result.redirectTo);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error("Login error:", error);
      ErrorToast("Login failed. Please try again.");
    }
  }

  return (
    <>
      {loader && <ScreenLoader />}
      <Container fluid className="login-main">
        <Row className="row-login ">
          <Col lg={6} className="login-col-lhs">
            <div className="LHS-login">
              <div className="login-logo-div">
                <img
                  src="/Images/pocketfiler_logo.png"
                  alt="logo"
                  style={{ height: 140, width: 160, objectFit: "contain" }}
                />
              </div>

              <h2 className="login-head">Login to your account</h2>
              <p className="login-subtxt">
                The faster you login, The faster we get to work
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
                        onKeyDown={(e) => e.key === "Enter" && login()}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <img
                      src={email.length > 0 ? nonEmpty1 : input1}
                      alt="@"
                      className="img-at"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="email-div">
                  <Form.Label className="common-label label-diff">
                    Password
                  </Form.Label>
                  <div className="email-input-contain">
                    <div className="email-input-div">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="email-input"
                        onKeyDown={(e) => e.key === "Enter" && login()}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <img
                      src={password.length > 0 ? nonEmpty2 : input2}
                      alt="/"
                      className="img-lock"
                    />

                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      className="img-eye"
                    >
                      {!showPassword ? (
                        <img src="/Images/Auth/eye-off.svg" alt="eyeoff" />
                      ) : (
                        <img src="/Images/Auth/eye.svg" alt="eyeoff" />
                      )}
                    </IconButton>
                  </div>
                </Form.Group>
              </div>
              <p
                className="forgot-txt"
                onClick={() => navigate("/Forgot-Password")}
              >
                Forgot password?
              </p>
              <Button className="Login-btn" onClick={login}>
                Login
              </Button>

              <div className="Or-div">
                <p className="or-login-txt">Or login with </p>
                <hr className="custom-hr"></hr>
              </div>
              <div className="options-login-div">
                <div
                  className="option-login "
                  onClick={() => {
                    LinkdinAuthLogin();
                  }}
                >
                  <img src="/Images/Auth/linkedin.svg" alt="Linkedin" />
                </div>
                <div
                  className="option-login"
                  onClick={() => {
                    logingoogle();
                  }}
                >
                  <img src="/Images/Auth/google.svg" alt="Google" />
                </div>
              </div>
              <p className="dont-txt">
                Don't have an account?{" "}
                <span
                  className="signup-span"
                  onClick={() => navigate("/SignUp")}
                >
                  {" "}
                  Sign up{" "}
                </span>
              </p>
            </div>
          </Col>
          <Col className="rhs-login-col" lg={6}>
            <div className="login-img-div">
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