import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";

const PaymentForm = ({
  projectData,
  amount,
  description,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    if (paymentCompleted) {
      console.warn(
        "⚠️ [SUBMIT] Payment already completed, ignoring duplicate submission"
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Check if payment element is complete before confirming
      const submitResult = await elements.submit();
      if (submitResult.error) {
        setErrorMessage(submitResult.error.message);
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Check if payment already succeeded (duplicate attempt)
        if (
          error.payment_intent &&
          error.payment_intent.status === "succeeded"
        ) {
          setPaymentCompleted(true);
          setIsProcessing(false);
          onSuccess();
          return;
        }

        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (
        paymentIntent &&
        (paymentIntent.status === "succeeded" ||
          paymentIntent.status === "processing")
      ) {
        setPaymentCompleted(true); // Mark as completed to prevent duplicates
        setIsProcessing(false);
        onSuccess();
      } else {
        setIsProcessing(false);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  React.useEffect(() => {}, [stripe, elements, isProcessing]);

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-element-container">
        <PaymentElement
          id="payment-element"
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
          }}
          onReady={() => {}}
          onLoadError={(error) =>
            setErrorMessage(error?.message || "Failed to load payment element")
          }
        />
      </div>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="payment-form-buttons">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-cancel"
          tabIndex="0"
          aria-label="Cancel payment"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || isProcessing}
          className="btn-pay"
          tabIndex="0"
          aria-label={`Pay ${amount}`}
          onKeyDown={handleKeyDown}
        >
          {isProcessing
            ? "Processing..."
            : `Pay $${parseFloat(amount).toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
