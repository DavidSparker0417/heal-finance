import { createSlice } from "@reduxjs/toolkit";

export const healSlice = createSlice({
  name: 'heal slice',
  initialState: {
    userStat : {
      tokenBalance    : 0,
      totalClaimed    : 0,
      unClaimedRewards: 0,
      sharePoint      : 0,
      stakeSharePoint : 0,
      totalStaked     : 0,
      approved        : false
    },
    tokenStat : {
      price           : 0,
      totalSupply     : 0,
      treasuryBalance : 0,
    },
    nftStat : {
      userHolds       : []
    },
    stakingStat : {
      rewardTokenSymbol : ""
    }
  },
  reducers : {
    setUserStat: (state, action) => {
      state.userStat = action.payload
    },
    setTokenStat: (state, action) => {
      state.tokenStat = action.payload
    },
    setNftStat: (state, action) => {
      state.nftStat.userHolds = action.payload
    },
    setStakingStat: (state, action) => {
      state.stakingStat = action.payload
    }
  },
})

export const {
  setUserStat,
  setTokenStat,
  setNftStat,
  setStakingStat
} = healSlice.actions
export default healSlice.reducer