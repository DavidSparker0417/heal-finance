import abi from '../build/contracts/HEALFaaS.json'
import tokenAbi from '../build/contracts/HEAL.json'
import {privateKey, audiencePKey} from '../.secret.json'
import { dsConfigRead } from '../ds-lib/ds-config.js'
import { dsBnEthToWei, dsErrMsgGet, dsWeb3GetContract, dsWeb3SendTransaction, UINT256_MAX } from '../ds-lib/ds-web3'

const ownerPKey = privateKey
const config = dsConfigRead('./config.json')
const TARGET_NET = config.networks[config.networks.target]
const faasContract = dsWeb3GetContract(TARGET_NET.url, config.contracts.faas, abi.abi)

export async function faasCreateRewardPool(supply, perBlockAmount) {
  const rewardToken = config.contracts.heal
  const stakingToken = config.contracts.heal
  const rewardTokenContract = dsWeb3GetContract(TARGET_NET.url, rewardToken, tokenAbi.abi)
  await dsWeb3SendTransaction(
    TARGET_NET.url,
    ownerPKey,
    rewardTokenContract.methods.approve(config.contracts.faas, UINT256_MAX)
  )
  const decimals = await rewardTokenContract.methods.decimals().call()
  const transaction = faasContract.methods.createNewTokenContract(
    rewardToken,
    config.contracts.heal,
    dsBnEthToWei(supply, decimals),
    dsBnEthToWei(perBlockAmount, decimals),
    0,
    0,
    false
  )
  console.log("[FAAS] Creating stake pool...")
  try {
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, transaction)
    console.log("[FAAS] Pool successfully created.")
  } catch (e) {
    console.log("[FAAS] Failed to create stake pool. err = ", dsErrMsgGet(e.message))
  }
}

export async function faasRemovePool() {

  try {
    console.log("[FAAS] Removing pool.")
    const pools = await faasContract.methods.getTokensForStaking(config.contracts.heal).call()
    await dsWeb3SendTransaction(TARGET_NET.url, ownerPKey, 
      faasContract.methods.removeTokenContract(pools[0]))
    console.log("[FAAS] Pool is revmoved successfully.")
  } catch(e) {
    console.log("[FAAS] Failed to remove pool. error: ", dsErrMsgGet(e.message))
  }
}