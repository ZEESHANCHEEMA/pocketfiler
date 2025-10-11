import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo, useState } from "react";
import "./RequestPayment.css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { withdrawProjectPayment } from "../../../../services/redux/middleware/Payment/payment";
import { SuccessToast, ErrorToast } from "../../../toast/Toast";

export default function RequestPayment(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("_id");

  const escrowAmount = useMemo(() => {
    const raw =
      props.paymentAmount ??
      props.projectData?.amount ??
      props.projectData?.escrowAmount ??
      0;
    const numeric = Number(raw) || 0;
    return numeric;
  }, [props.paymentAmount, props.projectData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const handleRequestPayment = () => {
    if (!props.projectData) {
      ErrorToast("Project data is missing");
      return;
    }

    setLoading(true);

    const paymentIntentId =
      props.projectData?.paymentIntentId ||
      props.projectData?.payment_intent_id ||
      props.paymentIntentId;

    if (!paymentIntentId) {
      setLoading(false);
      ErrorToast("Missing payment intent. Please make a payment first.");
      return;
    }

    const requestData = {
      payment_intent_id: paymentIntentId,
    };

    console.log("🔍 [WITHDRAW DATA CHECK] Field being sent:", {
      payment_intent_id: requestData.payment_intent_id,
      isPresent: !!requestData.payment_intent_id,
    });

    dispatch(withdrawProjectPayment(requestData))
      .then((res) => {
        setLoading(false);
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          SuccessToast("Withdrawal initiated successfully");
          props.onHide();
        } else {
          ErrorToast(res?.payload?.message || "Failed to withdraw payment");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Withdraw payment error:", err);
        ErrorToast("Failed to withdraw payment");
      });
  };

  // Remove Pay Now functionality for withdraw payment

  const handleKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

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
              className="escrow-badge"
              aria-label={`Amount in escrow: ${formatCurrency(escrowAmount)}`}
            >
              Amount in escrow: {formatCurrency(escrowAmount)}
            </div>
            <div className="request-payment-buttons">
              <Button
                onClick={handleRequestPayment}
                className="btn-request-pay"
                disabled={loading}
                tabIndex="0"
                aria-label="Withdraw payment"
                onKeyDown={(e) => handleKeyDown(e, handleRequestPayment)}
              >
                {loading ? "Sending..." : "Withdraw payment"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
