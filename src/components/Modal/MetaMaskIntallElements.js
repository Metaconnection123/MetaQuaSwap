import styled from 'styled-components'


export const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
`


export const MetaMaskModalBox = styled.div`
    display: flex;
    display: ${(props) => (props.visible ? '' : 'none')};
    flex-direction: column;
    position: absolute;
    background-color: #fff;
    z-index: 20;
    border-radius: 5px;
    overflow: hidden;
    height: 200px;
`
export const MetaMaskModalTitleSpace = styled.div`
    background-color: #07588A;
    flex: 1;
    display : flex;
    justify-content : center;
	align-items : center;
    color: #fff;
    font-weight: 700;
    word-break: break-all;
`

export const MetaMaskModalContentSpace = styled.div`
    flex: 2;
    display : flex;
    justify-content : center;
	align-items : center;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
`
export const MetaMaskModalBtnSpace = styled.div`
    flex:1;
    justify-content: center;
    display : flex;
    justify-content : center;
	align-items : center;
`

export const MetaMaskModalConfirmBtn = styled.button`
    height: 40px;
    width: 50px;
    border: none;
    color:#fff;
    background-color: #3573DD;
    border-radius: 5px;

    outline: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
    color: #ecf0f1;
    transition: background-color .3s;
    &:hover {
        background-color: #395991;
    }
    &:focus {
        background-color: #395991;
    }
`



export const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`



export const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  width: 360px;
  max-width: 480px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 40px 20px;
`



