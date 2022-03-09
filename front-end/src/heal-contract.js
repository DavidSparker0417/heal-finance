import { dsUtilGenerateRandomNumber, dsUtilToHumanizeFixed } from "./ds-lib/ds-utils";
import healAbi from './contracts/HEAL.json'
import { dsBnWeiToEth, dsWeb3EstimateGas, dsWeb3GetBalance, dsWeb3GetTokenPriceByRouter, dsWeb3SendTransaction } from "./ds-lib/ds-web3";
import { 
  dsWeb3GetContract, 
  dsWeb3GetTokenBalance } from "./ds-lib/ds-web3";
import {config, TARGET_NET} from './config'

const TESTING = false
const healAddr = config.contracts.heal

export async function queryHealInfo(_provider) {
  let tokenStat
  let userStat
  let userBalance = 0
  let provider = _provider
  let unclaimedRewards = 0
  let totalReflection = 0

  if (TESTING === true)
  {
    tokenStat = {
      price           : dsUtilGenerateRandomNumber(0.001, 5).toFixed(4),
      totalSupply     : dsUtilGenerateRandomNumber(1000, 99999).toFixed(4),
      treasuryBalance : dsUtilGenerateRandomNumber(10, 40000).toFixed(4),
    }
    userBalance = dsUtilGenerateRandomNumber(0.01, 10).toFixed(4)
    userStat = {
      tokenBalance    : userBalance,
      totalClaimed    : dsUtilGenerateRandomNumber(0.1, 10).toFixed(4),
      unClaimedRewards: dsUtilGenerateRandomNumber(0.1, 5).toFixed(4),
    }
  } else {
    try {
      if (provider === undefined)
        provider = TARGET_NET.url
      
      const heal = dsWeb3GetContract(provider, healAddr, healAbi.abi)
      const account = provider.selectedAddress
      if (account !== null && account !== undefined)
      {
        userBalance = dsBnWeiToEth(
          await dsWeb3GetTokenBalance(heal, account)
        )
        unclaimedRewards = dsBnWeiToEth(
          await heal.methods.unclaimedReflection(account).call()
        )
      }
      const treasuryAddr = await heal.methods.treasuryWallet().call()
      let treasuryBalance = dsBnWeiToEth(await dsWeb3GetBalance(provider, treasuryAddr))
      const totalSupply = dsBnWeiToEth(await heal.methods.totalSupply().call())
      const price = dsBnWeiToEth(await dsWeb3GetTokenPriceByRouter(provider, TARGET_NET.router, healAddr, TARGET_NET.stablecoin))
      totalReflection = dsBnWeiToEth(await heal.methods.ethReflectionBasis().call())
      tokenStat = {
        price           : price,
        totalSupply     : totalSupply,
        treasuryBalance : treasuryBalance,
      }
  
      userStat = {
        tokenBalance        : userBalance,
        totalClaimed        : totalReflection,
        unClaimedRewards    : unclaimedRewards,
      }
    } catch (e) {
      console.log("[HEAL] Faild to query heal info... err = ", e.message)
      return null
    }
  }
  userStat.sharePoint = userBalance 
  ? dsUtilToHumanizeFixed((userBalance * 100) / tokenStat.totalSupply)
  : 0
  return {tokenStat, userStat}
}

export async function healClaim(provider) {
  const heal = dsWeb3GetContract(provider, healAddr, healAbi.abi)
  const transaction = await dsWeb3SendTransaction(
    provider,
    null,
    heal.methods.claimReflection())
  return transaction
}