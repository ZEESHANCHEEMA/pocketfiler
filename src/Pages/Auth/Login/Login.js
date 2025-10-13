import React, { useCallback, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { LinkdinAuth, signin } from "../../../services/redux/middleware/signin";
import { clearError } from "../../../services/redux/reducer/authSlice";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { debounce } from "lodash";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  // Get auth state from Redux
  const { error } = useSelector((state) => state.auth);

  const input1 = "/Images/Auth/at-sign1.svg";
  const input2 = "/Images/Auth/Icon.svg";
  const nonEmpty1 = "/Images/Auth/at-sign.svg";
  const nonEmpty2 = "Images/Auth/lock-01.svg";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle auth errors
  React.useEffect(() => {
    if (error) {
      ErrorToast(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const logingoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const datas = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
      );

      try {
        const data = {
          // id: userId,
          email: datas?.data?.email,
          fullname: datas?.data?.name,
          isGoogleSignIn: true,
          islinkedinSignIn: false,
        };

        dispatch(signin(data)).then((res) => {
          if (res?.payload?.status === 200) {
            setLoader(false);

            SuccessToast("Google Login Success");

            localStorage.setItem("_id", res?.payload?.data?.id);
            localStorage.setItem("token", res?.payload?.token);
            localStorage.setItem("email", res?.payload?.data?.email);
            localStorage.setItem("user", JSON.stringify(res?.payload?.data));
            localStorage.setItem(
              "profileupdate",
              res?.payload?.data?.profileUpdate
            );
            localStorage.setItem("role", res?.payload?.data?.role);
            localStorage.setItem("name", res?.payload?.data?.fullname);

            if (res?.payload?.data?.profileUpdate) {
              navigate("/Dashboard");
            } else {
              navigate("/Profile");
            }
          } else {
            setLoader(false);
            ErrorToast(res?.payload?.message);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const debouncedLinkedInLogin = useCallback(
    debounce((data) => {
      dispatch(LinkdinAuth(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          localStorage.setItem("_id", res?.payload?.data?.id);
          localStorage.setItem("token", res?.payload?.token);
          localStorage.setItem("email", res?.payload?.data?.email);
          localStorage.setItem("user", JSON.stringify(res?.payload?.data));
          SuccessToast("Linkedin login");

          if (res?.payload?.data?.profileUpdate) {
            navigate("/Dashboard");
          } else {
            navigate("/Profile");
          }
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    }, 300),
    []
  );

  const { linkedInLogin } = useLinkedIn({
    // client cred

    clientId: "77oc0z5qmkqij2",

    // clientId: "78hailyq7y87as",

    redirectUri: `https://webapp.pocketfiler.com/linkedin`,
    scope: "openid,profile,email",
    onSuccess: (code) => {
      try {
        const data = {
          code: code,
        };
        debouncedLinkedInLogin(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  async function LinkdinAuthLogin() {
    try {
      await linkedInLogin();
    } catch (error) {}
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
  };

  async function login() {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        email: email,
        password: password,
      };
      // localStorage.clear();

      dispatch(signin(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("login res", res?.payload?.data);
          localStorage.setItem("_id", res?.payload?.data?._id);
          localStorage.setItem("token", res?.payload?.token);
          localStorage.setItem("role", res?.payload?.data?.role);
          localStorage.setItem("name", res?.payload?.data?.fullname);
          localStorage.setItem("email", res?.payload?.data?.email || email);
          localStorage.setItem("user", JSON.stringify(res?.payload?.data));

          SuccessToast("Signed In Successfully");
          navigate("/Dashboard");

          if (res?.payload?.data?.profileUpdate) {
            navigate("/Dashboard");
          } else {
            navigate("/Profile");
          }
        } else {
          if (
            res?.payload?.message ==
            "Email not verified. Verification code sent to your email."
          ) {
            navigate(`/SignUp-Verify/${email}`);
            setLoader(false);
          } else {
            setLoader(false);
            ErrorToast(res?.payload?.message);
          }
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
