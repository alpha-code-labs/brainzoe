
import { createSlice } from '@reduxjs/toolkit';
import { sendAuthenticatedRequest } from '../../server/auth';

const initialState = {
  isAuthenticated: false,
  user: {
    userName: null,
    coins: 0,
  },
};

export const userSlice = createSlice({
  name:'auths',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload; // Store the user's profile data
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = { userName: null, coins: 0 };
    },
  },
});

export const { setToken, setUser, clearToken } = userSlice.actions;

// Async thunk action to fetch user data and store it in Redux
export const fetchUserProfile = () => async (dispatch) => {
    const response = await sendAuthenticatedRequest(); // Fetch the user's profile
    console.log("User Data:", response); // Log the userData to verify structure
  
    if (response && response.user) {  // Check if 'user' exists in the response
  
      const { userName, coins } = response.user; // Extract userName and coins from the 'user' object

     const dis= dispatch(setUser({ userName, coins })); // Store the user's profile in Redux
     console.log(dis);
     

    }
  };
  

export default userSlice.reducer;
