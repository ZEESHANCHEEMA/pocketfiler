import { createSlice } from '@reduxjs/toolkit';
import { getContractTemplates, getContractByTemplateId, createContractFromTemplate } from '../middleware/contractTemplates';

const initialState = {
  templates: [],
  loading: false,
  error: null,
  lastFetched: null,
  selectedContract: null,
  contractLoading: false,
  contractError: null,
  creationLoading: false,
  creationError: null
};

const contractTemplatesSlice = createSlice({
  name: 'contractTemplates',
  initialState,
  reducers: {
    clearTemplates: (state) => {
      state.templates = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContract: (state) => {
      state.selectedContract = null;
      state.contractError = null;
    },
    clearCreationError: (state) => {
      state.creationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Contract Templates
      .addCase(getContractTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContractTemplates.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200) {
          state.templates = action.payload.data || [];
          state.error = null;
          state.lastFetched = new Date().toISOString();
        } else {
          state.error = action.payload.message || 'Failed to fetch templates';
        }
      })
      .addCase(getContractTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })
      
      // Get Contract By Template ID
      .addCase(getContractByTemplateId.pending, (state) => {
        state.contractLoading = true;
        state.contractError = null;
      })
      .addCase(getContractByTemplateId.fulfilled, (state, action) => {
        state.contractLoading = false;
        if (action.payload.status === 200) {
          state.selectedContract = action.payload.data;
          state.contractError = null;
        } else {
          state.contractError = action.payload.message || 'Failed to fetch contract details';
        }
      })
      .addCase(getContractByTemplateId.rejected, (state, action) => {
        state.contractLoading = false;
        state.contractError = action.error.message || 'Failed to fetch contract details';
      })
      
      // Create Contract From Template
      .addCase(createContractFromTemplate.pending, (state) => {
        state.creationLoading = true;
        state.creationError = null;
      })
      .addCase(createContractFromTemplate.fulfilled, (state, action) => {
        state.creationLoading = false;
        if (action.payload.status === 200) {
          state.creationError = null;
        } else {
          state.creationError = action.payload.message || 'Failed to create contract from template';
        }
      })
      .addCase(createContractFromTemplate.rejected, (state, action) => {
        state.creationLoading = false;
        state.creationError = action.error.message || 'Failed to create contract from template';
      });
  },
});

export const { clearTemplates, clearError, clearSelectedContract, clearCreationError } = contractTemplatesSlice.actions;
export default contractTemplatesSlice.reducer; 