import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import axios from 'axios';


export const fetchcoins = createAsyncThunk(
  'coin/fetchcoins',
  async (_, { rejectWithValue }) => {
    try {
      // Make the API request with the correct headers
      const response = await axios.get('http://192.168.1.10:9001/user/coins', {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        },
      });

      // Check if the response status is 200 and the response contains data
      if (response.status === 200 && response.data) {
        console.log("Value of the coin from backend",response.data.coins);
        if(typeof response.data.coins === 'number'){
          console.log("string", response.data.coins );
          
        }else{
          console.log("not a string");
          
        }
        return response.data.coins;  // Return the coins data
        
      } else {
        return rejectWithValue('Failed to fetch coins');
      }
    } catch (error) {
      // Handle errors and return a rejected action with a custom error message
      return rejectWithValue(error.response?.data || 'Failed to fetch coins');
    }
  }
);


export const updatedCoinsonBackend = createAsyncThunk ('coin/updatedCoinsonBackend', async (newCoins,{rejectWithValue})=>{
try{
const token = await AsyncStorage.getItem('token');
console.log('trying to update coins', token, newCoins);
const response = await axios.patch('http://192.168.1.10:9001/user/coins', {coins:newCoins},
  {
    headers:{
       Authorization: `Bearer ${token}`
    },
  }
)

if(response.status === 200 && response.data){
  console.log("updated coins", response.data.updatedCoins);
  return response.data.updatedCoins
}
 
}catch(error){ 
  console.log(error)
  return rejectWithValue(error.response?.data || 'Failed to update coins');
}
})

const initialState = {
  coin: 0,
};

export const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    updatecoin: (state, action) => {
        //action.type is a string that uniquely identifies the action.
       // When you dispatch an action, Redux uses action.type to determine which reducer should handle that action
        state.coin += action.payload;

        //  AsyncStorage.setItem('coin', state.coin.toString());
    },
    //The += operator means that the current value of state.coin is being incremented by the value provided in action.payload.

    resetCoin: (state, action)=>{
        state.coin = 0;
      //  AsyncStorage.setItem('coin', state.coin.toString());
    },
    totalcoins: (state,action)=>{
        state.coin=action.payload
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchcoins.pending, (state) => {
        // Handle loading state
        state.status = 'loading';
      })
      .addCase(fetchcoins.fulfilled, (state, action) => {
        // Handle successful fetch
        state.status = 'succeeded';
        state.coin = action.payload 
      })
      .addCase(fetchcoins.rejected, (state, action) => {
        // Handle error
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updatedCoinsonBackend.pending, (state,action)=>{
        state.status = 'loading'
        state.error = action.payload;
      })

      .addCase(updatedCoinsonBackend.fulfilled, (state,action)=>{
        
        state.status = 'succeeded'
        state.coin = action.payload;
      })


      .addCase(updatedCoinsonBackend.rejected, (state,action)=>{
        state.status = 'rejected'
        state.erro = action.payload
      })
  }
  
});

export const { updatecoin, resetCoin,totalcoins } = coinSlice.actions;

// export const loadCoinsFromStorage = () => async (dispatch) => {
//     try {
//       const storedCoin = await AsyncStorage.getItem('coin');
//       console.log('Stored Coin Retrieved:', storedCoin); // Log the stored value
  
//       if (storedCoin !== null) {
//         const parsedCoin = parseInt(storedCoin, 10);
//         if (!isNaN(parsedCoin)) {
//           console.log('Parsed Coin:', parsedCoin); // Log the parsed value
//           dispatch(totalcoins(parsedCoin)); // Dispatch the parsed value to update the Redux store
//         } else {
//           console.error('Stored coin value is not a valid number:', storedCoin);
//         } 
//       } else {
//         console.log('No coin found in AsyncStorage.');
//       }
//     } catch (error) {
//       console.error('Failed to load coins from storage', error);
//     }
//   };
  

export default coinSlice.reducer;



