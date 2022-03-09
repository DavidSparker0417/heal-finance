import abi from '../build/contracts/HEAL.json'
import {privateKey, audiencePKey} from '../.secret.json'
import { dsConfigRead } from '../ds-lib/ds-config.js'
import { dsBnEthToWei, dsBnWeiToEth, dsWeb3EstimateGas, dsWeb3GetAddressFromPrivKey, dsWeb3GetBalance, dsWeb3GetContract, dsWeb3GetTokenBalance, dsWeb3SendTransaction } from '../ds-lib/ds-web3.js'

const ownerPKey = privateKey
const config = dsConfigRead('./config.json')
const TARGET_NET = config.networks[config.networks.target]
const healContract = dsWeb3GetContract(TARGET_NET.url, config.contracts.heal, abi.abi)

export async function healAddLiquidity(tokenAmount, etherAmount) {
  const healAmount = dsBnEthToWei(tokenAmount)
  const eth = dsBnEthToWei(etherAmount)
  const transaction = healContract.methods.addLiquidity(healAmount)
  try {
    console.log(`[HEAL] adding liquidity with(heal:${healAmount}, eth:${eth})...`)
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction, eth)
    console.log(`[HEAL] Successfuly added liquidity!`)
  } catch (e) {
    console.log(`[HEAL] Error occured while adding liquidity (err = ${e.message})`)
  }
}

export async function healSetTradingFlag(flag) {
  try {
    const trFlag = await healContract.methods.tradingActive().call()
    console.log(`[HEAL] Setting trading enable flag as ${flag}...`)
    if (flag === trFlag) {
      console.log(`[HEAL] Already set as ${flag}.`)
      return
    }
    let transaction
    if (flag === true)
      transaction = healContract.methods.enableTrading()
    else
      transaction = healContract.methods.disableTrading()
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log(`[HEAL] Succeeded in setting trading flag!`)
  } catch(e) {
    console.log(`[HEAL] Enable trading failed. err = (${e.message})`)
  }
}

export async function healAddReflection(funds) {
  try {
    console.log(`[HEAL] Adding reflection with ${funds} ether.`)
    const reflectionAmount = dsBnEthToWei(funds)
    const transaction = healContract.methods.addReflection()
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction, reflectionAmount)
    const reflectBase = await healContract.methods.ethReflectionBasis().call()
    console.log(`[HEAL] Adding reflection successfully done. Current reflection base is ${dsBnWeiToEth(reflectBase)} ether.`)
  } catch (e) {
    console.log(`[HEAL] Failed in adding reflection. err = (${e.message})`)
  }
}

export async function healSetMaxTransfer(percent) {
  try {
    console.log(`[HEAL] Setting maximum amount of token at once ${percent}%.`)
    const maxTransferRate = percent * 10
    const transaction = healContract.methods.setMaxTransfer(maxTransferRate)
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log(`[HEAL] Setting maximum transfer rate successfuly done. ${percent}%.`)
    const totalSupply = dsBnWeiToEth(await healContract.methods.totalSupply().call())
    const txAmount = (totalSupply * percent) / 100
    console.log(`[HEAL] Maximum transfer amount at once is. ${txAmount} $HEAL.`)
  } catch (e) {
    console.log(`[HEAL] Failed to set max transfer. err = (${e.message})`)
  }
}

export async function healQuery(address) {
  try {
    console.log(`[HEAL] Query for ${address}...`)
    const ethBalance = await dsWeb3GetBalance(TARGET_NET.url, address)
    const balance = dsBnWeiToEth(await healContract.methods.balanceOf(address).call())
    const totalSupply = dsBnWeiToEth(await healContract.methods.totalSupply().call())
    const shareRatio = (balance*100)/totalSupply
    const reflectionBase = dsBnWeiToEth(await healContract.methods.ethReflectionBasis().call())
    const lastReflectionBase = dsBnWeiToEth(await healContract.methods.lastReflectionBasis(address).call())
    const reward = dsBnWeiToEth(await healContract.methods.unclaimedReflection(address).call())
    console.log(`   ETH                     : ${ethBalance}\n`,
                `   balance                 : ${balance}/${totalSupply}, ${shareRatio}%\n`,
                `   current reflection base : ${reflectionBase}\n`,
                `   last reflection for this: ${lastReflectionBase}\n`,
                `   estimating reward       : ${reward}`
    )
  } catch (e) {
    console.log(`[HEAL] Failed to query. err = (${e.message})`)
  }
}

export async function healWithdrawAll() {
  try {
    console.log(`[HEAL] Withdrawing all funds in token wallet...`)
    const transaction = healContract.methods.withdrawAll()
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log(`[HEAL] Withdrawing all funds successfuly done.`)
  } catch (e) {
    console.log(`[HEAL] Failed to withdraw all. err = (${e.message})`)
  }
}

export async function healClaimReflection(pkey) {
  try {
    const address = dsWeb3GetAddressFromPrivKey(TARGET_NET.url, pkey)
    console.log(`[HEAL] Claim reflection from ${address}...`)
    const estimateReward = await healContract.methods.unclaimedReflection(address).call()
    if (estimateReward.length < 18 && parseInt(estimateReward) === 0)
    {
      console.log(`[HEAL] No more rewards!`)
      return
    }
    const oldBalance = await dsWeb3GetBalance(TARGET_NET.url, address)
    const transaction = healContract.methods.claimReflection()
    const gasUsed = await dsWeb3SendTransaction(TARGET_NET.url, audiencePKey, transaction)
    const newBalance = await dsWeb3GetBalance(TARGET_NET.url, address)
    console.log(`[HEAL] new balance       = `, newBalance)
    console.log(`[HEAL] old balance       = `, oldBalance)
    console.log(`[HEAL] spent gas         = `, gasUsed)
    console.log(`[HEAL] estimating reward = `, estimateReward)
    console.log(`[HEAL] Claim successfuly done.`)
  } catch (e) {
    console.log(`[HEAL] Failed to claim. err = (${e.message})`)
  }
}

export async function healSetThresholdOfTakingFee(threshold) {
  try {
    console.log(`[HEAL] Setting threshold for triggering fee as ${threshold}...`)
    const transaction = healContract.methods.setMinTokenBalance(threshold)
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log(`[HEAL] Setting threshold for successfuly done.`)
  } catch (e) {
    console.log(`[HEAL] Setting threshold for triggering fee  failed. err = (${e.message})`)
  }
}

export async function healQueryFee() {
  try {
    const balanceForFee = await dsWeb3GetTokenBalance(healContract, config.contracts.heal)
    const feeTreasury = await healContract.methods.totalTreasury().call()
    const feeMarketing = await healContract.methods.totalMarketing().call()
    const feeReflection = await healContract.methods.totalReflected().call()
    const feeCharity = await healContract.methods.totalCharity().call()
    const buybackWallet = await healContract.methods.buybackWallet().call()
    const treasuryWallet = await healContract.methods.treasuryWallet().call()
    const charityWallet = await healContract.methods.charityWallet().call()
    const balanceMarket = await dsWeb3GetBalance(TARGET_NET.url, buybackWallet)
    const balanceTreasury = await dsWeb3GetBalance(TARGET_NET.url, treasuryWallet)
    const balanceCharity = await dsWeb3GetBalance(TARGET_NET.url, charityWallet)
    const balanceReflection = await healContract.methods.ethReflectionBasis().call()
    console.log( `---- Fee ($HEAL) ------\n`,
      `total      : ${balanceForFee}\n`,
      `marketing  : ${feeMarketing}\n`,
      `treasury   : ${feeTreasury}\n`,
      `charity    : ${feeCharity}\n`,
      `reflection : ${feeReflection}\n`)
    console.log( `---- Balance ($ETH) ------\n`,
      `marketing  : ${balanceMarket}\n`,
      `treasury   : ${balanceTreasury}\n`,
      `charity    : ${balanceCharity}\n`,
      `reflection : ${balanceReflection}\n`,
      )
  } catch (e) {
    console.log(`[HEAL] Failed query fee state. err = (${e.message})`)
  }
}

export async function healSwapAll() {
  try {
    await healQueryFee()
    console.log(`[HEAL] ++++++++ Staring Swap All +++++++++`)
    const transaction = healContract.methods.swapAll()
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log(`[HEAL] ++++++++ Swap All finished +++++++++`)
    await healQueryFee()
  } catch (e) {
    console.log(`[HEAL] Failed to swap all. err = (${e.message})`)
  }
}