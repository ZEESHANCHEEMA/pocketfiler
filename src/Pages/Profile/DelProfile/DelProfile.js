import React, { useState, useEffect } from "react";
// import Sidebar from "../../Components/Sidebar/Sidebar";
import "../../Profile/profile.css";
// import axios from "axios";
// import AddClients from "../../Components/Modals/AddClients/AddClients";
// import Header from "../../Components/Header/Header";
import { API_URL } from "../../../services/client.js";
import api from "../../../services/apiInterceptor.js";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  getProfileImage,
} from "../../../services/redux/middleware/signin.js";
import ScreenLoader from "../../../Components/loader/ScreenLoader.js";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast.js";
// import { Password } from "@mui/icons-material";
import { deleteProfile } from "../../../services/redux/middleware/getContract.js";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [Userrole, setUserRole] = useState();
  const [ID, setID] = useState();
  const { userid } = useParams();

  const defaultprofile = "/Images/profile_prev_ui.png";
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [UserName, setUserName] = useState("");
  const [OrgName, setOrgName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhNo, setPhNo] = useState("");
  const [password, setPassword] = useState("");
  const [imageSrc, setImageSrc] = useState(defaultprofile);
  const [showPassword, setShowPassword] = useState(false);
  const [userPasswordError, setUserPasswordError] = useState("");
  const [userId, setUserId] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const userData = useSelector((state) => state?.profile?.profile?.data);
  console.log(userData, "userDatauserDatauserDatauserData");
  const userLoading = useSelector((state) => state?.profile);

  useEffect(() => {
    const userroles = localStorage.getItem("role");
    setUserRole(userroles);
  }, [Userrole]);

  useEffect(() => {
    dispatch(getProfile(userid));
  }, [ID]);

  useEffect(() => {
    localStorage.setItem("profileupdate", userData?.profileUpdate);
    setUserName(userData?.fullname);
    setEmail(userData?.email);
    setPhNo(userData?.phoneNo);
    setPassword(userData?.password);
    if (userData?.profilePicture) {
      setImageSrc(userData?.profilePicture);
    } else {
      setImageSrc("/Images/profile_prev_ui.png");
    }
    if (userData?.role === "organization") {
      setOrgName(userData?.organizationName);
    } else {
      setOrgName("");
    }

    // setTelegram(userData?.telegramHandle);
    // setXhandle(userData?.xHandle);
  }, [userData]);

  const handlePhoneNo = (e) => {
    const value = e;
    // Remove any non-numeric characters
    const formattedValue = value.replace(/[^\d-]/g, "");
    setPhNo(formattedValue);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file, "tjis is file");

    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);
        const res = await api.post(`${API_URL}/upload/uploadimage`, formData);

        if (res.status === 200) {
          console.log("profile Response", res);
          console.log("Profile Picture Uploaded");
          setLoader(false);

          setImageSrc(res?.data?.data);
          console.log(res?.data?.data, "this is the url");
          SuccessToast("Profile Uploaded Successfully");
        } else {
          ErrorToast(res.error);
          setLoader(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoader(false);
      }
    }
  };

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
    if (imageSrc === "/Images/Profile/profile-icon.svg") {
      ErrorToast("Please upload image ");
      return false;
    } else if (userData?.role === "organization" && !OrgName) {
      ErrorToast("Please enter your Organization");
      return false;
    } else if (!UserName) {
      ErrorToast("Please Enter your User Name");
      return false;
    } else if (!PhNo) {
      ErrorToast("Please enter your Phone Number");
      return false;
    } else if (!password) {
      ErrorToast("Please enter your Password");
      return false;
    }
    return true;
  };

  // async function DeleteProfile() {

  //   try {
  //     dispatch(deleteProfile()).then((res) => {
  //       if (res?.payload?.status === 200) {
  //         console.log(res.payload.message);
  //         SuccessToast("Profile Deleted Successfully");
  //         const userid = localStorage.getItem("_id");
  //         const emailid = localStorage.getItem("_email");
  //         console.log("user id ", userid);
  //         setUserId(userid);
  //         setEmailId(emailid);
  //         const data = {
  //           id: userid,
  //           email: emailid,
  //         };
  //         dispatch(deleteProfile(data));
  //         console.log("user id ", data);
  //       } else {
  //         console.log(res);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    console.log("user id ", userId);
  }, []);

  async function DeleteProfile() {
    console.log("before del acc", {
      email: Email,
      userId: userId,
    });
    try {
      const data = {
        email: Email,
        userId: userId,
      };
      dispatch(deleteProfile(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          SuccessToast("Account Deleted Successfully");
          const userid = localStorage.getItem("_id");
          console.log("user id ", userid);
          setUserId(userid);
          const data = {
            id: userid,
          };
          dispatch(deleteProfile(data));
          console.log("user id ", data);
          localStorage.clear();

          navigate("/");
        } else if (res?.payload?.status === 400) {
          ErrorToast(res.payload.message);
        } else {
          ErrorToast(res.payload.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* <Header headername={"Profile"} /> */}
      {userLoading.loading && <ScreenLoader />}
      {loader && <ScreenLoader />}
      <div
        className="profile__body"
        style={{ zIndex: "3", position: "relative" }}
      >
        <div className="profile__main">
          {/* <label className="profile__main-image" htmlFor="file-input">
            <img
              src={imageSrc}
              alt="profile-img"
              style={{ cursor: "pointer" }}
              className={
                imageSrc !== defaultprofile
                  ? "profile-img-updated"
                  : "profile-img"
              }
            />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          /> */}
          <h1 className="del">Delete Account</h1>
          <div className="profile__main-values">
            <div className="profile__main-input">
              <label htmlFor="inputField">User name</label>
              <input
                type="text"
                id="inputField"
                placeholder="Jimmy Carter"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            {Userrole === "organization" ? (
              <div className="profile__main-input4">
                <label htmlFor="inputField">Organization name</label>
                <input
                  readOnly
                  type="text"
                  id="inputField"
                  value={OrgName}
                  placeholder="Jimmy & Co."
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
            ) : null}

            <div className="profile__main-input2">
              <label htmlFor="inputField">Email address</label>
              <input
                readOnly
                type="email"
                id="inputField"
                value={Email}
                placeholder="majidali.designer@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="profile__main-input1">
              <label htmlFor="inputField">Contact number</label>
              <input
                type="tel"
                id="inputField"
                placeholder="654-098-731"
                value={PhNo}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                // onChange={(e) => setPhNo(e.target.value)}
                onChange={(e) => handlePhoneNo(e.target.value)}
              />
            </div>
            {userData?.isGoogleSignIn || userData?.islinkedinSignIn ? null : (
              <>
                <div className="profile__main-input3">
                  <label htmlFor="inputField">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="inputField"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // const error = validatePassword(e.target.value);
                      // setUserPasswordError(error);
                    }}
                  />

                  <button onClick={togglePasswordVisibility}>
                    {" "}
                    {showPassword ? (
                      <img
                        src="/Images/Profile/eye.svg"
                        className="profile-eye"
                        alt="/"
                      />
                    ) : (
                      <img
                        src="/Images/Profile/eye-off.svg"
                        className="profile-eye"
                        alt=""
                      />
                    )}{" "}
                  </button>
                </div>
                {/* <div>
                {userPasswordError && (
                    <div className="error-message">{userPasswordError}</div>
                  )}
                </div> */}
              </>
            )}
          </div>

          <div className="profile__main-btn">
            <button onClick={DeleteProfile}>Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
