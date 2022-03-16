import { dsUtilGenerateRandomNumber, dsUtilToHumanizeFixed } from "./ds-lib/ds-utils";
import healAbi from './contracts/HEAL.json'
import faasAbi from './contracts/HEALFaaS.json'
import stakingAbi from './contracts/HEALFaaSToken.json'
import distribAbi from './contracts/RewardDistributor.json'
import { 
  dsBnEthToWei, 
  dsBnWeiToEth, 
  dsErrMsgGet, 
  dsWeb3EstimateGas, 
  dsWeb3GetBalance, 
  dsWeb3GetStableBalance, 
  dsWeb3GetTokenDecmials, 
  dsWeb3GetTokenPriceByRouter, 
  dsWeb3SendTransaction, 
  dsWeb3TokenSymbol, 
  UINT256_MAX } from "./ds-lib/ds-web3";
import { 
  dsWeb3GetContract, 
  dsWeb3GetTokenBalance } from "./ds-lib/ds-web3";
import {config, TARGET_NET} from './config'

const TESTING = false
const healAddr = config.contracts.heal

export async function queryFaaSHealInfo(_provider) {
  let tokenStat = {
    price           : 0,
    totalSupply     : 0,
    treasuryBalance : 0,
  }
  let userStat = {
    tokenBalance        : 0,
    totalClaimed        : 0,
    unClaimedRewards    : 0,
    totalStaked         : 0,
    approved            : false,
    sharePoint          : 0,
    stakeSharePoint     : 0,
  }
  let stakingStat = {
    rewardTokenSymbol   : "",
    totalStaked         : 0,
    rewardPerBlock      : 0,
  }

  let provider = _provider

  if (TESTING === true)
  {
    tokenStat.price = dsUtilGenerateRandomNumber(0.001, 5).toFixed(4)
    tokenStat.totalSupply = dsUtilGenerateRandomNumber(1000, 99999).toFixed(4)
    tokenStat.treasuryBalance = dsUtilGenerateRandomNumber(10, 40000).toFixed(4)
    userStat.tokenBalance = dsUtilGenerateRandomNumber(0.01, 10).toFixed(4)
    userStat.totalClaimed = dsUtilGenerateRandomNumber(0.1, 10).toFixed(4)
    userStat.unClaimedRewards = dsUtilGenerateRandomNumber(0.1, 5).toFixed(4)
  } else {
    try {
      if (provider === undefined)
        provider = TARGET_NET.rpc
      
      // get base data of smart contracts
      const stakingToken = config.contracts.heal
      const heal = dsWeb3GetContract(provider, stakingToken, healAbi.abi)
      const [stakingPool, stakingContract] = await healFaaSGetStakingPool(provider)
      const rewardingToken = await stakingContract.methods.rewardsTokenAddress().call()
      const account = provider.selectedAddress
      const treasuryAddr = TARGET_NET.treasury
      const decimals = parseInt(await heal.methods.decimals().call())
      const rewardDecmials = parseInt(await dsWeb3GetTokenDecmials(provider, rewardingToken))
      // get token stat
      tokenStat.treasuryBalance = dsBnWeiToEth(await dsWeb3GetStableBalance(provider, treasuryAddr, TARGET_NET.router, TARGET_NET.stablecoin))
      tokenStat.totalSupply = dsBnWeiToEth(await heal.methods.totalSupply().call(), decimals)      
      tokenStat.price = dsBnWeiToEth(await dsWeb3GetTokenPriceByRouter(provider, TARGET_NET.router, stakingToken, TARGET_NET.stablecoin))
      // get staking stat
      stakingStat.rewardTokenSymbol = await dsWeb3TokenSymbol(provider, rewardingToken)
      const pool = await stakingContract.methods.pool().call()
      stakingStat.totalStaked = dsBnWeiToEth(pool.totalTokensStaked, decimals)
      stakingStat.rewardPerBlock = dsBnWeiToEth(pool.perBlockNum, rewardDecmials)
      console.log("[HEAL] staking stat = ", stakingStat)
      // get user specific stat
      if (account !== null && account !== undefined)
      {
        userStat.tokenBalance = dsBnWeiToEth(
          await dsWeb3GetTokenBalance(heal, account), decimals
        )

        const allowance = await heal.methods.allowance(account, stakingPool).call()
        userStat.approved = allowance !== "0"
        const stakeInfo = await stakingContract.methods.stakers(account).call()
        userStat.totalStaked = dsBnWeiToEth(stakeInfo.amountStaked, decimals)
        userStat.unClaimedRewards = dsBnWeiToEth(
          await stakingContract.methods.calcHarvestTot(account).call(),rewardDecmials
        )
        // console.log("[HEAL] current reward = ", userStat.unClaimedRewards)
      }
    } catch (e) {
      console.log("[HEAL] Faild to query heal info... err = ", dsErrMsgGet(e.message))
      return null
    }
  }
  userStat.sharePoint = userStat.tokenBalance
    ? dsUtilToHumanizeFixed((userStat.tokenBalance * 100) / tokenStat.totalSupply)
    : 0
  userStat.stakeSharePoint = userStat.totalStaked === 0
    ? 0
    : dsUtilToHumanizeFixed((userStat.totalStaked * 100) / stakingStat.totalStaked)
  return {tokenStat, userStat, stakingStat}
}

export async function healFaaSApprove(provider) {
  const healContract = dsWeb3GetContract(provider, healAddr, healAbi.abi)
  const [stakingPoolAddr, ] = await healFaaSGetStakingPool(provider)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    healContract.methods.approve(stakingPoolAddr, UINT256_MAX)
  )
  return transaction
}

export async function healFaaSStake(provider, amount) {
  const faas = dsWeb3GetContract(provider, config.contracts.faas, faasAbi.abi)
  const stakingPools = await faas.methods.getTokensForStaking(healAddr).call()
  const stakingPool = stakingPools[0]
  const decimals = await dsWeb3GetTokenDecmials(provider, healAddr)
  const stake = dsWeb3GetContract(provider, stakingPool, stakingAbi.abi)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    stake.methods.stakeTokens(dsBnEthToWei(amount, decimals), [])
  )
  return transaction
}

export async function healFaaSUnstake(provider, amount) {
  const [, stakingContract] = await healFaaSGetStakingPool(provider)
  const decimals = await dsWeb3GetTokenDecmials(provider, healAddr)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    stakingContract.methods.unstakeTokens(dsBnEthToWei(amount, decimals), true)
  )
  return transaction
}

export async function healFaaSClaim(provider) {
  const [, stakingContract] = await healFaaSGetStakingPool(provider)
  const transaction = await dsWeb3SendTransaction(
    provider,
    null,
    stakingContract.methods.harvestForUser(provider.selectedAddress, false))
  return transaction
}

async function healFaaSGetStakingPool(provider) {
  const faas = dsWeb3GetContract(provider, config.contracts.faas, faasAbi.abi)
  const stakingPools = await faas.methods.getTokensForStaking(healAddr).call()
  const contract = dsWeb3GetContract(provider, stakingPools[0], stakingAbi.abi)
  return [stakingPools[0], contract]
}

export async function queryHealInfo(_provider) {
  let tokenStat = {
    price           : 0,
    totalSupply     : 0,
    treasuryBalance : 0,
  }
  let userStat = {
    tokenBalance        : 0,
    totalClaimed        : 0,
    unClaimedRewards    : 0,
    totalStaked         : 0,
    stakeBase           : 0,
    approved            : false,
    sharePoint          : 0,
    stakeSharePoint     : 0,
  }
  let stakingStat = {
    rewardTokenSymbol   : "",
    totalStaked         : 0,
    rewardPerBlock      : 0,
    totalStakers        : 0,
  }

  let provider = _provider

  if (TESTING === true)
  {
    tokenStat.price = dsUtilGenerateRandomNumber(0.001, 5).toFixed(4)
    tokenStat.totalSupply = dsUtilGenerateRandomNumber(1000, 99999).toFixed(4)
    tokenStat.treasuryBalance = dsUtilGenerateRandomNumber(10, 40000).toFixed(4)
    userStat.tokenBalance = dsUtilGenerateRandomNumber(0.01, 10).toFixed(4)
    userStat.totalClaimed = dsUtilGenerateRandomNumber(0.1, 10).toFixed(4)
    userStat.unClaimedRewards = dsUtilGenerateRandomNumber(0.1, 5).toFixed(4)
  } else {
    try {
      if (provider === undefined)
        provider = TARGET_NET.rpc
      
      // get base data of smart contracts
      const distributor = dsWeb3GetContract(provider, config.contracts.distributor, distribAbi.abi)
      const healToken = await distributor.methods.shareholderToken().call();
      const rewardingToken = TARGET_NET.weth
      const heal = dsWeb3GetContract(provider, healToken, healAbi.abi)
      const decimals = parseInt(await dsWeb3GetTokenDecmials(provider, healToken))
      const rewardDecmials = parseInt(await dsWeb3GetTokenDecmials(provider, rewardingToken))
      // get token stat
      const treasuryAddr = TARGET_NET.treasury
      tokenStat.treasuryBalance = dsBnWeiToEth(await dsWeb3GetStableBalance(provider, treasuryAddr, TARGET_NET.router, TARGET_NET.stablecoin))
      tokenStat.totalSupply = dsBnWeiToEth(await heal.methods.totalSupply().call(), decimals)
      tokenStat.price = dsBnWeiToEth(await dsWeb3GetTokenPriceByRouter(provider, TARGET_NET.router, healToken, TARGET_NET.stablecoin))
      // get staking stat
      stakingStat.rewardTokenSymbol = await dsWeb3TokenSymbol(provider, rewardingToken)
      stakingStat.totalStaked = dsBnWeiToEth(await distributor.methods.totalSharesDeposited().call(), decimals)
      stakingStat.totalStakers = await distributor.methods.totalStakedUsers().call()
      // get user specific stat
      const account = provider.selectedAddress
      if (account !== null && account !== undefined)
      {
        userStat.tokenBalance = dsBnWeiToEth(await dsWeb3GetTokenBalance(heal, account), decimals)
        const allowance = await heal.methods.allowance(account, config.contracts.distributor).call()
        userStat.approved = allowance !== "0"
        const rewards = await distributor.methods.rewards(account).call()
        userStat.totalClaimed = dsBnWeiToEth(rewards.totalRealised, rewardDecmials)
        userStat.totalStaked = dsBnWeiToEth(await distributor.methods.getShares(account).call(), decimals)
        userStat.stakeBase = dsBnWeiToEth(await distributor.methods.getBaseShares(account).call(), decimals)
        userStat.unClaimedRewards = dsBnWeiToEth(await distributor.methods.getUnpaid(account).call(), rewardDecmials)
        // console.log("[HEAL] totalStaked = ", userStat.totalStaked)
      }
    } catch (e) {
      console.log("[HEAL] Faild to query heal info... err = ", dsErrMsgGet(e.message))
      return null
    }
  }
  userStat.sharePoint = userStat.tokenBalance
    ? dsUtilToHumanizeFixed((userStat.tokenBalance * 100) / tokenStat.totalSupply)
    : 0
  userStat.stakeSharePoint = userStat.stakeBase === 0
    ? 0
    : dsUtilToHumanizeFixed((userStat.stakeBase * 100) / stakingStat.totalStaked)
  return {tokenStat, userStat, stakingStat}
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

async function getStakingTokenInfo(provider, distributor) {
  const stakingToken = await distributor.methods.shareholderToken().call()
  const decimals = await dsWeb3GetTokenDecmials(provider, stakingToken)
  const contract = dsWeb3GetContract(provider, stakingToken, healAbi.abi)
  return [contract, decimals]
}

export async function healApprove(provider) {
  const distrbAddr = config.contracts.distributor
  const distributor = dsWeb3GetContract(provider, distrbAddr, distribAbi.abi)
  const [healContract, ] = await getStakingTokenInfo(provider, distributor)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    healContract.methods.approve(distrbAddr, UINT256_MAX)
  )
  return transaction
}

export async function healStake(provider, amount, nftIds) {
  const distributor = dsWeb3GetContract(provider, config.contracts.distributor, distribAbi.abi)
  const [, decimals] = await getStakingTokenInfo(provider, distributor)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    distributor.methods.stake(dsBnEthToWei(amount, decimals), nftIds)
  )
  return transaction
}

export async function healUnstake(provider, amount) {
  const distributor = dsWeb3GetContract(provider, config.contracts.distributor, distribAbi.abi)
  const [, decimals] = await getStakingTokenInfo(provider, distributor)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    distributor.methods.unstake(dsBnEthToWei(amount, decimals), false)
  )
  return transaction
}

export async function healClaim(provider) {
  const distributor = dsWeb3GetContract(provider, config.contracts.distributor, distribAbi.abi)
  const transaction = dsWeb3SendTransaction(
    provider,
    null,
    distributor.methods.claimReward(false)
  )
  return transaction
}
