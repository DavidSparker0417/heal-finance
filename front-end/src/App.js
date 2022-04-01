import Title from './components/Title';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { TARGET_NET } from 'config';
import { useDispatch } from 'react-redux';
import { setNftStat, setStakingStat, setTokenStat, setUserStat } from './store/healSlice';
import { queryHealInfo, queryNftInfo } from './heal-contract';
import Footer from './components/Footer';
import MainNav from './components/MainNav';
import { BrowserRouter } from 'react-router-dom';
import Main from './Main';
import LoadingSpinner from './components/common/loading-spinner'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Context = createContext()
const REFRESH_INTERVAL = 3000;

function App() {
  // wallet
  const wallet = useWallet();
  // redux dispather
  const dispatch = useDispatch()
  // loading status
  const [loading, setLoading] = useState(false)

  // refresh function
  const refresh = useCallback(async () => {
    const provider = wallet._web3ReactContext.library;
    const healInfo = await queryHealInfo(provider, wallet.account)
    if (healInfo === null)
      return
    dispatch(setTokenStat(healInfo.tokenStat))
    dispatch(setUserStat(healInfo.userStat))
    dispatch(setStakingStat(healInfo.stakingStat))
    const nftInfo = await queryNftInfo(provider)
    dispatch(setNftStat(nftInfo))
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
    <Context.Provider value={{ TARGET_NET, setLoading }}>
      <Title
        brand='/images/brand.png'
        title="HEAL THE WORLD"
      />
      <BrowserRouter>
        <MainNav />
        <Main />
      </BrowserRouter>
      <Footer />
      <ToastContainer
        position="top-center"
        theme='dark'
      />
      {
        loading === true && <LoadingSpinner />
      }
    </Context.Provider>
  );
}

export default App;
