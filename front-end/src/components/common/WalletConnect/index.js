import React, { useEffect, useRef, useCallback } from 'react'
import {
  WalletConnectContainer
} from './styles'

export const WalletConnect = (props) => {
  const { close } = props;

  const ht = useRef();

  const handleMetamaskConnect = () => {
    props.walletConnect('metamask')
    close && close();
  }

  const handleCoinbaseConnect = () => {
    props.walletConnect('coinbase')
    close && close();
  }
  const handleWalletConnect = () => {
    props.walletConnect('walletconnect')
    close && close();
  }

  const handleClickOutside = useCallback((e) => {
    const outSideMenu = !ht.current?.contains(e.target)
    if (outSideMenu) {
      close && close();
    }
  }, [close])

  useEffect(() => {
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [handleClickOutside])

  return (
    <WalletConnectContainer >
      <div className='wallet-frame' ref={ht}>
        <div className='one-wallet top-radius' onClick={handleMetamaskConnect}>
          <div className='wallet-caption'>
            <img src="images/Metamask-Icon.png" alt='metamask' width='36px' height='36px' />
            <div className='wallet-label'>Metamask</div>
          </div>
          <div className='wallet-description'>Connect to your MetaMask Wallet</div>
        </div>
        {/* <div className='one-wallet' onClick={handleCoinbaseConnect}>
          <div className='wallet-caption'>
            <img src="images/coinbase.png" alt='metamask' width='36px' height='36px' />
            <div className='wallet-label'>CoinBase</div>
          </div>
          <div className='wallet-description'>Connect to your coinbase Wallet</div>
        </div> */}
        <div className='one-wallet bottom-radius' onClick={handleWalletConnect}>
          <div className='wallet-caption'>
            <img src="images/ConnectWallet-icon.png" alt='metamask' width='36px' height='36px' />
            <div className='wallet-label'>WalletConnect</div>
          </div>
          <div className='wallet-description'>Scan with WalletConnect to connect</div>
        </div>
      </div>
    </WalletConnectContainer>
  )
}
