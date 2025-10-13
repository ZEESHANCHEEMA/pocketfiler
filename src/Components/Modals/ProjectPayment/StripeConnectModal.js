import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ErrorToast, SuccessToast } from "../../toast/Toast";
import api from "../../../services/apiInterceptor";
import { API_URL } from "../../../services/client";
import "./ProjectPayment.css";
import { useSelector } from "react-redux";

const StripeConnectModal = ({ show, onHide, onSuccess }) => {
  const [connecting, setConnecting] = useState(false);
  const userId = localStorage.getItem("_id");
  const {
    isStripeConnected,
    detailsSubmitted,
    chargesEnabled,
    payoutsEnabled,
  } = useSelector((state) => state.payment);

  const handleConnectStripe = async () => {
    setConnecting(true);

    try {
      const email =
        localStorage.getItem("email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;

      if (!email) {
        ErrorToast("Email not found. Please log out and log in again.");
        setConnecting(false);
        return;
      }

      // debug logs removed

      // Step 1: Create Stripe Connect account (direct API)
      const createRes = await api.post(
        `${API_URL}/api/stripe/connect/account`,
        {
          userId,
          email,
        }
      );

      const accountId =
        createRes?.data?.account?.id ||
        createRes?.data?.account_id ||
        createRes?.data?.id;

      // debug logs removed

      if (createRes?.status === 200 && accountId) {
        // account created

        // Step 2: Get account onboarding link (direct API)
        const linkRes = await api.post(
          `${API_URL}/api/stripe/connect/account-link`,
          {
            account_id: accountId,
            refresh_url: window.location.href,
            return_url: window.location.href,
          }
        );

        const onboardingUrl = linkRes?.data?.link?.url || linkRes?.data?.url;

        // debug logs removed

        if (onboardingUrl) {
          // redirect to onboarding
          SuccessToast("Redirecting to Stripe onboarding...");

          // Close modal and redirect to Stripe
          setTimeout(() => {
            window.location.href = onboardingUrl;
          }, 1000);
        } else {
          ErrorToast("Failed to get onboarding link. Please try again.");
          setConnecting(false);
        }
      } else {
        ErrorToast("Failed to create Stripe account. Please try again.");
        setConnecting(false);
      }
    } catch (error) {
      console.error("❌ [STRIPE CONNECT] Error:", error);
      ErrorToast("An error occurred. Please try again.");
      setConnecting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="stripe-connect-modal"
    >
      <Modal.Body className="text-center p-5">
        <div className="stripe-logo-container mb-4">
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#635BFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg
              width="60"
              height="25"
              viewBox="0 0 60 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 013.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 01-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 01-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 00-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        <h4 className="mb-3" style={{ fontWeight: "600" }}>
          {isStripeConnected ? "Stripe Connected" : "Stripe not connected"}
        </h4>

        <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
          {isStripeConnected
            ? "Your Stripe account is connected and ready to receive payments"
            : "Connect your Stripe account to withdraw payment"}
        </p>

        {/* Stripe Account Status */}
        {connecting && (
          <div className="stripe-status-check" style={{ marginTop: 15 }}>
            <p style={{ fontSize: 14, color: "#666" }}>
              Checking Stripe account status...
            </p>
          </div>
        )}

        {!connecting && !isStripeConnected && (
          <div
            className="stripe-not-connected"
            style={{
              marginTop: 15,
              padding: 10,
              backgroundColor: "#fff3cd",
              borderRadius: 8,
              border: "1px solid #ffc107",
            }}
          >
            <p style={{ fontSize: 14, color: "#856404", marginBottom: 0 }}>
              ⚠️ Stripe account not set up. Please complete Stripe onboarding to
              receive payments.
            </p>
          </div>
        )}

        {!connecting && isStripeConnected && (
          <div
            className="stripe-connected"
            style={{
              marginTop: 15,
              padding: 10,
              backgroundColor:
                detailsSubmitted && chargesEnabled && payoutsEnabled
                  ? "#d4edda"
                  : "#fff3cd",
              borderRadius: 8,
              border:
                detailsSubmitted && chargesEnabled && payoutsEnabled
                  ? "1px solid #28a745"
                  : "1px solid #ffc107",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color:
                  detailsSubmitted && chargesEnabled && payoutsEnabled
                    ? "#155724"
                    : "#856404",
                marginBottom: 5,
              }}
            >
              {detailsSubmitted && chargesEnabled && payoutsEnabled
                ? "✅ Stripe account fully setup"
                : "⚠️ Stripe account setup incomplete"}
            </p>
            <p
              style={{
                fontSize: 12,
                color:
                  detailsSubmitted && chargesEnabled && payoutsEnabled
                    ? "#155724"
                    : "#856404",
                opacity: 0.8,
                margin: 0,
              }}
            >
              Details: {detailsSubmitted ? "✓" : "✗"} | Charges:{" "}
              {chargesEnabled ? "✓" : "✗"} | Payouts:{" "}
              {payoutsEnabled ? "✓" : "✗"}
            </p>
            {(!detailsSubmitted || !chargesEnabled || !payoutsEnabled) && (
              <p
                style={{
                  fontSize: 12,
                  color: "#856404",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                Please complete your Stripe onboarding to receive payments
              </p>
            )}
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <Button
            onClick={onHide}
            disabled={connecting}
            variant="outline-secondary"
            style={{
              padding: "12px 40px",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnectStripe}
            disabled={
              connecting ||
              (isStripeConnected &&
                detailsSubmitted &&
                chargesEnabled &&
                payoutsEnabled)
            }
            style={{
              backgroundColor:
                isStripeConnected &&
                detailsSubmitted &&
                chargesEnabled &&
                payoutsEnabled
                  ? "#6c757d"
                  : "#0A2540",
              border: "none",
              padding: "12px 40px",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            {connecting
              ? "Connecting..."
              : isStripeConnected &&
                detailsSubmitted &&
                chargesEnabled &&
                payoutsEnabled
              ? "Fully Connected"
              : isStripeConnected
              ? "Complete Setup"
              : "Connect Stripe"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StripeConnectModal;
