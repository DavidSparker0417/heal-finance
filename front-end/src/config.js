
export const config = {
  ether : {
    chainName   : "Ethereum",
    chainId : 1,
    rpc     : "https://mainnet.infura.io/v3/",
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrl : "https://etherscan.io",
    router      : "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    weth        : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    stablecoin  : "0xdAC17F958D2ee523a2206206994597C13D831ec7",
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
  avalanche_test : {
    chainName   : "Avalanche Testnet",
    chainId     : 43113,
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    rpc         : "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorerUrl : "https://cchain.explorer.avax-test.network",
    router      : "0x1Ed675D5e63314B760162A3D1Cae1803DCFC87C7",
    stablecoin  : "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    treasury    : "0x85048aae2FCc6877cA379e2dfDD61ea208Fa076C",
    weth        : "0xae13d989dac2f0debff460ac112a837c89baa7cd",
  },
  local : {
    chainId : 539,
    rpc     : "http://localhost:8545"
  },
  contracts : {
    heal    : "0xE7Ffaaa00Ee080b920B093425ea36F553102f485",
    faas    : "0xe5089AF9749aA2Bc0612140cd62b2CC1162D05f6",
    distributor : "0x1eA11d3B053884DAC33Ec0493214d50351a21dcb"
  }
}

export const TARGET_NET = config.bsc_test