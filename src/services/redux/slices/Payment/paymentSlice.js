import { createSlice } from "@reduxjs/toolkit";
import {
  createProjectPaymentIntent,
  confirmProjectPayment,
  getPaymentStatus,
  getProjectPayments,
  requestProjectPayment,
} from "../../middleware/Payment/payment";

const initialState = {
  loading: false,
  error: null,
  clientSecret: null,
  paymentIntent: null,
  payment_intent_id: null,
  paymentStatus: null,
  projectPayments: [],
  paymentConfirmation: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.clientSecret = null;
      state.paymentIntent = null;
      state.payment_intent_id = null;
      state.paymentConfirmation = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Payment Intent
    builder
      .addCase(createProjectPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.clientSecret = action.payload.clientSecret;
          state.paymentIntent = action.payload.data;
          state.payment_intent_id = action.payload.payment_intent_id;
          state.error = null;
          console.log("💾 [REDUX] Saved to state:", {
            clientSecret: !!action.payload.clientSecret,
            payment_intent_id: action.payload.payment_intent_id,
          });
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(createProjectPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Confirm Payment
    builder
      .addCase(confirmProjectPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmProjectPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.paymentConfirmation = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(confirmProjectPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Get Payment Status
    builder
      .addCase(getPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200) {
          state.paymentStatus = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Get Project Payments
    builder
      .addCase(getProjectPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectPayments.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200) {
          state.projectPayments = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(getProjectPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Request Payment
    builder
      .addCase(requestProjectPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestProjectPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(requestProjectPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPaymentState, clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
