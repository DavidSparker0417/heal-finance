import stakeAbi from '../build/contracts/StakingRewardsWithReflection.json'
import healAbi from '../build/contracts/HEAL.json'
import {privateKey} from '../.secret.json'
import { dsConfigRead } from '../ds-lib/ds-config.js'
import { 
  dsBnEthToWei, 
  dsBnWeiToEth, 
  dsWeb3GetAddressFromPrivKey, 
  dsWeb3GetBalance, 
  dsWeb3GetContract, 
  dsWeb3GetTokenBalance, 
  dsWeb3SendCoin, 
  dsWeb3SendTransaction } from '../ds-lib/ds-web3'
import { dsUtilSecondToTimeFormatString } from '../ds-lib/ds-utils'

const ownerPKey = privateKey
const config = dsConfigRead('./config.json')
const provider = config.networks[config.networks.target].url
const stakingContract = dsWeb3GetContract(provider, config.contracts.staking, stakeAbi.abi)
const healContract = dsWeb3GetContract(provider, config.contracts.heal, healAbi.abi)

export async function stakeTotalSupply() {
  try {
    const totalSupply = await stakingContract.methods.totalSupply().call()
    return totalSupply
  } catch(e) {
    console.log(`[STAKE] Getting total supply failed. err = (${e.message})`)
  }
}

export async function stakeGetPoolFunds() {
  try {
    const funds = await dsWeb3GetBalance(provider, config.contracts.staking)
    return funds
  } catch (e) {
    console.log(`[STAKE] Getting pool funds failed. err = (${e.message})`)
  }
}

export async function stakeQueryEarned(address) {
  try {
    const earned = await stakingContract.methods.earned(address).call()
    return earned
  } catch(e) {
    console.log(`[STAKE] Failed to query earned. err = (${e.message})`)
  }
}

export async function stakeQueryInfo(address) {
  try {
    const totalStaked = await stakeTotalSupply()
    const rewardDuration = await stakingContract.methods.rewardsDuration().call()
    const duration = dsUtilSecondToTimeFormatString(parseInt(rewardDuration))
    const rewards = await stakingContract.methods.getRewardForDuration().call()
    const userStaked = await dsWeb3GetTokenBalance(stakingContract, address)
    const userEarned = await stakeQueryEarned(address)
    console.log(
      `--- pool info ---\n`,
      `\t Total staked token : ${totalStaked}\n`,
      `\t duration : ${duration}\n`,
      `\t rewards : ${rewards}\n`,
      `--- user ${address} ---\n`,
      `\t staked : ${userStaked} ---\n`,
      `\t earned : ${userEarned} ---\n`
    )
  } catch(e) {
    console.log(`[STAKE] Query failed. err = (${e.message})`)
  }
}

export async function stakeInvestForStaking(amount) {
  try {
    const funds = dsBnEthToWei(amount)
    const stakingPoolAddr = config.contracts.staking
    console.log(`[STAKE] Investing funs(${funds}) to staking pool...`)
    await dsWeb3SendCoin(provider, ownerPKey, stakingPoolAddr, funds)
    console.log(`[STAKE] Investing funs successfuly done.`)
    const balance = await stakeGetPoolFunds()
    console.log(`[STAKE] Current funds for rewards = ${balance}`)
  } catch(e) {
    console.log(`[STAKE] Invest funs to staking pool. err = (${e.message})`)
  }
}

export async function stakeAdd(pkey, amount) {
  try {
    const address = await dsWeb3GetAddressFromPrivKey(provider, pkey)
    const amountInWei = dsBnEthToWei(amount)
    console.log(`[STAKE] ${address} is staking with ${amount} $HEAL ...`)
    // approve
    let transaction = healContract.methods.approve(config.contracts.staking, amountInWei)
    await dsWeb3SendTransaction(provider, pkey, transaction)
    // stake
    transaction = stakingContract.methods.stake(amountInWei)
    await dsWeb3SendTransaction(provider, pkey, transaction)
    console.log(`[STAKE] Stake successfuly done.`)
    await stakeQueryInfo(address)
  } catch(e) {
    console.log(`[STAKE] Add stake failed. err = (${e.message})`)
  }
}

export async function stakeDepositForReward() {
  try {
    const currentFunds = dsBnWeiToEth(await stakeGetPoolFunds())
    console.log(`[STAKE] Depositing funds ${currentFunds} to weth ...`)
    const transaction = stakingContract.methods.convertETH()
    await dsWeb3SendTransaction(provider, ownerPKey, transaction)
    console.log(`[STAKE] Deposite successfuly done.`)
  } catch (e) {
    console.log(`[STAKE] Failed to deposit funds for rewards. err = (${e.message})`)
  }
}

export async function stakeNotifyRewards(rewards) {
  try {
    console.log(`[STAKE] Notifying rewards with ${rewards}...`)
    const rewardsInWei = dsBnEthToWei(rewards)
    const transaction = stakingContract.methods.notifyRewardAmount(rewardsInWei)
    await dsWeb3SendTransaction(provider, ownerPKey, transaction)
    console.log(`[STAKE] Notifying successfuly done.`)
  } catch (e) {
    console.log(`[STAKE] Failed to notify rewards. err = (${e.message})`)
  }
}

export async function stakeSetRewardDuration(duration) {
  try {
    console.log(`[STAKE] Setting reward duration with ${duration}...`)
    const transaction = stakingContract.methods.setRewardsDuration(duration)
    await dsWeb3SendTransaction(provider, ownerPKey, transaction)
    console.log(`[STAKE] Setting reward duration successfuly done`)
  } catch (e) {
    console.log(`[STAKE] Failed to set reward duration. err = (${e.message})`)
  }
}

export async function stakeGetReward(pkey) {
  try {
    const account = dsWeb3GetAddressFromPrivKey(provider, pkey)
    console.log(`[STAKE] ${account} Getting reward...`)
    const rewardToken = await stakingContract.methods.rewardsToken().call()
    const oldBalance = await dsWeb3GetTokenBalance(rewardToken, account, provider)
    const estimatingEarned = await stakeQueryEarned(account)
    const transaction = stakingContract.methods.getReward()
    await dsWeb3SendTransaction(provider, pkey, transaction)
    const newBalance = await dsWeb3GetTokenBalance(rewardToken, account, provider)
    console.log(`[STAKE] Getting reward successfuly done.`)
    console.log(`\t old-balance: ${oldBalance}\n`,
      `\t new-balance: ${newBalance}\n`,
      `\t earned : ${estimatingEarned}/${newBalance - oldBalance}`
    )
  } catch (e) {
    console.log(`[STAKE] Failed to get reward. err = (${e.message})`)
  }
}

export async function stakeWithdraw(pkey, amount) {
  try {
    const account = dsWeb3GetAddressFromPrivKey(provider, pkey)
    const amountInWei = dsBnEthToWei(amount)
    console.log(`[STAKE] ${account} Withdrawing for ${amount}...`)
    stakeQueryInfo(account)
    const transaction = stakingContract.methods.withdraw(amountInWei)
    await dsWeb3SendTransaction(provider, pkey, transaction)
    console.log(`[STAKE] Withdrawing successfuly done.`)
    stakeQueryInfo(account)
  } catch (e) {
    console.log(`[STAKE] Failed to withdraw. err = (${e.message})`)
  }
}