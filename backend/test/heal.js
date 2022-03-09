import {
  healAddLiquidity,
  healAddReflection, 
  healClaimReflection, 
  healQuery, 
  healQueryFee, 
  healSetMaxTransfer, 
  healSetThresholdOfTakingFee, 
  healSetTradingFlag, healSwapAll, healWithdrawAll} from "./heal-handler"

main()
async function main() {
  const argCount = process.argv.length
  const command = process.argv[2]
  switch(command) {
    case 'addliq': // 1. add liquidity
      if (argCount !== 5)
      {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js addliq {tokenamount} {ethamount}" )
      }
      const tokenAmount = process.argv[3]
      const ethAmount = process.argv[4]
      await healAddLiquidity(tokenAmount, ethAmount)
      break
    case 'set-max-transfer': // 2. set maximum amount of token to be transfert at a time as a percentage
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js set-max-transfer {percent}" )
        break
      }
      const percent = process.argv[3]
      await healSetMaxTransfer(percent)
      break
    case 'trading': // 3. set trading to enable or disable
      let flag 
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js trading {flag: true or false}" )
        break
      }
      const strFlag = process.argv[3]
      if (strFlag === 'true')
        flag = true
      else if (strFlag === 'false')
        flag = false
      else {
        console.log("You should enter 'true' or 'false'!")
        break
      }
      await healSetTradingFlag(flag)
      break
    case 'add-reflection': // 4. add reflection
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js add-reflection {amount}" )
        break
      }
      const funds = process.argv[3]
      await healAddReflection(funds)
      break
    case 'query':
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js query {wallet address}" )
        break
      }
      const address = process.argv[3]
      await healQuery(address)
      break
    case 'withdraw':
      await healWithdrawAll()
      break
    case 'claim':
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js claim {privatekey}" )
        break
      }
      const pkey = process.argv[3]
      await healClaimReflection(pkey)
      break
    case 'set-fee-thr':
      if (argCount !== 4) {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/heal.js set-fee-thr {threshold}" )
        break
      }
      const thr = process.argv[3]
      await healSetThresholdOfTakingFee(thr)
    case 'query-fee':
      await healQueryFee()
      break
    case 'swap-all':
      await healSwapAll()
      break
    default:
      console.log("Invaid command option!")
      break
  }
}