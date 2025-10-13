import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { withdrawProjectPayment } from "../../../services/redux/middleware/Payment/payment";
import { ErrorToast, SuccessToast } from "../../toast/Toast";
import "./ProjectPayment.css";

// onRequireStripeConnect (optional): callback to open the Stripe connect modal
const WithdrawPaymentModal = ({
  show,
  onHide,
  projectData,
  amount,
  onRequireStripeConnect,
}) => {
  const dispatch = useDispatch();
  const [withdrawing, setWithdrawing] = useState(false);
  const userId = localStorage.getItem("_id");
  // Use cached Redux state only (no API call here)
  const { isStripeConnected } = useSelector((state) => state.payment);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const escrowAmount = Number(amount || projectData?.amount || 0);

  const handleWithdraw = async () => {
    // Do not call API to check status here. Use cached Redux flag.
    if (!isStripeConnected) {
      // Close this modal and ask parent to open connect modal
      if (typeof onHide === "function") onHide();
      if (typeof onRequireStripeConnect === "function")
        onRequireStripeConnect();
      return;
    }

    if (!userId) {
      ErrorToast("User ID not found. Please log in again.");
      return;
    }

    if (!projectData?.projectId && !projectData?._id) {
      ErrorToast("Project ID not found.");
      return;
    }

    setWithdrawing(true);

    try {
      const projectId = projectData.projectId || projectData._id;

      console.log("🔵 [WITHDRAW PAYMENT] Initiating:", {
        userId,
        projectId,
        amount: escrowAmount,
      });

      const result = await dispatch(
        withdrawProjectPayment({
          userId,
          projectId,
          amount: escrowAmount,
        })
      );

      console.log("📊 [WITHDRAW PAYMENT] Response:", result?.payload);

      if (result?.payload?.status === 200 || result?.payload?.success) {
        SuccessToast("Payment withdrawn successfully!");
        onHide();
        // Optionally refresh project data here
      } else {
        ErrorToast(
          result?.payload?.message ||
            "Failed to withdraw payment. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ [WITHDRAW PAYMENT] Error:", error);
      ErrorToast("An error occurred. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="withdraw-payment-modal"
    >
      <Modal.Body className="text-center p-5">
        <div className="mb-4">
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#F0F4FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
                fill="#635BFF"
              />
            </svg>
          </div>
        </div>

        <h4 className="mb-3" style={{ fontWeight: "600" }}>
          Document verification
        </h4>

        <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
          Please send the signed documents for verification. Once we received
          them, it proceeds.
        </p>

        <div
          className="mb-4 p-3"
          style={{
            backgroundColor: "#F8F9FA",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <p className="mb-1" style={{ fontSize: "12px", color: "#6C757D" }}>
            Amount to withdraw:
          </p>
          <h3 style={{ fontWeight: "700", color: "#0A2540", margin: 0 }}>
            {formatCurrency(escrowAmount)}
          </h3>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={withdrawing}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "8px",
              border: "1px solid #DEE2E6",
              backgroundColor: "white",
              color: "#6C757D",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleWithdraw}
            disabled={withdrawing}
            style={{
              flex: 1,
              backgroundColor: "#0A2540",
              border: "none",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "8px",
            }}
          >
            {withdrawing ? "Processing..." : "Withdraw payment"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WithdrawPaymentModal;
