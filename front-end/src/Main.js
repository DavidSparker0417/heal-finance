import './css/transition.css'
import StakingPage from "./components/StakingPage";
import Statistics from "./components/Statistics";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { TransitionGroup } from "react-transition-group";

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
        <Route path='/DAO' 
          element={<StakingPage />} 
        />
      </Routes>
    </CSSTransition>
  </TransitionGroup>
  )
}