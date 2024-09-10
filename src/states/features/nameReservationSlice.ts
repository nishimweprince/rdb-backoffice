import { NameReservation } from '@/types/models/nameReservation';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  nameReservationsList: NameReservation[];
  selectedNameReservation?: NameReservation;
  nameReservationDetailsModal: boolean;
  approveNameReservationModal: boolean;
  rejectNameReservationModal: boolean;
  nameReservationPage: number;
  nameReservationSize: number;
  nameReservationTotalPages: number;
  nameReservationTotalElements: number;
} = {
  nameReservationsList: [],
  selectedNameReservation: undefined,
  nameReservationDetailsModal: false,
  approveNameReservationModal: false,
  rejectNameReservationModal: false,
  nameReservationPage: 1,
  nameReservationSize: 100,
  nameReservationTotalPages: 0,
  nameReservationTotalElements: 0,
};

const nameReservationSlice = createSlice({
  name: 'nameReservation',
  initialState,
  reducers: {
    setNameReservationsList(state, action) {
      state.nameReservationsList = action.payload;
    },
    setSelectedNameReservation(state, action) {
      state.selectedNameReservation = action.payload;
    },
    updateNameReservation(state, action) {
      const updatedNameReservation = action.payload; 
      const index = state.nameReservationsList.findIndex(
        (nameReservation) => nameReservation.id === updatedNameReservation.id
      );
      if (index !== -1) {
        state.nameReservationsList[index] = updatedNameReservation;
      }
    },
    setNameReservationDetailsModal(state, action) {
      state.nameReservationDetailsModal = action.payload;
    },
    setApproveNameReservationModal(state, action) {
      state.approveNameReservationModal = action.payload;
    },
    setRejectNameReservationModal(state, action) {
      state.rejectNameReservationModal = action.payload;
    },
    setNameReservationPage(state, action) {
      state.nameReservationPage = action.payload;
    },
    setNameReservationSize(state, action) {
      state.nameReservationSize = action.payload;
    },
    setNameReservationTotalPages(state, action) {
      state.nameReservationTotalPages = action.payload;
    },
    setNameReservationTotalElements(state, action) {
      state.nameReservationTotalElements = action.payload;
    }
  },
});

export const {
  setNameReservationsList,
  setSelectedNameReservation,
  setNameReservationDetailsModal,
  setApproveNameReservationModal,
  setRejectNameReservationModal,
  updateNameReservation,
  setNameReservationPage,
  setNameReservationSize,
  setNameReservationTotalPages,
  setNameReservationTotalElements,
} = nameReservationSlice.actions;

export default nameReservationSlice.reducer;
