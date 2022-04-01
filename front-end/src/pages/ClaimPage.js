import { healClaim } from '../heal-contract'
import { useSelector } from 'react-redux'
import { useWallet } from 'use-wallet'
import '../css/button.css'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from 'App'
import { dsUtilNumberWithCommas } from 'ds-lib/ds-utils'

const TalbeColumn = ({title, value}) => {
  return (
    <div>
      <div style={{color:"#5409ad", fontSize:"18px", marginBottom:"10px"}}>{title}</div>
      <div style={{fontSize:"24px", fontWeight:"bold "}}>
        {value}
      </div>
    </div>
  )
}

export const InfoCard = ({icon, title, value}) => {
  return (
    <div className="meta-card">
      {
        icon &&
        <div className='extrude-x' style={{width:"90px"}}>
          <img src={icon} alt="" width="50px" height="50px"/>
        </div>
      }
      <div className='al-v' style={{width:"100%"}}>
        <div className="title">{title}</div>
        <div className="divider"></div>
        <div className="contents">{value}</div>
      </div>
    </div>
  )
}

const TableCard = ({title, contents}) => {
  return(
    <div className="meta-card g-vertical">
      <div className="extrude-y">
        {title}
      </div>
      <div style={{padding:"1rem"}}>
      {
        contents.map((c, i) => <div key={i}>
          <TalbeColumn title={c.title} value={c.value}/>
          {i !== contents.length-1 && <div className="divider"></div>}
        </div>)
      }
      </div>
    </div>
  )
}

export default function Statistics({style}) {
  const [waiting, setWaiting] = useState(false)
  const healInfo = useSelector((state) => state.heal)
  const wallet = useWallet()
  const {setLoading} = useContext(Context)
  
  async function handleClaim() {
    const provider = wallet._web3ReactContext.library
    setWaiting(true)
    setLoading(true)
    const transaction = healClaim(provider, wallet.account)
    await transaction
      .then(function(recipent) {
        toast.success("Successfuly claimed!")
        setWaiting(false)
        setLoading(false)
      })
      .catch(function(e) {
        toast.error(e.message)
        setWaiting(false)
        setLoading(false)
      })
  }

  return(<div style={{position:"relative"}}> 
  <div className='main-container al-v'>
    <div className="stat-top container">
      <InfoCard 
        icon='./images/balance.svg'
        title="Your HEAL Balance" 
        value={`${dsUtilNumberWithCommas(healInfo.userStat.tokenBalance)} HEAL`}
      />
      <InfoCard 
        icon='./images/unclaimed.svg'
        title="Unclaimed Rewards" 
        value={`${dsUtilNumberWithCommas(healInfo.userStat.unClaimedRewards)} ${healInfo.stakingStat.rewardTokenSymbol}`}
      />
      <InfoCard 
        icon='./images/treasury.svg'
        title="Treasury Balance" 
        value={`${dsUtilNumberWithCommas(healInfo.tokenStat.treasuryBalance)} $`}/>
      <InfoCard 
        icon='./images/claim.svg'
        title="Total Claimed" 
        value={`${dsUtilNumberWithCommas(healInfo.userStat.totalClaimed)} ${healInfo.stakingStat.rewardTokenSymbol}`}/>
    </div>
    <div className="stat-bottom container">
      {/* <TableCard 
        title = "BALANCE BREAKDOWN"
        contents = {[
          {
            title: "Unstaked Tokens",
            value: 7364
          },
          {
            title: "Staked Tokens",
            value: 876
          }
        ]}
      /> */}
      {/* <TableCard 
        title = "PERCENTAGE BREAKDOWN"
        contents = {[
          {
            title: "% Supply",
            value: "30.5%"
          },
          {
            title: "Staked Tokens",
            value: "7.63%"
          }
        ]}
      /> */}
      <TableCard 
        title = "MARKETING STATUS"
        contents = {[
          {
            title: "HEAL Price",
            value: `${healInfo.tokenStat.price} $`
          },
          {
            title: "Total Supply",
            value: `${dsUtilNumberWithCommas(healInfo.tokenStat.totalSupply)} $HEAL`
          }
        ]}
      />
      <TableCard 
        title = "STAKING REWARDS"
        contents = {[
          {
            title: "Your Share Point",
            value: `${healInfo.userStat.stakeSharePoint} %`
          },
          {
            title: "Rewards",
            value: 
              <div className="al-h" style={{width:"100%", justifyContent:"space-between"}}>
                <div>{`${dsUtilNumberWithCommas(healInfo.userStat.unClaimedRewards)} ${healInfo.stakingStat.rewardTokenSymbol}`}</div>
                {
                  healInfo.userStat.unClaimedRewards !== 0
                  && 
                  <button 
                    className="claim" 
                    onClick={handleClaim}
                    disabled={waiting}
                  >
                    claim
                  </button>
                }
              </div>
          }
        ]}
      />
    </div>
  </div>
  </div>)
}