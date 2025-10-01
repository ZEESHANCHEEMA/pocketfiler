import React, { useCallback, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./SignUp.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useDispatch } from "react-redux";
import { LinkdinAuth, signup } from "../../../services/redux/middleware/signin";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paramsUserID = searchParams.get("ref") || searchParams.get("userId");

  const [loader, setLoader] = useState(false);
  const [count, setcount] = useState(0);

  //User
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [agreeUserTerms, setAgreeUserTerms] = useState(false);

  //Organization
  const [usernameorg, setUsernameorg] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [passwordorg, setPasswordorg] = useState("");
  const [emailorg, setEmailorg] = useState("");
  const [agreeOrgTerms, setAgreeOrgTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const input1 = "/Images/Auth/user-03.svg";
  const input2 = "/Images/Auth/at-sign1.svg";
  const input3 = "/Images/Auth/Icon.svg";
  const input4 = "/Images/Auth/building-07.svg";
  const nonEmpty1 = "/Images/Auth/profile-img.svg";
  const nonEmpty2 = "/Images/Auth/at-sign.svg";
  const nonEmpty3 = "/Images/Auth/lock-01.svg";
  const nonEmpty4 = "/Images/Auth/org-icon.svg";

  const logingoogleOrg = useGoogleLogin({
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
          // organizationName: "abc",
          associateId: paramsUserID,
          role: "organization",
        };
        console.log(datas?.data);
        dispatch(signup(data)).then((res) => {
          if (res?.payload?.status === 200) {
            setLoader(false);
            console.log(data);
            SuccessToast("Add Further Details");
            console.log(res);
            localStorage.setItem("_id", res?.payload?.data?.id);
            localStorage.setItem("token", res?.payload?.token);
            localStorage.setItem("role", res?.payload?.data?.role);
            localStorage.setItem(
              "profileupdate",
              res?.payload?.data?.profileUpdate
            );

            navigate(`/OrgnizationDetails/${datas?.data?.email}`, {
              state: {
                email: datas?.data?.email,
                name: datas?.data?.name,
                role: "organization",
              },
            });
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

  const logingoogleUser = useGoogleLogin({
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
          associateId: paramsUserID,
          role: "user",
        };
        console.log(datas?.data);
        dispatch(signup(data)).then((res) => {
          if (res?.payload?.status === 200) {
            setLoader(false);
            console.log(data);
            SuccessToast("Google Sign Up Successfully");
            console.log("hhh", res);
            localStorage.setItem("_id", res?.payload?.data?.id);
            localStorage.setItem("token", res?.payload?.token);
            localStorage.setItem("role", res?.payload?.data.role);
            localStorage.setItem(
              "profileupdate",
              res?.payload?.data?.profileUpdate
            );

            // navigate(`/OrgnizationDetails/${datas?.data?.email}`);

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
    (data) => {
      const datas = {
        code: data,
      };
      dispatch(LinkdinAuth(datas)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log("this is response", res);
          setLoader(false);
          localStorage.setItem("_id", res?.payload?.data?.id);
          localStorage.setItem("token", res?.payload?.token);
          SuccessToast("Linkedin login");

          // localStorage.setItem("profileupdate", res?.payload?.data?.profileUpdate);

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
    },
    [dispatch, navigate]
  );
  const debouncedLinkedInLoginWithOrg = useCallback(
    (data) => {
      const datas = {
        code: data,
        organizationName: "as",
      };
      dispatch(LinkdinAuth(datas)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log("this is response", res);
          setLoader(false);
          localStorage.setItem("_id", res?.payload?.data?.id);
          localStorage.setItem("token", res?.payload?.token);
          SuccessToast("Linkedin login");

          // localStorage.setItem("profileupdate", res?.payload?.data?.profileUpdate);

          if (res?.payload?.data?.role !== "user") {
            navigate(`/OrgnizationDetails/${res?.payload?.data?.email}`);
          } else if (res?.payload?.data?.profileUpdate === false) {
            navigate("/Profile");
          } else {
            navigate("/Dashboard");
          }
          // navigate(`/OrgnizationDetails/${res?.payload?.data?.email}`);
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    },
    [dispatch, navigate]
  );

  const { linkedInLogin } = useLinkedIn({
    //client cred
    clientId: "77oc0z5qmkqij2",
    // clientId: "78hailyq7y87as",
    redirectUri: `https://webapp.pocketfiler.com/linkedin`,

    scope: "openid,profile,email",
    onSuccess: (code) => {
      try {
        if (count === 0) {
          console.log(code, "codecodecodecode");
          debounce(debouncedLinkedInLogin, 300)(code);
        } else {
          debounce(debouncedLinkedInLoginWithOrg, 300)(code);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const [userPasswordError, setUserPasswordError] = useState("");
  const [orgPasswordError, setOrgPasswordError] = useState("");

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
    if (!fullname) {
      ErrorToast("Please Enter Full Name");
      return false;
    } else if (!email) {
      ErrorToast("Please Enter Email");
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      ErrorToast("Please Enter a valid Email");
      return false;
    } else if (!password) {
      ErrorToast("Please Enter Password");
      return false;
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setUserPasswordError(passwordError);

        return false;
      }
    }
    if (!agreeUserTerms) {
      ErrorToast("Please agree to Terms, Privacy Policy and Fees");
      return false;
    }
    return true;
  };
  const formValidationOrg = () => {
    if (!usernameorg) {
      ErrorToast("Please Enter User Name");
      return false;
    } else if (!organizationName) {
      ErrorToast("Please Enter Organization Name");
      return false;
    } else if (!passwordorg) {
      ErrorToast("Please Enter Password");
      return false;
    } else {
      const passwordError = validatePassword(passwordorg);
      if (passwordError) {
        setOrgPasswordError(passwordError);
        return false;
      }
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailorg) {
      ErrorToast("Please Enter Email");
      return false;
    } else if (!emailRegex.test(emailorg)) {
      ErrorToast("Please Enter a valid Email");
      return false;
    } else if (!agreeOrgTerms) {
      ErrorToast("Please agree to Terms, Privacy Policy and Fees");
      return false;
    }
    return true;
  };
  async function SignupUser() {
    console.log("User Account Signup");
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        // google: false,
        email: email,
        password: password,
        fullname: fullname,
        associateId: paramsUserID,
      };
      dispatch(signup(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(data);
          // SuccessToast("User Signed Up Successfully");
          navigate(`/SignUp-Verify/${email}`);
          // localStorage.setItem("_id", res?.payload?.data?._id);
          // localStorage.setItem("token", res?.payload?.token);
          // if (res?.payload?.data?.profileUpdate) {
          //   navigate("/");
          // } else {
          //   navigate("/Dashboard/Profile-Detail");
          // }
        } else {
          setLoader(false);

          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function SignupOrg() {
    console.log("Signup Org");
    const res = formValidationOrg();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        // google: false,
        email: emailorg,
        password: passwordorg,
        fullname: usernameorg,
        organizationName: organizationName,
        associateId: paramsUserID,
        role: "organization",
      };
      dispatch(signup(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(data);
          // SuccessToast("Organization Signed Up Successfully");
          navigate(`/SignUp-Verify/${emailorg}`);

          // localStorage.setItem("_id", res?.payload?.data?._id);
          // localStorage.setItem("token", res?.payload?.token);
          // if (res?.payload?.data?.profileUpdate) {
          //   navigate("/");
          // } else {
          //   navigate("/Dashboard/Profile-Detail");
          // }
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
          console.log(res?.payload?.message);
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
          <Col lg={6} className="signup-col-lhs">
            <div className="LHS-signup">
              <div className="login-logo-div">
                <img
                  src="/Images/pocketfiler_logo.png"
                  alt="logo"
                  style={{ height: 140, width: 160, objectFit: "contain" }}
                />
              </div>

              <div className="switch-main">
                <div
                  className={`btn-user ${count === 0 && "btn-active"} `}
                  onClick={() => {
                    setcount(0);
                  }}
                >
                  User account
                </div>
                <div
                  className={`btn-org ${count === 1 && "btn-active-org"} `}
                  onClick={() => {
                    setcount(1);
                  }}
                >
                  Organization account
                </div>
              </div>

              <h2 className="login-head">Create your account</h2>
              <p className="login-subtxt">
                Enter the field below to create your account
              </p>
              {count === 0 ? (
                <div>
                  <Form.Group className="email-div">
                    <Form.Label className="common-label">Full name</Form.Label>
                    <div className="email-input-contain">
                      <div className="email-input-div">
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          //   value="Majid Ali"
                          className="email-input"
                          onChange={(e) => setFullName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && SignupUser()}
                          // onFocus={() => handleFocus("input1", "/Images/Auth/profile-img.svg")}
                        />
                      </div>
                      <img
                        src={fullname.length > 0 ? nonEmpty1 : input1}
                        alt="Profile-icon"
                        className="img-at"
                      />
                      {/* {isProfileClicked ? (
                        <img
                          src="/Images/Auth/profile-img.svg"
                          alt="Profile-icon"
                          className="img-at"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/user-03.svg"
                          alt="Profile-icon"
                          className="img-at"
                        />
                      )} */}
                    </div>
                  </Form.Group>
                  <Form.Group className="email-div">
                    <Form.Label className="common-label label-diff">
                      Email address
                    </Form.Label>
                    <div className="email-input-contain">
                      <div className="email-input-div">
                        <Form.Control
                          type="email"
                          placeholder="Enter Email"
                          className="email-input"
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && SignupUser()}
                        />
                      </div>
                      <img
                        src={email.length > 0 ? nonEmpty2 : input2}
                        alt="@"
                        className="signup-img-at"
                      />
                      {/* {isInputClicked ? (
                        <img
                          src="/Images/Auth/at-sign.svg"
                          alt="@"
                          className="signup-img-at"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/at-sign1.svg"
                          alt="@"
                          className="signup-img-at"
                        />
                      )} */}
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
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && SignupUser()}
                          // onFocus={() => handleFocus("input3", "/Images/Auth/lock-01.svg")}
                        />
                      </div>
                      <img
                        src={password.length > 0 ? nonEmpty3 : input3}
                        alt="/"
                        className="account-img-lock"
                      />
                      {/* {isPassClicked ? (
                        <img
                          src="/Images/Auth/lock-01.svg"
                          alt="lock"
                          className="account-img-lock"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/Icon.svg"
                          alt="/"
                          className="account-img-lock"
                        />
                      )} */}

                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        className="img-eye"
                      >
                        {!showPassword ? (
                          <img
                            src="/Images/Auth/eye-off.svg"
                            alt="eyeoff"
                            className=""
                          />
                        ) : (
                          <img
                            src="/Images/Auth/eye.svg"
                            alt="eyeoff"
                            className=""
                          />
                        )}
                      </IconButton>
                    </div>
                  </Form.Group>
                  {userPasswordError && (
                    <div className="error-message">{userPasswordError}</div>
                  )}
                  <Form.Check
                    label={
                      <span>
                        I agree to all{" "}
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            navigate("/PrivacyPolicy", {
                              state: { title: "Terms" },
                            })
                          }
                        >
                          Terms
                        </span>{" "}
                        and{" "}
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            navigate("/PrivacyPolicy", {
                              state: { title: "Privacy Policy" },
                            })
                          }
                        >
                          Privacy Policy
                        </span>{" "}
                      </span>
                    }
                    type="checkbox"
                    aria-label="checkbox user"
                    className="checkbox-top"
                    checked={agreeUserTerms}
                    onChange={(e) => setAgreeUserTerms(e.target.checked)}
                  />

                  <Button className="Login-btn btn-top" onClick={SignupUser}>
                    Create account
                  </Button>
                  <div className="Or-div">
                    <p className="or-login-txt">Or signup with </p>
                    <hr className="custom-hr"></hr>
                  </div>
                  <div className="options-signup-div">
                    <div
                      onClick={() => {
                        if (!agreeUserTerms) {
                          ErrorToast(
                            "Please agree to Terms, Privacy Policy and Fees"
                          );
                          return false;
                        }
                        linkedInLogin();
                      }}
                      className="option-signup"
                    >
                      <img src="/Images/Auth/linkedin.svg" alt="Linkedin" />
                    </div>

                    <div
                      className="option-signup"
                      onClick={() => {
                        if (!agreeUserTerms) {
                          ErrorToast(
                            "Please agree to Terms, Privacy Policy and Fees"
                          );
                          return false;
                        } else {
                          logingoogleUser();
                        }
                      }}
                    >
                      <img src="/Images/Auth/google.svg" alt="Google" />
                    </div>
                  </div>
                  <p className="already-txt">
                    Already have an account?{" "}
                    <span className="signup-span" onClick={() => navigate("/")}>
                      {" "}
                      Login{" "}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <Form.Group className="email-div">
                    <Form.Label className="common-label">User name</Form.Label>
                    <div className="email-input-contain">
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        //   value="Majid Ali"
                        className="email-input"
                        onKeyDown={(e) => e.key === "Enter" && SignupOrg()}
                        onChange={(e) => setUsernameorg(e.target.value)}
                      />
                      <img
                        src={usernameorg.length > 0 ? nonEmpty1 : input1}
                        alt="Profile-icon"
                        className="img-at"
                      />
                      {/* {isProfileClicked ? (
                        <img
                          src="/Images/Auth/profile-img.svg"
                          alt="Profile-icon"
                          className="img-at"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/user-03.svg"
                          alt="Profile-icon"
                          className="img-at"
                        />
                      )} */}
                    </div>
                  </Form.Group>
                  <Form.Group className="email-div">
                    <Form.Label className="common-label label-diff">
                      Organization name
                    </Form.Label>
                    <div className="email-input-contain">
                      <div className="email-input-div">
                        <Form.Control
                          type="text"
                          placeholder="Enter Organization Name"
                          //   value="Majid Ali"
                          className="email-input"
                          onChange={(e) => setOrganizationName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && SignupOrg()}
                          // onClick={handleOrgClick}
                        />
                      </div>
                      <img
                        src={organizationName.length > 0 ? nonEmpty4 : input4}
                        alt="organization-icon"
                        className="img-org"
                      />
                      {/* {isOrgClicked ? (
                        <img
                          src="/Images/Auth/org-icon.svg"
                          alt="organization-icon"
                          className="img-org"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/building-07.svg"
                          alt="organization-icon"
                          className="img-org"
                        />
                      )} */}
                    </div>
                  </Form.Group>
                  <Form.Group className="email-div">
                    <Form.Label className="common-label label-diff">
                      Email address
                    </Form.Label>
                    <div className="email-input-contain">
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        className="email-input"
                        onChange={(e) => setEmailorg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && SignupOrg()}
                      />
                      <img
                        src={emailorg.length > 0 ? nonEmpty2 : input2}
                        alt="@"
                        className="signup-img-at"
                      />
                      {/* {isInputClicked ? (
                        <img
                          src="/Images/Auth/at-sign.svg"
                          alt="@"
                          className="signup-img-at"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/at-sign1.svg"
                          alt="@"
                          className="signup-img-at"
                        />
                      )} */}
                    </div>
                  </Form.Group>

                  <Form.Group className="email-div">
                    <Form.Label className="common-label label-diff">
                      Password
                    </Form.Label>
                    <div className="email-input-contain">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="email-input"
                        onChange={(e) => setPasswordorg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && SignupOrg()}
                      />
                      <img
                        src={passwordorg.length > 0 ? nonEmpty3 : input3}
                        alt="lock"
                        className="account-img-lock"
                      />

                      {/* {isPassClicked ? (
                        <img
                          src="/Images/Auth/lock-01.svg"
                          alt="lock"
                          className="account-img-lock"
                        />
                      ) : (
                        <img
                          src="/Images/Auth/Icon.svg"
                          alt="/"
                          className="account-img-lock"
                        />
                      )} */}

                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        className="img-eye"
                        style={{ top: "57%" }}
                      >
                        {!showPassword ? (
                          <img src="/Images/Auth/eye-off.svg" alt="eyeoff" />
                        ) : (
                          <img src="/Images/Auth/eye.svg" alt="eyeoff" />
                        )}
                      </IconButton>
                    </div>
                  </Form.Group>
                  {orgPasswordError && (
                    <div className="error-message">{orgPasswordError}</div>
                  )}

                  <Form.Check
                    label={
                      <span>
                        I agree to all{" "}
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            navigate("/PrivacyPolicy", {
                              state: { title: "Terms" },
                            })
                          }
                        >
                          Terms
                        </span>{" "}
                        and{" "}
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            navigate("/PrivacyPolicy", {
                              state: { title: "Privacy Policy" },
                            })
                          }
                        >
                          Privacy Policy
                        </span>{" "}
                        and Fees
                      </span>
                    }
                    type="checkbox"
                    aria-label="checkbox org"
                    className="checkbox-top"
                    checked={agreeOrgTerms}
                    onChange={(e) => setAgreeOrgTerms(e.target.checked)}
                  />
                  <Button
                    className="Login-btn btn-top"
                    onClick={SignupOrg}
                    disabled={!agreeOrgTerms}
                  >
                    Create account
                  </Button>

                  <div className="Or-div">
                    <p className="or-login-txt">Or signup with </p>
                    <hr className="custom-hr"></hr>
                  </div>
                  <div className="options-signup-div">
                    <div
                      className="option-signup"
                      onClick={() => {
                        if (!agreeOrgTerms) {
                          ErrorToast(
                            "Please agree to Terms, Privacy Policy and Fees"
                          );
                          return false;
                        } else {
                          linkedInLogin();
                        }
                      }}
                    >
                      <img src="/Images/Auth/linkedin.svg" alt="Linkedin" />
                    </div>

                    <div
                      className="option-signup"
                      onClick={() => {
                        if (!agreeOrgTerms) {
                          ErrorToast(
                            "Please agree to Terms, Privacy Policy and Fees"
                          );
                          return false;
                        } else {
                          logingoogleOrg();
                        }
                      }}
                    >
                      <img src="/Images/Auth/google.svg" alt="Google" />
                    </div>
                  </div>
                  <p className="already-txt">
                    Already have an account?{" "}
                    <span className="signup-span" onClick={() => navigate("/")}>
                      {" "}
                      Login{" "}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Col>
          <Col className="rhs-login-col" lg={6}>
            <div className="login-img-div h-100">
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
