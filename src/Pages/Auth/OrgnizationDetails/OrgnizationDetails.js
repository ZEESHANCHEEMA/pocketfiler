import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./orgnization.css";
import Button from "@mui/material/Button";
import AccountSuccess from "../../../Components/Modals/AccountCreatedSuccess/AccountSuccess";
import { useMediaQuery } from "react-responsive";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useDispatch } from "react-redux";
import { GoogleOrgSignUp } from "../../../services/redux/middleware/signin";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function OrgnizationDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [otpinputValue, setOtpInputValue] = useState(["", "", "", ""]);

  const [username, setUsername] = useState(location?.state?.name ?? "");
  const [organizationName, setOrganizationName] = useState("");

  const formValidation = () => {
    if (!username) {
      ErrorToast("Please Enter User Name");
      return false;
    } else if (!organizationName) {
      ErrorToast("Please Enter Organization Name");
      return false;
    }
  };

  const { Orgemail } = useParams();

  async function OrgSignupGoogle() {
    console.log("User Account Signup");
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        email: Orgemail,
        isGoogleSignIn: true,
        organizationName: organizationName,
        islinkedinSignIn: false,
        fullname: username,
      };
      localStorage.clear();
      dispatch(GoogleOrgSignUp(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(data);
          SuccessToast("Organizations profile has been created successfully");
          localStorage.setItem("_id", res?.payload?.data?.id);
          localStorage.setItem("role", res?.payload?.data.role);
          localStorage.setItem(
            "profileupdate",
            res?.payload?.data?.profileUpdate
          );

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
  }

  return (
    <>
      <Container fluid className="login-main">
        <Row className="row-login row-forgot">
          <Col lg={6} md={12} sm={12} className="signup-verify-lhs">
            <div className="LHS-organization">
              <div className="login-logo-div">
                <img src="/Images/Auth/pocketfiler - logo.svg" alt="logo" />
              </div>

              <h2 className="login-head">Organization details</h2>
              <p className="login-subtxt">
                Please enter your Organization details
              </p>

              <div className="">
                <Form.Group className="email-div">
                  <Form.Label className="common-label">User name</Form.Label>
                  <div className="email-input-contain">
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      //   value="Majid Ali"
                      className="email-input"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <img
                      src="/Images/Auth/profile-img.svg"
                      alt="Profile-icon"
                      className="img-at"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="email-div">
                  <Form.Label className="common-label label-diff">
                    Organization name
                  </Form.Label>
                  <div className="email-input-contain">
                    <Form.Control
                      type="text"
                      placeholder="Enter Organization Name"
                      //   value="Majid Ali"
                      className="email-input"
                      onChange={(e) => setOrganizationName(e.target.value)}
                    />
                    <img
                      src="/Images/Auth/org-icon.svg"
                      alt="organization-icon"
                      className="img-org"
                    />
                  </div>
                </Form.Group>
              </div>

              <Button
                className="Organization-Submit-btn"
                // onClick={() => setModalShow(true)}
                onClick={OrgSignupGoogle}
              >
                Create account
              </Button>
              <AccountSuccess
                show={modalShow}
                onHide={() => setModalShow(false)}
              />

              <div className="receive-code-div">
                {/* <p className="dont-txt txt-btm">
                  Didn’t receive the code?{" "}
                  <span className="signup-span"> Request again </span>
                </p> */}
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
