//name, email, token jwt,local storage
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const googleSignIn = createAsyncThunk('auth/googleSignIn', async(idToken, thunkAPI) =>{
  //thunk handles the async logic for sending Google ID token to your backend 
  
    try {
        const rsponse = await fetch('https://your-backend-url.com/api/auth/signin',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({token:idToken}) //send google ID token to backend

        });
        const data = await Response.josn()

        if(Response.ok){
            return data; // Backend should return user details and JWT token
        }else{
            return thunkAPI.rejectWithValue(data); // Handle any errors from the backend
        }
    }
    catch(error){
        return thunkAPI.rejectWithValue(error.message)//handle fetch errors

    }
});


const userSlice = createSlice({
    name:'auth',
    initialState:{
        user:null, 
        token:null,
        loading:false,
        error:null,
    },
    reducers:{
        logout: (state)=>{
            state.user = null;
            state.token=null;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(googleSignIn.pending, (state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(googleSignIn.rejected, (state,action)=>{
            state.loading= false;
            state.error = action.payload; // Handle any errors (e.g invalid token)
        })
    }
})


//Export action and reducer

export const {logout} = userSlice.actions;
export default userSlice.reducer
