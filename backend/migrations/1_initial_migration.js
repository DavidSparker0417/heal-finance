const { dsConfigWrite, dsConfigRead } = require("../ds-lib/ds-config");
const configPath = './config.json'
const {constants} = require('@openzeppelin/test-helpers')

async function deployHealToken(deployer) {
  const heal = artifacts.require("HEAL");
  await deployer.deploy(heal);
  const healContract = await heal.deployed()
  console.log("[HEAL] contract address = ", healContract.address)
  return healContract.address
}

async function deployFaaS(deployer) {
  const faas = artifacts.require("HEALFaaS");
  await deployer.deploy(faas, constants.ZERO_ADDRESS, constants.ZERO_ADDRESS);
  const faasContract = await faas.deployed()
  console.log("[FAAS] contract address = ", faasContract.address)
  return faasContract.address
}

module.exports = async function (deployer, network, account) {
  let config = dsConfigRead(configPath)
  const targetNet = config.networks[config.networks.target]
  // ------- deploy heal token -----------
  // config.contracts.heal = await deployHealToken(deployer)
  config.contracts.faas = await deployFaaS(deployer)
  dsConfigWrite(config, configPath)
};
