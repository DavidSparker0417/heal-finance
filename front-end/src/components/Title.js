import { Context } from "App";
import { dsWalletGetTrimedAccountName } from "ds-lib/ds-web3";
import { dsErrMsgGet, dsWalletAddChain, dsWalletCoinbaseGetProvider, dsWalletConnectInjected } from "../ds-lib/ds-web3";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { DivVCenter } from "./common/StyledComponents";
import { toast } from "react-toastify";
import { WalletConnect } from "./common/WalletConnect";
import { config } from "config";

export default function Title({ brand, title }) {
  const wallet = useWallet()
  const { TARGET_NET } = useContext(Context)
  const [walletButtonFace, setWalletButtonFace] = useState("Wallet Connect");
  const { setLoading } = useContext(Context)
  const [showWallet, setShowWallet] = useState(false)
  // event on wallet 
  useEffect(() => {
    if (wallet.status === 'connecting')
      return;
    const btnName = wallet.account !== null
      ? dsWalletGetTrimedAccountName(wallet.account)
      : "Wallet Connect";
    setWalletButtonFace(btnName);
    if (wallet.isConnected())
      toast.success("Wallet connected!")
  }, [wallet.status])

  async function walletConnect(connector) {
    let behavior
    if (connector === 'metamask' || connector === 'coinbase') {
      setLoading(true)
      try {
        await dsWalletConnectInjected(TARGET_NET, connector)
      } catch (e) {
        setLoading(false)
        toast.error(e.message?dsErrMsgGet(e.message):e)
        return
      }
      behavior = wallet.connect()
      behavior
      .then(function() {
        setLoading(false)
      })
      .catch(function(e) {
        setLoading(false)
        toast.error(dsErrMsgGet(e.message))
      })
    }
    else
      wallet.connect(connector)
  }
  // halder on clicking wallet connect button
  async function handleConnectWallet() {
    if (wallet.isConnected()) {
      wallet.reset()
      return;
    }
    setShowWallet(true)
  }
  return (
    <div className="al-h main-title" style={{ justifyContent: "space-between" }}>
      <DivVCenter>
        <a href="https://healtheworld.io/" target="_blank">
          <img
            alt=''
            src={brand}
            style={{ width: "auto", height: "auto", margin: "0.5rem" }} />
        </a>
      </DivVCenter>
      <DivVCenter>
        <h1>{title}</h1>
      </DivVCenter>
      <div style={{ display: "flex", justifyContent: "right" }}>
        <DivVCenter>
          <button 
            onClick={() => 
              window.open(`https://app.uniswap.org/#/swap?outputCurrency=${config.contracts.heal}&chain=${TARGET_NET.alias}}`, 'blank')}>
            BUY ON UNISWAP
          </button>
        </DivVCenter>
        <DivVCenter>
          <button onClick={handleConnectWallet}>
            {walletButtonFace}
          </button>
        </DivVCenter>
      </div>
      {showWallet 
      && <WalletConnect 
            close={() => setShowWallet(false)} 
            walletConnect={walletConnect} 
      />}
    </div>
  )
}