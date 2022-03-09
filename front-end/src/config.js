
export const config = {
  ether : {
    chainId : 1,
    rpc     : "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  },
  bsc : {
    chainId : 56,
    url     : "https://bsc-dataseed1.ninicoin.io"
  },
  bsc_test : {
    chainId     : 97,
    url         : "https://data-seed-prebsc-1-s1.binance.org:8545/",
    router      : "0x1Ed675D5e63314B760162A3D1Cae1803DCFC87C7",
    stablecoin  : "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee"
  },
  avalanche : {
    chainId : 43114,
    url     : "https://api.avax.network/ext/bc/C/rpc"
  },
  local : {
    chainId : 539,
    rpc     : "http://localhost:8545"
  },
  contracts : {
    heal    : "0xCe719E75B25244A5770Ab2DFd3ebd22278290a77",
    staking : "0x1E510560737916cC0942C7b14bDB4EcB9c98B1Ab"
  }
}

export const TARGET_NET = config.bsc_test