
import {createSlice} from "@reduxjs/toolkit"


  
  const initialState = {
    show:true
  };


const dontShow =createSlice({
      name:"dontShow",
      initialState,
      reducers:{
        
        
        setDontShow: (state, action) => {
          
            state.show=action.payload
          console.log("action",action)
      console.log("state" ,state)
         
        },
       
        
      }
})


 export const { setDontShow} = dontShow.actions;
export default dontShow.reducer;

