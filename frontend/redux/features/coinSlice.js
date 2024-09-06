import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const initialState = {
  coin: 0,
};

export const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    updatecoin: async (state, action) => {
        //action.type is a string that uniquely identifies the action.
       // When you dispatch an action, Redux uses action.type to determine which reducer should handle that action
        
          const res = await axios.post('/update-coins', {coins})
         state.coin += action.payload;
         AsyncStorage.setItem('coin', state.coin.toString());
    },//The += operator means that the current value of state.coin is being incremented by the value provided in action.payload.

    resetCoin: async (state, action)=>{
        state.coin = 0;
       AsyncStorage.setItem('coin', state.coin.toString());
      
      
    },
    totalcoins: (state,action)=>{
        state.coin=action.payload
    }
  },
});

export const { updatecoin, resetCoin,totalcoins } = coinSlice.actions;

export const loadCoinsFromStorage = () => async (dispatch) => {
    try {
      const storedCoin = await AsyncStorage.getItem('coin');
      console.log('Stored Coin Retrieved:', storedCoin); // Log the stored value
  
      if (storedCoin !== null) {
        const parsedCoin = parseInt(storedCoin, 10);
        if (!isNaN(parsedCoin)) {
          console.log('Parsed Coin:', parsedCoin); // Log the parsed value
          dispatch(totalcoins(parsedCoin)); // Dispatch the parsed value to update the Redux store
        } else {
          console.error('Stored coin value is not a valid number:', storedCoin);
        } 
      } else {
        console.log('No coin found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Failed to load coins from storage', error);
    }
  };
  

export default coinSlice.reducer;



