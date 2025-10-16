import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { API_CONFIG } from "../../../config/apiConfig";
import PaymentForm from "./PaymentForm";
import { createProjectPaymentIntent } from "../../../services/redux/middleware/Payment/payment";
import { clearPaymentState } from "../../../services/redux/slices/Payment/paymentSlice";
import { getContributors } from "../../../services/redux/middleware/Project/project";
import ScreenLoader from "../../loader/ScreenLoader";
import "./ProjectPayment.css";

// Initialize Stripe with publishable key
const stripePromise = loadStripe(API_CONFIG.STRIPE_PUBLISHABLE_KEY);

const ProjectPayment = ({ show, onHide, projectData, paymentAmount }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(paymentAmount || "");
  const [description, setDescription] = useState("");
  const [clientSecretLocal, setClientSecretLocal] = useState(null);

  const userId = localStorage.getItem("_id");
  const paymentState = useSelector((state) => state?.payment || {});
  const {
    clientSecret,
    payment_intent_id,
    loading: paymentLoading,
    error,
  } = paymentState;

  useEffect(() => {}, [
    paymentState,
    clientSecret,
    payment_intent_id,
    paymentLoading,
    error,
  ]);

  useEffect(() => {
    if (clientSecret) {
      setClientSecretLocal(clientSecret);
    }
  }, [clientSecret, payment_intent_id]);

  useEffect(() => {
    if (paymentAmount) {
      setAmount(paymentAmount);
    }
  }, [paymentAmount]);

  const handleCreatePaymentIntent = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    setLoading(true);

    // First, fetch contributors to find the contractor (payee)
    let contractorId = null;
    try {
      const contributorsRes = await dispatch(
        getContributors({
          projectId: projectData?._id || projectData?.id,
          page: 1,
        })
      );

      const contributors = contributorsRes?.payload?.data?.contributors || [];

      if (contributors.length > 0) {
        // Use the first contributor as the contractor (payee)
        contractorId =
          contributors[0]?.user?._id ||
          contributors[0]?.user?.id ||
          contributors[0]?._id ||
          contributors[0]?.id;
      } else {
        // no contributors found
      }
    } catch (error) {
      // swallow contributor fetch errors to avoid blocking UI
    }

    // derive payee from contributors or known fields

    // Use the contractor ID from contributors, or fallback to project data fields
    const inferredPayeeId =
      contractorId ||
      projectData?.contractorId ||
      projectData?.contractor_id ||
      projectData?.contractor?._id ||
      projectData?.contractor?.id ||
      projectData?.contributor?._id ||
      projectData?.contributor?.id ||
      projectData?.assignedTo?._id ||
      projectData?.assignedTo?.id;

    const paymentData = {
      title:
        (title && title.trim()) ||
        `Payment for ${projectData?.title || projectData?.name || "Project"}`,
      description:
        description ||
        `Payment for ${projectData?.title || projectData?.name || "Project"}`,
      amount: parseFloat(amount),
      currency: "usd",
      project_id: projectData?._id || projectData?.id,
      payer_user_id: userId,
      payee_id: inferredPayeeId,
    };

    // Only add customer_id if it's a valid Stripe customer ID (starts with 'cus_')
    const customerId =
      projectData?.stripeCustomerId || projectData?.customer_id;
    if (customerId && customerId.startsWith("cus_")) {
      paymentData.customer_id = customerId;
    }

    // basic validation done above

    if (!paymentData.payee_id) {
      setLoading(false);
      return;
    }

    dispatch(createProjectPaymentIntent(paymentData))
      .then(async (res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          const clientSecret = res?.payload?.clientSecret;
          if (!clientSecret) {
            setLoading(false);
            return;
          }

          // Store clientSecret to trigger the Elements UI (Stripe's payment form)
          setClientSecretLocal(clientSecret);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Don't auto-close - let user close manually
  };

  const handleClose = () => {
    dispatch(clearPaymentState());
    setClientSecretLocal(null);
    setTitle("");
    setAmount("");
    setDescription("");
    setPaymentSuccess(false);
    setLoading(false);
    onHide();
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0066cc",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret: clientSecretLocal,
    appearance,
  };

  useEffect(() => {}, [clientSecretLocal]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="project-payment-modal"
      centered
      className="project-payment-modal"
    >
      <Modal.Header>
        <div className="pm-header" style={{ width: "100%" }}>
          <Modal.Title id="project-payment-modal">
            {paymentSuccess ? "Payment Successful!" : "Make payment"}
          </Modal.Title>
          <button
            type="button"
            className="pm-close"
            aria-label="Close"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        {(loading || paymentLoading) && <ScreenLoader />}

        {paymentSuccess ? (
          <div className="payment-success-body">
            <div className="payment-success-icon">
              <img
                src="/Images/Subscription/mdi_tick-all.svg"
                alt="payment-success"
                width="80px"
                height="80px"
              />
            </div>
            <p className="payment-success-head">Payment done successfully!</p>
            <p className="payment-success-msg">
              Payment successfully send to user.
            </p>
            <div className="payment-success-actions">
              <Button
                variant="primary"
                onClick={handleClose}
                className="btn-view-project"
                tabIndex="0"
                aria-label="View project"
              >
                View project
              </Button>
            </div>
          </div>
        ) : !clientSecretLocal ? (
          <div className="payment-form-container">
            <div className="project-payment-info">
              <p className="project-description">
                Send payments securely on PocketFiler by milestone or one-time.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="payment-title" className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                id="payment-title"
                type="text"
                className="form-control payment-input"
                placeholder="House buying"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Payment title"
                tabIndex="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="payment-description" className="form-label">
                Description
              </label>
              <textarea
                id="payment-description"
                className="form-control payment-textarea"
                placeholder="Describe..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                aria-label="Payment description"
                tabIndex="0"
              />
            </div>

            <div className="payment-amount-section">
              <div className="form-group">
                <label htmlFor="payment-amount" className="form-label">
                  Payment <span className="required">*</span>
                </label>
                <input
                  id="payment-amount"
                  type="number"
                  className="form-control payment-input"
                  placeholder="$10,000.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  aria-label="Payment amount"
                  tabIndex="0"
                />
              </div>
            </div>

            <div className="payment-buttons">
              <Button
                variant="primary"
                onClick={handleCreatePaymentIntent}
                className="btn-proceed"
                disabled={
                  loading ||
                  paymentLoading ||
                  !title ||
                  !title.trim() ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
                tabIndex="0"
                aria-label="Make payment"
              >
                {loading || paymentLoading ? "Processing..." : "Make payment"}
              </Button>
            </div>

            {error && (
              <div
                className="alert alert-danger payment-error mt-3"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="stripe-payment-container">
            <div className="payment-summary">
              <h6>Payment Summary</h6>
              <div className="summary-row">
                <span>Project:</span>
                <span className="summary-value">
                  {projectData?.name || projectData?.title || "Project"}
                </span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span className="summary-value amount">
                  ${parseFloat(amount).toFixed(2)}
                </span>
              </div>
              {description && (
                <div className="summary-row">
                  <span>Description:</span>
                  <span className="summary-value">{description}</span>
                </div>
              )}
            </div>

            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                projectData={projectData}
                amount={amount}
                description={description}
                onSuccess={handlePaymentSuccess}
                onCancel={handleClose}
              />
            </Elements>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProjectPayment;
