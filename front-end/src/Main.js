import './css/transition.css'
import StakingPage from "./pages/StakingPage";
import Statistics from "./pages/ClaimPage";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { TransitionGroup } from "react-transition-group";
import DaoPage from 'pages/DaoPage';

export default function Main() {
  const location = useLocation()

  return(
    <TransitionGroup>
      <CSSTransition 
        timeout={500} 
        classNames='fade' 
        key={location.key}
      >
      <Routes location={location}>
        <Route path='/Claim' 
          element={
            <Statistics style={{marginBottom:"50px"}}/>
          }
        />
        <Route path='/Staking' 
          element={<StakingPage />} 
        />
        <Route path='/DAO' 
          element={<DaoPage />} 
        />
      </Routes>
    </CSSTransition>
  </TransitionGroup>
  )
}