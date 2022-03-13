import ButtonGroup from "../components/common/ButtonGroup";
import TextBox from "../components/common/TextBox";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DivCoverMask } from "components/common/StyledComponents";

const stakeGroupData = [
  'Stake',
  'Unstake'
]

function StakerPanel({balance, totalStaked}) {
  const [tokenAmount, setTokenAmount] = useState()
  const [stakingMode, setStakingMode] = useState()
  
  function handleInputTokenAmount({target}) {
    console.log(target.value)
    setTokenAmount(target.value)
  }

  useEffect(() => {
    setTokenAmount(0)
  }, [stakingMode])

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
      <div className="al-h center" style={{width:"100%"}}>
        <button style={{width:"50%", fontSize:"20px", fontWeight:"bold"}}>
          {stakingMode}
        </button>
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
  return(<div style={{position:"relative"}}> 
    <div className='main-container staking-page'>
      <StakerPanel 
        balance= {healInfo.userStat.tokenBalance}
        totalStaked= {healInfo.userStat.totalStaked}
      />
      <NFTPanel 
        nfts={healInfo.nftStat.userHolds}
      />
    </div>
  </div>)
}