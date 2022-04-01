import ButtonGroup from "../components/common/ButtonGroup";
import TextBox from "../components/common/TextBox";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DivCoverMask } from "components/common/StyledComponents";
import { healStake, healUnstake } from "../heal-contract";
import { useWallet } from "use-wallet";
import { toast } from "react-toastify";
import { Context } from "App";
import { dsErrMsgGet } from "ds-lib/ds-web3";
import styled from "styled-components";
import { healApprove } from "heal-contract";

const stakeGroupData = [
  'Stake',
  'Unstake'
]

const StakeButton = styled.button`
  width:50%;
  font-size:20px;
  font-weight:bold;
  margin-bottom: 10px;
`

function StakerPanel({balance, totalStaked}) {
  const wallet = useWallet()
  const [tokenAmount, setTokenAmount] = useState()
  const [stakingMode, setStakingMode] = useState()
  const {setLoading} = useContext(Context)
  const userStat = useSelector((state) => state.heal.userStat)
  function handleInputTokenAmount({target}) {
    setTokenAmount(target.value)
  }

  useEffect(() => {
    setTokenAmount(0)
  }, [stakingMode])

  function handleStaking(type) {
    const amount = parseFloat(tokenAmount)
    if (amount === NaN || amount === 0)
    {
      toast.error("Amount must be greater than zero!")
      return
    }

    const transaction = 
      type === 'Stake' 
        ? healStake(wallet.ethereum, wallet.account, amount, [])
        : healUnstake(wallet.ethereum, wallet.account, amount === totalStaked ? 0 : amount)
    setLoading(true)
    transaction
      .then(function() {
        setLoading(false)
        toast.success("Successfully staked.")
      })
      .catch(function(e) {
        setLoading(false)
        toast.error(`Failed to stake.(${dsErrMsgGet(e.message)})`)
      })
  }

  function handleApprove() {
    setLoading(true)
    healApprove(wallet.ethereum, wallet.account)
      .then(function() {
        setLoading(false)
        toast.success("Successfully approved")
      })
      .catch (function(e) {
        setLoading(false)
        toast.error(`Failed to approve. (${dsErrMsgGet(e.message)})`)
      }) 
  }

  return(
    <div className="stake-panel meta-card g-vertical">
      <ButtonGroup 
        data = {stakeGroupData} 
        style={{margin:"2rem 1rem 1rem"}}
        handleChanged = {(mode) => setStakingMode(mode)}
      />
      <span style={{textAlign:"right", paddingRight:"1.5rem"}}>
        {stakingMode === 'Stake' 
          ? `Balance: ${balance}` 
          : `Total Staked: ${totalStaked} `}
      </span>
      <TextBox 
        placeholder="Enter token amount ..." 
        handleChange = {handleInputTokenAmount} 
        value={tokenAmount}
        style = {{width:"90%"}}
        optButton = {
          <button 
            onClick={() => {
              const amount = stakingMode === 'Stake' 
                ? balance
                : totalStaked
              setTokenAmount(amount)
            }}
            style={{backgroundColor:"#3bc917"}}
          >
            Max
          </button>
        }
      />
      <div className="al-v center" style={{width:"100%"}}>
      {
        userStat?.approved !== true &&
        <StakeButton onClick = {() => handleApprove(stakingMode)}>
          Approve
        </StakeButton>
      }
        <StakeButton 
          onClick = {() => handleStaking(stakingMode)}
          disabled = {!userStat.approved}
        >
          {stakingMode}
        </StakeButton>
      </div>
    </div>
  )
}

function NFTCard({nft}) {
  const [myNft, setMyNft] = useState(nft)
  
  function handleNftClick() {
    if (myNft.checked === undefined)
      setMyNft({...myNft, checked: true})
    else
      setMyNft({...myNft, checked: !myNft.checked})
  }

  return(
    <div 
      className="nft-card"
      onClick={() => handleNftClick()}
    >
      <img src={myNft.uri} alt="" />
      <div style={{paddingLeft:"5px", color:"white"}}>
        {myNft.id}: {myNft.description}
      </div>
      {
        myNft && myNft.checked && myNft.checked === true &&
        <DivCoverMask style={{
          borderRadius: "10px",
          background: "center / contain no-repeat url('./images/checkmark.svg') #1b391be6"
        }} /> 
      }
    </div>
  )
}

function NFTPanel({nfts}) {
  return(
  <div className="meta-card g-vertical">
   <div className="extrude-y">Your NFTs</div> 
   <div className="nft-panel">
    {
      nfts.map((nft, i) => 
        <NFTCard nft={nft} key={`nft-${i}`} />
      )
    }
    </div>
  </div>)
}

export default function StakingPage() {
  const healInfo = useSelector((state) => state.heal)
  const wallet = useWallet()

  return(<div style={{position:"relative"}}> 
    { 
    wallet.isConnected() !== true 
    ? <h1 style={{textAlign:"center"}}>Wallet not connected.</h1>
    : <div className='main-container staking-page' style={{justifyContent:"center"}}>
      <StakerPanel 
        balance= {healInfo.userStat.tokenBalance}
        totalStaked= {healInfo.userStat.totalStaked}
      />
      {/* <NFTPanel 
        nfts={healInfo.nftStat.userHolds}
      /> */}
    </div>
    }
  </div>)
}