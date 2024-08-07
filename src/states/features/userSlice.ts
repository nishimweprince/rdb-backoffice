import { User } from '../../types/models/user';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import store from 'store';
import { AppDispatch } from '../store';
import userManagementQueryApiSlice from '../api/userManagementQueryApiSlice';

const initialState: {
  token?: string;
  user?: User;
  selectedUser?: User;
  usersList: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  viewUserDetailsModal: boolean;
  userProfile?: User;
  fetchUsersIsFetching: boolean;
  fetchUsersIsSuccess: boolean;
} = {
  token: store.get('token'),
  user: store.get('user'),
  usersList: [],
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedUser: undefined,
  viewUserDetailsModal: false,
  userProfile: undefined,
  fetchUsersIsFetching: false,
  fetchUsersIsSuccess: false,
};

// FETCH USERS THUNK
export const fetchUsersThunk = createAsyncThunk<
  { data: User[]; totalElements: number; totalPages: number },
  { page: number; size: number; roles: string[]; searchKey: string },
  { dispatch: AppDispatch }
>('user/fetchUsers', async ({ page, size, roles, searchKey }, { dispatch }) => {
  const response = await dispatch(
    userManagementQueryApiSlice.endpoints.fetchUsers.initiate({
      page,
      size,
      roles,
      searchKey,
    })
  );
  dispatch(setUsersList(response.data?.data?.data));
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set('user', action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      store.set('token', action.payload);
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setViewUserDetailsModal: (state, action) => {
      state.viewUserDetailsModal = action.payload;
    },
    updateUser: (state, action) => {
      state.usersList = state.usersList.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersThunk.pending, (state) => {
      state.fetchUsersIsFetching = true;
      state.fetchUsersIsSuccess = false;
    });
    builder.addCase(fetchUsersThunk.fulfilled, (state, action) => {
      state.fetchUsersIsFetching = false;
      state.fetchUsersIsSuccess = true;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchUsersThunk.rejected, (state) => {
      state.fetchUsersIsFetching = false;
      state.fetchUsersIsSuccess = false;
    });
  },
});

export default userSlice.reducer;

export const {
  setUser,
  setToken,
  setUsersList,
  setSelectedUser,
  setPage,
  setSize,
  setTotalElements,
  setTotalPages,
  setViewUserDetailsModal,
  updateUser,
  setUserProfile,
} = userSlice.actions;
