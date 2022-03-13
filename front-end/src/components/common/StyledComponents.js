import styled from "styled-components";

export const DivVCenter = styled.div`
  display         : flex;
  flex-direction  : coloumn;
  align-items     : center;
`
export const DivHCenter = styled.div`
  display         : flex;
  flex-direction  : row;
  align-items     : center;
`
export const DivCoverMask = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%; 
  backgroundColor: black;
  opacity: 0.5;
  &:hover {
    opacity: 0.3;
  }
`
