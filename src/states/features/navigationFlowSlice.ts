import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NavigationFlow,
  NavigationFlowMass,
} from '@/types/models/navigationFlow';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { AppDispatch } from '../store';
import { businessId } from '@/types/models/business';
import { UUID } from 'crypto';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { toast } from 'react-toastify';

const initialState: {
  navigationFlowMassList?: NavigationFlowMass;
  businessNavigationFlowsList: NavigationFlow[];
  businessNavigationFlowIsLoading: boolean;
  businessNavigationFlowsIsFetching: boolean;
  selectedBusinessNavigationFlow?: NavigationFlow;
} = {
  navigationFlowMassList: undefined,
  businessNavigationFlowsList: [],
  businessNavigationFlowIsLoading: false,
  businessNavigationFlowsIsFetching: false,
  selectedBusinessNavigationFlow: undefined,
};

// CREATE NAVIGATION FLOW
export const createNavigationFlowThunk = createAsyncThunk<
  NavigationFlow,
  { businessId: businessId; massId: string; isActive: boolean },
  { dispatch: AppDispatch }
>('navigationFlow/createNavigationFlow', async (payload, { dispatch }) => {
  const response = await dispatch(
    businessRegApiSlice.endpoints.createNavigationFlow.initiate(payload)
  ).unwrap();
  return response.data;
});

// COMPLETE NAVIGATION FLOW
export const completeNavigationFlowThunk = createAsyncThunk<
  NavigationFlow,
  { isCompleted: boolean; navigationFlowId?: UUID },
  { dispatch: AppDispatch }
>('navigationFlow/completeNavigationFlow', async (payload, { dispatch }) => {
  const response = await dispatch(
    businessRegApiSlice.endpoints.completeNavigationFlow.initiate(payload)
  ).unwrap();
  return response.data;
});

// FETCH NAVIGATION FLOW MASS
export const fetchNavigationFlowMassThunk = createAsyncThunk<
  NavigationFlowMass,
  { businessType: string },
  { dispatch: AppDispatch }
>(
  'navigationFlow/fetchNavigationFlowMass',
  async ({ businessType }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchNavigationFlowMass.initiate({
          businessType,
        })
      ).unwrap();
      dispatch(setNavigationFlowMassList(response?.data));
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch navigation flow mass');
    }
  }
);

// FETCH BUSINESS NAVIGATION FLOWS
export const fetchBusinessNavigationFlowsThunk = createAsyncThunk<
  NavigationFlow[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  'navigationFlow/fetchBusinessNavigationFlows',
  async ({ businessId }, { dispatch }) => {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessNavigationFlows.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessNavigationFlowsList(response?.data));
    return response.data;
  }
);

const navigationFlowSlice = createSlice({
  name: 'navigationFlow',
  initialState,
  reducers: {
    setNavigationFlowMassList: (state, action) => {
      state.navigationFlowMassList = action.payload;
    },
    setBusinessNavigationFlowsList: (state, action) => {
      state.businessNavigationFlowsList = action.payload;
    },
    addBusinessNavigationFlow: (state, action) => {
      state.businessNavigationFlowsList.push(action.payload);
    },
    removeBusinessNavigationFlow: (state, action) => {
      state.businessNavigationFlowsList =
        state.businessNavigationFlowsList.filter(
          (navigationFlow) => navigationFlow.id !== action.payload
        );
    },
    setBusinessNavigationFlowIsLoading: (state, action) => {
      state.businessNavigationFlowIsLoading = action.payload;
    },
    setSelectedBusinessNavigationFlow: (state, action) => {
      state.selectedBusinessNavigationFlow = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNavigationFlowThunk.pending, (state) => {
        state.businessNavigationFlowIsLoading = true;
      })
      .addCase(
        createNavigationFlowThunk.fulfilled,
        (state, action: PayloadAction<NavigationFlow>) => {
          state.businessNavigationFlowIsLoading = false;
          state.businessNavigationFlowsList =
            action.payload as unknown as NavigationFlow[];
        }
      )
      .addCase(createNavigationFlowThunk.rejected, (state) => {
        state.businessNavigationFlowIsLoading = false;
      })
      .addCase(completeNavigationFlowThunk.pending, (state) => {
        state.businessNavigationFlowIsLoading = true;
      })
      .addCase(
        completeNavigationFlowThunk.fulfilled,
        (state, action: PayloadAction<NavigationFlow>) => {
          state.businessNavigationFlowIsLoading = false;
          state.businessNavigationFlowsList =
            state.businessNavigationFlowsList.map((navigationFlow) =>
              navigationFlow.id === action.payload.id
                ? action.payload
                : navigationFlow
            );
        }
      )
      .addCase(completeNavigationFlowThunk.rejected, (state) => {
        state.businessNavigationFlowIsLoading = false;
      });
    builder.addCase(fetchNavigationFlowMassThunk.pending, (state) => {
      state.businessNavigationFlowsIsFetching = true;
    });
    builder.addCase(fetchNavigationFlowMassThunk.fulfilled, (state) => {
      state.businessNavigationFlowsIsFetching = false;
    });
  },
});

export const {
  setNavigationFlowMassList,
  setBusinessNavigationFlowsList,
  addBusinessNavigationFlow,
  removeBusinessNavigationFlow,
  setBusinessNavigationFlowIsLoading,
  setSelectedBusinessNavigationFlow
} = navigationFlowSlice.actions;

export default navigationFlowSlice.reducer;
