const { faasCreateRewardPool, faasRemovePool } = require("./faas-handler")

main()
async function main() {
  const argCount = process.argv.length
  const command = process.argv[2]
  switch(command) {
    case 'create': // 1. add liquidity
      if (argCount !== 5)
      {
        console.log("Invalid command!\n",
          "Usage : node -r esm test/faas.js create {supply} {perBlockAmount}" )
      }
      const supply = process.argv[3]
      const perBlockAmount = process.argv[4]
      await faasCreateRewardPool(supply, perBlockAmount)
      break
    case 'remove':
      await faasRemovePool()
      break
    default:
      console.log("Invaid command option!")
      break
  }
}