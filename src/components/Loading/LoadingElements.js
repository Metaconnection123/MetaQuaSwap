import styled, { keyframes } from 'styled-components'


export const LoadingOverlay = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
`


export const LoadingPosition = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
`

const animate = keyframes`
    0% 
    {
        transform: rotate(0deg);
    }

    100% 
    {
        transform: rotate(360deg);
    }
`

export const LoadingRing = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 0 4px 0 #07588A ;
    background: #1363DF;
    animation: ${animate} 1s linear infinite;
`
export const LoadingText = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    color: #FFF;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 150px;
    font-size: 2em;
    background: transparent;
    box-shadow: 0 0 5px rgba(0,0,0,.8);
    z-index: 100;
`
