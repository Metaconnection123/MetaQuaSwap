import styled from 'styled-components';
export const SwapPageBody = styled.div`
    background: linear-gradient(175deg,#1363DF,#DFF6FF);
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

export const Card = styled.div`
    height: 600px;
    width: 450px;
    background: #06283D;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transition: all .2s ease-in-out;
`

export const Tab = styled.div`
    height: 10%;
    width: 100%;
    border-radius: 20px 20px 0 0 ;
    font-weight: 600;
    display: flex;
`
export const TabBtn = styled.span`
    background: ${({ isOpened }) => (isOpened ? '#06283D' : '#07588A')};
    height: 100%;
    flex:1;
    text-align: center;
    color: ${({ isOpened }) => isOpened ? '#fff' : '#000'};
    padding-top: 16px;
    box-sizing: border-box;
    border-bottom: ${({ isOpened }) => isOpened ? 'none' : ' 2px solid #07588A'};
    border-radius: ${({ tabName }) => tabName === 'Tab1' ? '10px 0 0 0' : '0 10px 0 0'};
`


export const AccountText = styled.div`
    color: #47B5FF;
    font-weight: 600;
    margin-left: 10px;
    margin-top: 20px;
`


export const AccountLayout = styled.div`
    height: 5%;
    border-radius: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 10px;
`

export const Account = styled.div`
    color: #DFF6FF;
`

export const MyAssetsText = styled.div`
    color: #47B5FF;
    font-weight: 600;
    margin-left: 10px;
    margin-top: 10px;

`

export const MyAssetsLayout = styled.div`
    height: 10%;
    border-radius: 10px;
    box-sizing: border-box;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    position: relative;
`

export const EtherAmountLayout = styled.div`
    flex: 2;
    justify-content: center;
    align-items: center;
    position: relative;
`

export const TokenAmountLayout = styled.div`
    flex: 2;
    justify-content: center;
    align-items: center;
    position: relative;
`


export const AmountCategoryText = styled.div`
    color: #DFF6FF;
    border-bottom: 2px solid #495666;
    font-weight: 500;
    margin-left: 5px;
    margin-bottom: 5px;
`


export const AmountText = styled.div`
    color: #fff;
    position: absolute;
    right: 5px;
`


export const SwapRateText = styled.div`
    color: #47B5FF;
    font-weight: 600;
    margin-top: 5px;
    margin-left: 10px;
`
export const SwapRateLayout = styled.div`
    height: 6%;
    border-radius: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    margin-left: 10px;
    margin-right: 10px;
    color: #fff;
`


export const InputText = styled.div`
    color: #47B5FF;
    margin-left: 10px;
    font-weight: 600;
    margin-top: 5px;
`
export const InputAmountLayout = styled.div`
    height: 17%;
    border-radius: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
    position: relative;
    
`
export const InputAmount = styled.div`
    border-bottom: 1px solid #495666;
    height: 40px;
    width: 300px;
    font-size: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    margin-top: 5px;
`
export const ClearBtn = styled.button`
    height: 44px;
    width: 100px;
    font-size: 20px;
    position: absolute;
    right: 6px;
    top: 0px;
    border: none;
    color: #fff;

    outline: none;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
    background-color: ${({ disabled }) => disabled ? 'gray' : '#3573DD'};
    color: #ecf0f1;
    transition: background-color .3s;
    &:hover {
        background-color: #395991;
    }
    &:focus {
        background-color: #395991;
    }
`

export const AmountBtnLayout = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
`

export const UpAmountBtn = styled.button`
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

export const DownAmountBtn = styled.button`
    height: 40px;
    width: 50px;
    border: none;
    color:#fff;
    background-color: #e85159;
    border-radius: 5px;

    outline: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
    color: #ecf0f1;
    transition: background-color .3s;
    &:hover {
        background-color: #a8383e;
    }
    &:focus {
        background-color: #a8383e;
    }
 
`

export const OutputText = styled.div`
    color: #47B5FF;
    margin-left: 10px;
    font-weight: 600;
    margin-top: 20px;
`
export const OutputAmountLayout = styled.div`
    height: 10%;
    border-radius: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
`

export const OutputAmount = styled.div`
    border-bottom: 1px solid #495666;
    height: 40px;
    width: 300px;
    font-size: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    margin-top: 5px;
`
export const SwapBtn = styled.button`
    height: 44px;
    width: 100px;
    font-size: 20px;
    position: absolute;
    right: 6px;
    top: 4px;
    border-radius: 10px;
    border: none;
    color: #fff;


    outline: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
    background-color: ${({ disabled }) => disabled ? 'gray' : '#3573DD'};
    transition: background-color .3s;
    &:hover {
        background-color: #395991;
    }
    &:focus {
        background-color: #395991;
    }
`

export const MetaMaskGuideLayout = styled.div`
    border: 1px solid #000;
    height: 50px;
    width: 450px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
    text-decoration: underline;
    font-weight: bold;

`


