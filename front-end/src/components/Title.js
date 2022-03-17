import { Context } from "App";
import { dsWalletGetTrimedAccountName } from "ds-lib/ds-web3";
import { dsErrMsgGet, dsWalletAddChain, dsWalletConnectInjected } from "../ds-lib/ds-web3";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { DivVCenter } from "./common/StyledComponents";
import { toast } from "react-toastify";

export default function Title({ brand, title }) {
  const wallet = useWallet()
  const { TARGET_NET } = useContext(Context)
  const [walletButtonFace, setWalletButtonFace] = useState("Wallet Connect");
  const { setLoading } = useContext(Context)
  // event on wallet 
  useEffect(() => {
    if (wallet.status === 'connecting')
      return;
    const btnName = wallet.account !== null
      ? dsWalletGetTrimedAccountName(wallet.account)
      : "Wallet Connect";
    setWalletButtonFace(btnName);
  }, [wallet.status])

  // halder on clicking wallet connect button
  async function handleConnectWallet() {
    if (wallet.isConnected()) {
      wallet.reset()
      return;
    }
    let behavior
    if (window.ethereum) {
      setLoading(true)
      try {
        await dsWalletConnectInjected(TARGET_NET)
      } catch (e) {
        setLoading(false)
        toast.error(dsErrMsgGet(e.message))
        return
      }
      behavior = wallet.connect()
      behavior
      .then(function() {
        setLoading(false)
        toast.success("Wallet connected!")
      })
      .catch(function(e) {
        setLoading(false)
        toast.error(dsErrMsgGet(e.message))
      })
    }
    else
      wallet.connect('walletconnect')
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
          <button onClick={() => window.open('https://app.uniswap.org/#/swap?outputCurrency=0xd5A98E77d1fEB091344096301Ea336a5C07a6A41&chain=mainnet}', 'blank')}>
            BUY ON UNISWAP
          </button>
        </DivVCenter>
        <DivVCenter>
          <button onClick={handleConnectWallet}>
            {walletButtonFace}
          </button>
        </DivVCenter>
      </div>
    </div>
  )
}