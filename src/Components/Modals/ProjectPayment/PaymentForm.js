import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { confirmProjectPayment } from "../../../services/redux/middleware/Payment/payment";

const PaymentForm = ({
  projectData,
  amount,
  description,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("❌ [SUBMIT] Stripe or Elements not loaded");
      return;
    }

    if (paymentCompleted) {
      console.warn(
        "⚠️ [SUBMIT] Payment already completed, ignoring duplicate submission"
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    console.log("🚀 [SUBMIT] Starting payment confirmation...");

    try {
      // Check if payment element is complete before confirming
      const submitResult = await elements.submit();
      if (submitResult.error) {
        console.error(
          "❌ [SUBMIT] Elements validation failed:",
          submitResult.error
        );
        setErrorMessage(submitResult.error.message);
        setIsProcessing(false);
        return;
      }

      console.log("✅ [SUBMIT] Elements validated, confirming payment...");

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        redirect: "if_required",
      });

      console.log("📦 [STRIPE RESPONSE]", { error, paymentIntent });

      if (error) {
        console.error("❌ [SUBMIT] Payment error:", error);

        // Check if payment already succeeded (duplicate attempt)
        if (
          error.payment_intent &&
          error.payment_intent.status === "succeeded"
        ) {
          console.log(
            "✅ [STRIPE] Payment was already succeeded, proceeding to backend confirmation"
          );
          const confirmedPaymentIntent = error.payment_intent;
          setPaymentCompleted(true);

          const confirmData = {
            projectId: projectData?._id || projectData?.id,
            paymentIntentId: confirmedPaymentIntent.id,
            amount: parseFloat(amount),
            description: description,
          };

          dispatch(confirmProjectPayment(confirmData))
            .then((res) => {
              setIsProcessing(false);
              if (
                res?.payload?.status === 200 ||
                res?.payload?.status === 201
              ) {
                console.log("✅ [BACKEND] Payment confirmed successfully");
                onSuccess();
              } else if (res?.payload?.status === 404) {
                console.warn(
                  "⚠️ [BACKEND] Endpoint not found, but payment succeeded on Stripe"
                );
                onSuccess();
              } else {
                setErrorMessage(
                  res?.payload?.message || "Failed to confirm payment"
                );
              }
            })
            .catch((err) => {
              setIsProcessing(false);
              console.error("❌ [BACKEND] Confirmation error:", err);
              if (err?.response?.status === 404) {
                console.warn(
                  "⚠️ [BACKEND] Endpoint not found, but payment succeeded on Stripe"
                );
                onSuccess();
              } else {
                setErrorMessage(
                  "Payment succeeded on Stripe, but backend confirmation failed"
                );
              }
            });
          return;
        }

        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (
        paymentIntent &&
        (paymentIntent.status === "succeeded" ||
          paymentIntent.status === "processing")
      ) {
        // Payment succeeded or is processing, confirm in backend
        console.log("✅ [STRIPE] Payment confirmed by Stripe:", {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
        });

        setPaymentCompleted(true); // Mark as completed to prevent duplicates

        const confirmData = {
          projectId: projectData?._id || projectData?.id,
          paymentIntentId: paymentIntent.id,
          amount: parseFloat(amount),
          description: description,
        };

        console.log("🔄 [BACKEND] Confirming with backend:", confirmData);

        // Skip backend confirmation if endpoint doesn't exist (404)
        dispatch(confirmProjectPayment(confirmData))
          .then((res) => {
            setIsProcessing(false);
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              console.log("✅ [BACKEND] Payment confirmed successfully");
              onSuccess();
            } else if (res?.payload?.status === 404) {
              console.warn(
                "⚠️ [BACKEND] Endpoint not found, but payment succeeded on Stripe"
              );
              onSuccess(); // Still show success since Stripe confirmed
            } else {
              setErrorMessage(
                res?.payload?.message || "Failed to confirm payment"
              );
            }
          })
          .catch((err) => {
            setIsProcessing(false);
            console.error("❌ [BACKEND] Confirmation error:", err);
            // If it's just a 404, still show success since Stripe payment worked
            if (err?.response?.status === 404) {
              console.warn(
                "⚠️ [BACKEND] Endpoint not found, but payment succeeded on Stripe"
              );
              onSuccess();
            } else {
              setErrorMessage(
                "Payment succeeded on Stripe, but backend confirmation failed"
              );
            }
          });
      } else {
        setIsProcessing(false);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Payment error:", err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  // Add logging for debugging
  React.useEffect(() => {
    console.log("💳 [PAYMENT ELEMENT] Status:", {
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      isProcessing,
    });
  }, [stripe, elements, isProcessing]);

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-element-container">
        {console.log("🎨 [RENDER] Rendering PaymentElement")}
        <PaymentElement
          id="payment-element"
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
          }}
          onReady={() => console.log("✅ [PAYMENT ELEMENT] Ready!")}
          onLoadError={(error) =>
            console.error("❌ [PAYMENT ELEMENT] Load error:", error)
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
