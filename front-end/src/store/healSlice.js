import { createSlice } from "@reduxjs/toolkit";

export const healSlice = createSlice({
  name: 'heal slice',
  initialState: {
    userStat : {
      tokenBalance    : 0,
      totalClaimed    : 0,
      unClaimedRewards: 0,
      sharePoint      : 0
    },
    tokenStat : {
      price           : 0,
      totalSupply     : 0,
      treasuryBalance : 0,
    },
    general : {
      userBalance     : 0,
      treasuryBalance : 0,
      totalClaimed    : 0,
      unClaimedRewards: 0,
      healPrice       : 0,
      totalSupply     : 0
    }
  },
  reducers : {
    setUserStat: (state, action) => {
      state.userStat = action.payload
    },
    setTokenStat: (state, action) => {
      state.tokenStat = action.payload
    },
  },
})

export const {
  setUserStat,
  setTokenStat,
} = healSlice.actions
export default healSlice.reducer