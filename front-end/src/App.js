import Title from './components/Title';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { TARGET_NET } from 'config';
import { useDispatch } from 'react-redux';
import { setTokenStat, setUserStat } from './store/healSlice';
import { queryHealInfo } from './heal-contract';
import Footer from './components/Footer';
import MainNav from './components/MainNav';
import { BrowserRouter } from 'react-router-dom';
import Main from './Main';

export const Context = createContext()
const REFRESH_INTERVAL = 2000;

function App() {
  // wallet
  const wallet = useWallet();
  // redux dispather
  const dispatch = useDispatch()
  
  // refresh function
  const refresh = useCallback(async () => {
    const provider = wallet._web3ReactContext.library;
    // console.log(wallet._web3ReactContext)
    const healInfo = await queryHealInfo(provider)
    if (healInfo === null)
      return
    dispatch(setTokenStat(healInfo.tokenStat))
    dispatch(setUserStat(healInfo.userStat))
  }, [wallet.account]);

  // refresh page every a certain period
  useEffect(() => {
    console.log("+++++++++++ Initial Loading ++++++++++++");
    let ac = new AbortController();

    const callRefresh = async () => {
      refresh().then(() => {
        if (ac.signal.aborted === false) {
          setTimeout(() => callRefresh(), REFRESH_INTERVAL);
        }
      })
    }

    callRefresh();
    return () => ac.abort();
  }, [refresh])

  // wallet balance event
  useEffect(() => {
  }, [wallet.balance])

  return (
    <Context.Provider value={{TARGET_NET}}>
      <div className='App'>
      <Title 
        brand = '/images/brand.png'
        title = "HEAL THE WORLD"
      />
      <BrowserRouter>
        <MainNav />
        <Main />
      </BrowserRouter>
      <Footer />
      </div>
    </Context.Provider>
  );
}

export default App;
