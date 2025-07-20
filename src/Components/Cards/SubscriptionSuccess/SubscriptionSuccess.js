import React from "react";
import { useDispatch } from "react-redux";
import "./sucess.css";

export default function SubscriptionSuccess() {

  return (
    <>
      <div className="sub-card">
        <div>
          <img
            src="/Images/Subscription/success-sub.svg"
            alt="success"
            className="success-img"
          />
        </div>
        <div>
          <p className="card-sub-head">Successfully Subscribed</p>
          <p className="card-subscribe-sub">
            You will be redirected to your subscription page to see the details
            of your subscription
          </p>
        </div>
      </div>
    </>
  );
}
