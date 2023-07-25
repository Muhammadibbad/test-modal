// Setup user slice here
import { createSlice,createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';



// create action
export const  createUser=createAsyncThunk("createUser",async(data)=>{
  const response=await fetch("https://qstnr.intvw.logodiffusion.com/api/questionnaire/",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify(data)
} )

try{
  const result=await response.json();
  console.log({result})
  return result
}
catch(error){
return isRejectedWithValue(error)
}



})

console.log({userCreateD: createUser()})
const initialState = {
  users:[],
  loading:false,
  error:null,
  hasSubmit:false
};

const questionaire = createSlice({
  name: 'questionaire',
  initialState,
  extraReducers: {
   [createUser.pending]:(state) =>{
    console.log({statePending: state})
    state.loading=true
   }  ,
   [createUser.fulfilled]:(state,action) =>{
    state.loading=false;
    console.log({stateFul: state})
    state.users.push(action.payload)
    state.hasSubmit=true
   },
   [createUser.rejected]:(state, action) =>{
    state.loading=false
    state.error=action.payload.message
   }
  },
});


export default questionaire.reducer;