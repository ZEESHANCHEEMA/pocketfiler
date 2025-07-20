import React, { useState, useEffect } from "react";
import "./profile.css";
import Header from "../../Components/Header/Header";
import { API_URL } from "../../services/client.js";
import api from "../../services/apiInterceptor.js";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../services/redux/middleware/signin.js";
import ScreenLoader from "../../Components/loader/ScreenLoader.js";
import { ErrorToast, SuccessToast } from "../../Components/toast/Toast.js";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Userrole, setUserRole] = useState();
  const [ID, setID] = useState();

  const defaultprofile = "/Images/default-profile.png";
  const [loader, setLoader] = useState(false);
  const [UserName, setUserName] = useState("");
  const [OrgName, setOrgName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhNo, setPhNo] = useState("");
  const [imageSrc, setImageSrc] = useState(defaultprofile);
  const [showModal, setShowModal] = useState(false);
  const [initialUserData, setInitialUserData] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(
      (prevShowCurrentPassword) => !prevShowCurrentPassword
    );
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  const userData = useSelector((state) => state?.profile?.profile?.data);
  const userLoading = useSelector((state) => state?.profile);
  useEffect(() => {
    const userroles = localStorage.getItem("role");
    setUserRole(userroles);
  }, [Userrole]);

  useEffect(() => {
    const id = localStorage.getItem("_id");
    setID(id);
    dispatch(getProfile(id));
  }, [ID]);

  useEffect(() => {
    localStorage.setItem("profileupdate", userData?.profileUpdate);
    setUserName(userData?.fullname);
    setEmail(userData?.email);
    setPhNo(userData?.phoneNo ?? "");
    if (userData?.profilePicture) {
      setImageSrc(userData?.profilePicture);
    } else {
      setImageSrc("/Images/default-profile.png");
    }
    if (userData?.role === "organization") {
      setOrgName(userData?.organizationName);
    } else {
      setOrgName("");
    }
  }, [userData]);

  const handlePhoneNo = (e) => {
    const formattedValue = e
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

    if (formattedValue) {
      const newValue = [
        formattedValue[1] && `(${formattedValue[1]}`,
        formattedValue[2] && `) ${formattedValue[2]}`,
        formattedValue[3] && `-${formattedValue[3]}`,
      ]
        .filter(Boolean)
        .join("");

      setPhNo(newValue);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`${API_URL}/upload/uploadimage`, formData);

        if (res.status === 200) {
          setLoader(false);
          setImageSrc(res?.data?.data);
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

  const validatePassword = (newPassword) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /\d/;
    if (
      !specialCharRegex.test(newPassword) ||
      !numberRegex.test(newPassword) ||
      newPassword.length < 8
    ) {
      return "Password must be 8 characters long with at least one special character and one number.";
    }
    return null;
  };

  const formValidation = () => {
    if (imageSrc === "/Images/Profile/profile-icon.svg") {
      ErrorToast("Please upload image");
      return false;
    } else if (userData?.role === "organization" && !OrgName.trim()) {
      ErrorToast("Please enter your Organization");
      return false;
    } else if (!UserName.trim()) {
      ErrorToast("Please enter your user name");
      return false;
    } else if (!PhNo.trim()) {
      ErrorToast("Please enter your Phone Number");
      return false;
    } else if (
      newPassword.trim() && // Validate only if newPassword is provided
      !(userData?.isGoogleSignIn || userData?.islinkedinSignIn)
    ) {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        ErrorToast(passwordError);
        return false;
      }
    }
    return true;
  };

  async function updateUser() {
    try {
      const formValid = formValidation();
      if (formValid === false) {
        return;
      }
      setLoader(true);
      const res = await api.post(`${API_URL}/auth/updateProfile`, {
        fullName: UserName,
        organizationName: OrgName,
        phoneNo: PhNo,
        newPassword: newPassword,
        currentPassword: currentPassword,
        profilePicture: imageSrc,
        userId: ID,
      });
      if (res.status === 200) {
        localStorage.setItem("profileupdate", true);
        dispatch(getProfile(ID));
        SuccessToast("Profile Updated Successfully");
        setLoader(false);
        setUserName("");
        setPhNo("");
        setOrgName("");
        setNewPassword("");
        setCurrentPassword("");
      }
    } catch (error) {
      setLoader(false);
      ErrorToast(
        error?.response?.data?.message ??
          "An unexpected error occurred. Please try again later."
      );
    }
  }

  async function deleteUser() {
    navigate(`/DeleteAccount/${ID}`);
  }

  useEffect(() => {
    if (userData) {
      setInitialUserData({
        fullName: userData?.fullname || "",
        organizationName: userData?.organizationName || "",
        phoneNo: userData?.phoneNo || "",
        newPassword: "",
        profilePicture: userData?.profilePicture || defaultprofile,
      });

      setUserName(userData?.fullname || "");
      setEmail(userData?.email || "");
      setPhNo(userData?.phoneNo || "");
      setNewPassword("");
      setImageSrc(userData?.profilePicture || defaultprofile);
      setOrgName(
        userData?.role === "organization" ? userData?.organizationName : ""
      );
    }
  }, [userData]);

  const hasChanges = () => {
    return (
      UserName !== initialUserData.fullName ||
      OrgName !== initialUserData.organizationName ||
      PhNo !== initialUserData.phoneNo ||
      newPassword !== initialUserData.newPassword ||
      imageSrc !== initialUserData.profilePicture
    );
  };

  return (
    <>
      <Header headername={"Profile"} />
      {userLoading.loading && <ScreenLoader />}
      {loader && <ScreenLoader />}
      <div
        className="profile__body"
        style={{ zIndex: "3", position: "relative" }}
      >
        <div className="profile__main">
          <label className="profile__main-image" htmlFor="file-input">
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
          />
          <div className="profile__main-values">
            <div className="profile__main-input">
              <label htmlFor="inputField">User name</label>
              <input
                type="text"
                id="inputField"
                placeholder="User name"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            {Userrole === "organization" ? (
              <div className="profile__main-input4">
                <label htmlFor="inputField">Organization name</label>
                <input
                  type="text"
                  id="inputField"
                  value={OrgName}
                  placeholder="Organization name"
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
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="profile__main-input1">
              <label htmlFor="inputField">Contact number</label>
              <input
                type="tel"
                id="inputField"
                placeholder="Please enter your phone number"
                value={PhNo}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                maxLength="20"
                onChange={(e) => handlePhoneNo(e.target.value)}
              />
            </div>

            {!!userData?.isGoogleSignIn ||
            !!userData?.islinkedinSignIn ? null : (
              <div>
                <h5 className="mb-3">Update Password</h5>
                <div style={{ display: "flex", gap: "24px" }}>
                  <div className="profile__main-input3">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="inputField"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button onClick={toggleCurrentPasswordVisibility}>
                      {showCurrentPassword ? (
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
                      )}
                    </button>
                  </div>

                  <div className="profile__main-input3">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="inputField"
                      placeholder="Enter current password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={toggleNewPasswordVisibility}>
                      {showNewPassword ? (
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
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile__main-btn">
            <button
              className="m-4"
              disabled={!hasChanges()}
              style={{ backgroundColor: !hasChanges() ? "gray" : "" }}
              onClick={updateUser}
            >
              Update profile
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4">
          <div className="d-flex justify-content-center mb-3">
            <FaTrashAlt size={80} color="red" />
          </div>
          <h5 className="mb-3">
            Are you sure you want to temporarily deactivate your account?
          </h5>
          <p className="text-muted">
            Your account will be temporarily deactivated, and you won’t be able
            to access it until you reactivate it.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No, Keep My Account
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            Yes, Deactivate My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
