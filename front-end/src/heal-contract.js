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
        totalStaked         : dsUtilGenerateRandomNumber(1000, 7000).toFixed(4)
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

export async function queryNftInfo() {
  let nftInfo = Array()

  // if (TESTING === true)
  {
    const imageUriList = [
      "https://ipfs.io/ipfs/QmVR7hosBX71j5REFeqPMVSXzmdFj1iMYoFakHSB1wmHec",
      "https://ipfs.io/ipfs/QmYXXQn9CqJxgNk5Qwngi5t3RRuQtT9qe5aAJ2jHVHHBKe",
      "https://ipfs.io/ipfs/QmYMLCfuxP6YP9y7noDAJV3KzVJjmsTyqmh57uT8XRKczy",
      "https://ipfs.io/ipfs/QmSWz6U2aPo7L5Yka1bA3Q2xoxr3V7Yay6oCJQfTn9ePyR",
      "https://ipfs.io/ipfs/QmZPkkugn6615HCoJ9qsk1knTuTcyuznAZTFJuQhPHMe6F",
      "https://ipfs.io/ipfs/QmfVkNR7qUjHxQWWu1kv6hR2xh9hLKJQigfaSXyWDYvqFX",
      "https://ipfs.io/ipfs/QmNofJBHX8LpBjnB35FKkfEJkMHebSNkeRiHUSJX8TFzwt"
    ]
    const count = 4 //dsUtilGenerateRandomNumber(0, imageUriList.length).toFixed(0)
    for(let i = 0; i < count; i ++) {
      nftInfo.push({
        id          : `#${i}`,
        description : `heal nft of [${i}]`,
        uri         :  imageUriList[i]
      })
    }
  }
  return nftInfo
}