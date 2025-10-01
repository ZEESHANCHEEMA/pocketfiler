import React from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "./RewardSuccess.css";

const RewardSuccess = (props) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    props.onHide();
    navigate("/subscription"); // Update this path to your plans/subscription page
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="reward-success-modal"
    >
      <Modal.Body className="reward-success__body">
        <button
          className="reward-success__close"
          onClick={props.onHide}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="reward-success__icon">
          <img
            src="/Images/Subscription/mdi_tick-all.svg"
            alt="success"
            className="success-img"
          />
        </div>

        <h2 className="reward-success__title">Successfully Reward Redeems</h2>
        <div className="reward-success__message-container">
          <p className="reward-success__message">
            {props.contractsEarned || 1} contract
            {(props.contractsEarned || 1) > 1 ? "s" : ""} and{" "}
            {props.lockersEarned || 1} encrypted locker
            {(props.lockersEarned || 1) > 1 ? "s" : ""} have been successfully
            added to your plan.
          </p>
        </div>

        <button
          className="reward-success__button"
          onClick={handleViewPlans}
          type="button"
        >
          View Plans
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default RewardSuccess;
