const { dsConfigWrite, dsConfigRead } = require("../ds-lib/ds-config");
const configPath = './config.json'
const heal = artifacts.require("HEAL");
const staking = artifacts.require("StakingRewardsWithReflection")

module.exports = async function (deployer, network, account) {
  let config = dsConfigRead(configPath)
  const targetNet = config.networks[config.networks.target]
  // ------- deploy heal token -----------
  await deployer.deploy(
    heal,
    targetNet.factory, // factory
    targetNet.router, // router
    config.wallet.buyback,
    config.wallet.treasury,
    config.wallet.charity
  );
  const healContract = await heal.deployed()
  console.log("[HEAL] contract address = ", healContract.address)
  config.contracts.heal = healContract.address
  // ------- deploy staking token -----------
  await deployer.deploy(
    staking,
    account[0],           // owner
    account[0],           // reward distribution
    targetNet.weth,       // reward token
    healContract.address, // staking token
    targetNet.weth        // weth
  )
  const stakingContract = await staking.deployed()
  console.log("[STAKE] contract address = ", stakingContract.address)
  config.contracts.staking = stakingContract.address
  dsConfigWrite(config, configPath)
};
