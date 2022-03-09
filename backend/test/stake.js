const { argv } = require("process")
const { stakeQueryInfo, stakeAdd, stakeDepositForReward, stakeInvestForStaking, stakeNotifyRewards, stakeSetRewardDuration, stakeGetReward, stakeWithdraw } = require("./staking-handler")

main()
async function main() {
  const argCount = process.argv.length
  const command = process.argv[2]
  switch(command) {
    case 'query':
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js query {address}" )
        break
      }
      const address = argv[3]
      await stakeQueryInfo(address)
      break
    case 'invest': // 1. invest
    {  
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js invest {ether}" )
        break
      }
      const amount = process.argv[3]
      stakeInvestForStaking(amount)
      break
    }
    case 'deposit': // 2. deposit
    { 
      await stakeDepositForReward()
      break
    }
    case 'stake':
      if (argCount !== 5) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js stake {privateKey} {amount}" )
        break
      }
      const pkey = argv[3]
      const amount = argv[4]
      await stakeAdd(pkey, amount)
      break
    case 'notify-rewards': // 3. notify
    { 
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js notify-rewards {amount}" )
        break
      }
      const amount = process.argv[3]
      await stakeNotifyRewards(amount)
      break
    }
    case 'set-reward-duration':
    { 
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js set-reward-duration {amount}" )
        break
      }
      const duration = process.argv[3]
      await stakeSetRewardDuration(duration)
      break
    }
    case 'get-reward':
    { 
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js get-reward {privateKey}" )
        break
      }
      const pkey = process.argv[3]
      await stakeGetReward(pkey)
      break
    }
    case 'withdraw':
    { 
      if (argCount !== 5) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/stake.js withdraw {privateKey}{amount}" )
        break
      }
      const pkey = process.argv[3]
      const amount = process.argv[4]
      await stakeWithdraw(pkey, amount)
      break
    }
    default:
      console.log("Invaid command option!")
      break
  }
}