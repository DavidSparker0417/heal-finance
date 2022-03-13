import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/nav.css'

const pages = [
  {
    name: "Claim",
    icon: "./images/nav-claim.svg"
  },
  {
    name: "Staking",
    icon: "./images/stake.svg"
  },
  {
    name: "DAO",
    icon: "./images/dao.svg"
  },
]

export default function MainNav() {
  const navigate = useNavigate()
  const [page, setPage] = useState("Claim")
  useEffect(() => {
    navigate(`/${page}`)
  }, [page])

  const NavItem = ({id, name, icon}) => (<>
    <input 
        className="slide-toggle"
        type="radio" 
        id={`slide-item-${id}`}
        value={name}
        checked={page === name}
        onChange={e => setPage(e.currentTarget.value)}
      />
      <label htmlFor={`slide-item-${id}`} style={{width:"60px"}}>
        <div className="icon">
          <img src={icon} alt="" width="30px" height="30px" style={{paddingTop:"10px"}}/>
        </div>
        <span>{name}</span>
      </label>
    </>
  )

  return(
    <nav className="slidemenu">
    {
      pages.map((p, id) => 
        <NavItem 
          key={`nav-${id}`} 
          id={id+1} 
          name={p.name} 
          icon={p.icon}
      />)
    }
    <div className="clear"></div>
    <div className="slider">
      <div className="bar"></div>
    </div>
  </nav>
  )
}