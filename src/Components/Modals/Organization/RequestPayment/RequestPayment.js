import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo, useState, useEffect } from "react";
import "./RequestPayment.css";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  withdrawProjectPayment,
  getStripeAccountStatus,
  getMyStripePayments,
} from "../../../../services/redux/middleware/Payment/payment";
import { SuccessToast, ErrorToast } from "../../../toast/Toast";
import StripeConnectModal from "../../ProjectPayment/StripeConnectModal";
// ScreenLoader is available if we want a full-screen loader in future

export default function RequestPayment(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [fetchingPayments, setFetchingPayments] = useState(false);
  const userId = localStorage.getItem("_id");

  // Get Stripe Connect status and payments from Redux
  const {
    isStripeConnected,
    detailsSubmitted,
    chargesEnabled,
    payoutsEnabled,
    myPayments,
  } = useSelector((state) => state.payment);

  const escrowAmount = useMemo(() => {
    // If a payment is selected, use that amount, otherwise use props
    if (selectedPayment) {
      return selectedPayment.amount / 100; // Convert from cents to dollars
    }
    const raw =
      props.paymentAmount ??
      props.projectData?.amount ??
      props.projectData?.escrowAmount ??
      0;
    const numeric = Number(raw) || 0;
    return numeric;
  }, [props.paymentAmount, props.projectData, selectedPayment]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const fetchAvailablePayments = async () => {
    try {
      setFetchingPayments(true);

      // Try without status filter first to see all payments
      const res = await dispatch(
        getMyStripePayments({
          // status: "succeeded", // Temporarily removed to see all payments
          page: 1,
          limit: 10,
        })
      );

      if (res?.payload?.status === 200 && res?.payload?.data?.length > 0) {
        // Auto pick the first payment for withdraw flow
        setSelectedPayment(res.payload.data[0]);
      } else {
        setSelectedPayment(null);
      }
    } catch (error) {
      // silently fail; UI will show empty state
    } finally {
      setFetchingPayments(false);
    }
  };

  const checkStripeAccountStatus = async () => {
    setCheckingAccount(true);

    const token = localStorage.getItem("token");

    // Try to decode JWT token to check expiration
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
        // If expired, backend will handle auth rejection
        void isExpired;
      } catch (e) {
        // ignore decode errors
      }
    }

    try {
      await dispatch(getStripeAccountStatus(userId));
      // no-op; state updates via redux
    } catch (error) {
      // ignore
    } finally {
      setCheckingAccount(false);
    }
  };

  // Check Stripe account status and fetch available payments when modal opens
  useEffect(() => {
    if (props.show && userId) {
      checkStripeAccountStatus();
      fetchAvailablePayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show, userId]);

  // Auto-select first payment when payments are loaded (fallback safety)
  useEffect(() => {
    if (myPayments && myPayments.length > 0) {
      setSelectedPayment((prev) => prev || myPayments[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPayments]);

  // Removed old create-account/link actions; handled in StripeConnectModal now.

  const handleRequestPayment = async () => {
    if (!props.projectData) {
      ErrorToast("Project data is missing");
      return;
    }

    // Check if Stripe account is connected
    if (!isStripeConnected) {
      console.log(
        "⚠️ [STRIPE NOT CONNECTED] User needs to set up Stripe account"
      );
      ErrorToast("Please set up your Stripe account first to receive payments");
      setShowStripeModal(true);
      props.onHide(); // Close the main modal
      return;
    }

    // Check if Stripe account setup is complete
    if (!detailsSubmitted || !chargesEnabled || !payoutsEnabled) {
      console.log(
        "⚠️ [STRIPE INCOMPLETE] Stripe account setup is not complete"
      );
      ErrorToast(
        "Please complete your Stripe account setup to receive payments"
      );
      setShowStripeModal(true);
      props.onHide(); // Close the main modal
      return;
    }

    console.log("✅ [STRIPE CONNECTED] Proceeding with withdrawal");

    // Check if a payment is selected
    if (!selectedPayment) {
      ErrorToast("Please select a payment to withdraw");
      return;
    }

    setLoading(true);

    const paymentIntentId = selectedPayment.payment_intent_id;

    console.log("💡 [PAYMENT SOURCE] Using selected payment:", {
      payment_intent_id: paymentIntentId,
      title: selectedPayment.title,
      amount: selectedPayment.amount,
      payer: selectedPayment.payer?.fullname,
    });

    if (!paymentIntentId) {
      setLoading(false);
      ErrorToast("Missing payment intent. Please select a valid payment.");
      return;
    }

    const requestData = {
      payment_intent_id: paymentIntentId,
    };

    console.log("💸 [WITHDRAW PAYMENT] Initiating withdrawal:", {
      payment_intent_id: requestData.payment_intent_id,
      userId: userId,
      isStripeConnected: isStripeConnected,
      detailsSubmitted: detailsSubmitted,
      chargesEnabled: chargesEnabled,
      payoutsEnabled: payoutsEnabled,
    });

    try {
      const res = await dispatch(withdrawProjectPayment(requestData));

      console.log("📊 [WITHDRAW PAYMENT] Response:", {
        status: res?.payload?.status,
        message: res?.payload?.message,
        fullResponse: res?.payload,
      });

      setLoading(false);

      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        SuccessToast("Withdrawal initiated successfully");
        props.onHide();
      } else {
        ErrorToast(res?.payload?.message || "Failed to withdraw payment");
      }
    } catch (err) {
      setLoading(false);
      console.error("❌ [WITHDRAW PAYMENT] Error:", err);
      ErrorToast("Failed to withdraw payment");
    }
  };

  // Remove Pay Now functionality for withdraw payment

  const handleKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  // const handleOpenStripeModal = () => {
  //   setShowStripeModal(true);
  //   props.onHide(); // Close the main modal
  // };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="request-pay-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              src="/Images/Clients/payment-icon.svg"
              alt="request-payment"
              width={"80px"}
              height={"80px"}
            />
            <button
              className="chip-send-payment"
              type="button"
              tabIndex="0"
              aria-label="Send project payment"
            >
              Send project payment
            </button>
            <p className="email-sent-head" aria-label="Document verification">
              Document verification
            </p>
            <p className="email-msg">
              Please send me the home documents for verification. Once I’ve
              reviewed them, I’ll proceed with releasing the payments. Thanks,
              bro.
            </p>
            <div
              className=""
              aria-label={`${
                selectedPayment ? "Selected amount" : "Amount in escrow"
              }: ${formatCurrency(escrowAmount)}`}
              style={{
                padding: "20px",
                textAlign: "center",
                marginTop: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px dashed #dee2e6",
              }}
            >
              {selectedPayment ? "Selected amount" : "Amount in escrow"}:{" "}
              {formatCurrency(selectedPayment?.amount || escrowAmount)}
            </div>

            {/* Compact payment summary (no manual selection) */}
            {!fetchingPayments &&
              myPayments &&
              myPayments.length > 0 &&
              selectedPayment && <div></div>}

            {!fetchingPayments && (!myPayments || myPayments.length === 0) && (
              <div></div>
            )}

            <div
              className="request-payment-buttons"
              style={{ display: "flex" }}
            >
              <Button
                onClick={handleRequestPayment}
                className="btn-request-pay"
                disabled={
                  loading ||
                  checkingAccount ||
                  fetchingPayments ||
                  (isStripeConnected &&
                    detailsSubmitted &&
                    chargesEnabled &&
                    payoutsEnabled &&
                    !selectedPayment)
                }
                tabIndex="0"
                aria-label="Withdraw payment"
                onKeyDown={(e) => handleKeyDown(e, handleRequestPayment)}
              >
                Withdraw payment
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <StripeConnectModal
        show={showStripeModal}
        onHide={() => setShowStripeModal(false)}
        onSuccess={() => {
          setShowStripeModal(false);
          checkStripeAccountStatus();
          fetchAvailablePayments(); // Refresh payments list after connecting Stripe
        }}
      />
    </>
  );
}
