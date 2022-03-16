
export const config = {
  ether : {
    chainId : 1,
    rpc     : "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  },
  bsc : {
    chainId : 56,
    rpc     : "https://bsc-dataseed1.ninicoin.io"
  },
  bsc_test : {
    chainName   : "BSC Testnet",
    chainId     : 97,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpc         : "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrl : "https://testnet.bscscan.com",
    router      : "0x1Ed675D5e63314B760162A3D1Cae1803DCFC87C7",
    stablecoin  : "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    treasury    : "0x85048aae2FCc6877cA379e2dfDD61ea208Fa076C",
    weth        : "0xae13d989dac2f0debff460ac112a837c89baa7cd",
  },
  avalanche : {
    chainId : 43114,
    rpc     : "https://api.avax.network/ext/bc/C/rpc"
  },
  local : {
    chainId : 539,
    rpc     : "http://localhost:8545"
  },
  contracts : {
    // heal    : "0xCe719E75B25244A5770Ab2DFd3ebd22278290a77",
    heal    : "0xE7Ffaaa00Ee080b920B093425ea36F553102f485",
    faas    : "0xe5089AF9749aA2Bc0612140cd62b2CC1162D05f6",
    distributor : "0x1eA11d3B053884DAC33Ec0493214d50351a21dcb"
  }
}

export const TARGET_NET = config.bsc_test