import './spinner.css'
import styled from "styled-components"

const LoadingContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #00000063;
  z-index: 9999;
`
export default function LoadingSpinner() {
  return(
    <LoadingContainer>
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </LoadingContainer>
  )
}