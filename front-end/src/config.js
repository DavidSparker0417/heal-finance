
export const config = {
  ether : {
    alias       : "mainnet",
    chainName   : "Ethereum",
    chainId : 1,
    rpc     : "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrl : "https://etherscan.io",
    router      : "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    weth        : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    stablecoin  : "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    treasury    : "0x7580C35f3FC73BE051f39ECdCD7f94fF53725960",
  },
  ropsten : {
    alias     : "ropsten",
    chainName : "Ropsten",
    chainId   : 3,
    rpc       : "https://ropsten.infura.io/v3/4ed333d7dc574183b0f09d3bcdebcb1e",
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrl : "https://ropsten.etherscan.io",
    router      : "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    weth        : "0xc778417e063141139fce010982780140aa0cd5ab",
    stablecoin  : "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    treasury    : "0x85048aae2FCc6877cA379e2dfDD61ea208Fa076C",
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
    heal    : "0x383B0b2ce2e1757b5e1D087D8f36013eA595541a",
    faas    : "0xe5089AF9749aA2Bc0612140cd62b2CC1162D05f6",
    distributor : "0x422172cC753cC24e0f89983FeeA11D1fdaaaace7"
  }
}

export const TARGET_NET = config.ether