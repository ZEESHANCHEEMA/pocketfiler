import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  return (
    <>
      <Header headername={"Settings"} />
      <div className="settings__container">
        <div className="settings__grid">
          <button
            className="settings__card"
            onClick={() => navigate("/Profile")}
          >
            <span className="settings__card-text">Profile</span>
            <img src="/Images/Clients/arrow.svg" alt="go" />
          </button>

          {role !== "organization" && (
            <button
              className="settings__card"
              onClick={() => navigate("/ReferFriend")}
            >
              <span className="settings__card-text">Refer a friend</span>
              <img src="/Images/Clients/arrow.svg" alt="go" />
            </button>
          )}

          <button
            className="settings__card"
            onClick={() => navigate("/Subscription")}
          >
            <span className="settings__card-text">Subscribe Plan</span>
            <img src="/Images/Clients/arrow.svg" alt="go" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;
