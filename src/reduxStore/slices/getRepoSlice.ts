import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getRepo } from "../../service/getRepo";
import { RootState } from "../store";
// import { getUsers } from "../services/userAPI/getUser";
// import { RootState } from "./store";

export const getRepoListAPI = createAsyncThunk(
  "repoList/getRepoListAPI",
  async (arg?: any, { rejectWithValue }) => {
    try {
      const res = await getRepo(arg);
      return res;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);
// Define a type for the slice state
interface RepoListState {
  repoList: any;
  isLoading: boolean;
  hasError: boolean;
}

// Define the initial state using that type
const initialState: RepoListState = {
  repoList: {},
  isLoading: true,
  hasError: false,
};

export const repoListReducer = createSlice({
  name: "repoList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getRepoListAPI.fulfilled, (state, action) => {
      // Add user to the state array
      state.isLoading = false;
      state.repoList = action.payload;
    });
    builder.addCase(getRepoListAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRepoListAPI.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
  },
});

export const GetRepoList = (state: RootState) => state.repoList;

export const GetReducer = repoListReducer.reducer;
