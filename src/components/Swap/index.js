import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MetaMaskInstall from '../Modal/MetaMaskInstall';
import InsufficientCash from '../Modal/InsufficientCash';
import CheckAmount from '../Modal/CheckAmount';
import Loading from '../Loading/Loading';

import {
    SwapPageBody,
    Tab,
    InputAmountLayout,
    InputAmount,
    OutputAmountLayout,
    OutputAmount,
    MyAssetsLayout,
    Card,
    TabBtn,
    SwapBtn,
    AccountLayout,
    AccountText,
    Account,
    EtherAmountLayout,
    TokenAmountLayout,
    MyAssetsText,
    AmountText,
    AmountCategoryText,
    InputText,
    OutputText,
    UpAmountBtn,
    DownAmountBtn,
    SwapRateText,
    SwapRateLayout,
    AmountBtnLayout,
    ClearBtn,
} from './SwapElements';


const SwapPage = () => {
    const [web3, setWeb3] = useState();
    const [account, setAccount] = useState('');
    const [chainId, setChainId] = useState('');

    const [tokenAmount, setTokenAmount] = useState();
    const [etherAmount, setEtherAmount] = useState();
    const [contractAddress, setContractAddress] = useState();
    const [contractAbi, setContractAbi] = useState();

    const [isOpenedTab1, setOpenedTab1] = useState(true);
    const [isOpenedTab2, setOpenedTab2] = useState(false);

    const [inputAmount, setInputAmount] = useState(0);
    const [outputAmount, setOutputAmount] = useState(0);

    const [swapUnit, setSwapUnit] = useState(0);
    const [swapBtnDisabled, setSwapBtnDisabled] = useState(true);
    const [metaMaskDisabled, setMetaMaskDisabled] = useState(true);

    const [isLackBalance, setIsLackBalance] = useState(false);
    const [isSwapAmtChkModal, setSwapAmtChkModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (window.ethereum) {
            setMetaMaskDisabled(false);
            connectAccount();
            initWeb3();
            setContractAddress('0xf9cd19Aa836Bd416b3BFB2fd6874c00380E20885');
            const contractabi = require('../../abi/TestToken11.json')
            setContractAbi(contractabi)

            window.ethereum.on('accountsChanged', () => {
                setAccount(window.ethereum.selectedAddress)
            })
        } else {
            setMetaMaskDisabled(true);
        }

        return () => {
        }
    }, [])

    useEffect(() => {
        if (account) {
            getAmount(account)
            getThousandWorthOfEther();
        }
    }, [account, etherAmount, tokenAmount])

    const connectAccount = async () => {
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        setAccount(accounts[0]);
    }

    const initWeb3 = () => {
        const webThree = new Web3(window.ethereum);
        setWeb3(webThree);
    }

    const changeAmount = (e) => {
        setInputAmount(Number(e.target.value));
    }

    useEffect(() => {
        if (isOpenedTab1 && inputAmount) {
            let inputAmountToWei = Number(web3.utils.toWei(inputAmount.toString()));
            let swapUnitToWei = Number(web3.utils.toWei(swapUnit.toString())); //toString()을 사용한다고 해서 string으로 타입이 변하진 않음
            if (inputAmountToWei % swapUnitToWei === 0) {
                let outputAmount = inputAmountToWei / swapUnitToWei;
                setOutputAmount(outputAmount);
                setSwapBtnDisabled(false);
            } else {
                setSwapBtnDisabled(true);
            }

        } else if (isOpenedTab2 && inputAmount) {
            let amount = Number(inputAmount) * Number(swapUnit.toString());
            setOutputAmount(amount.toFixed(4));
            setSwapBtnDisabled(false);
        }
    }, [inputAmount])


    const getThousandWorthOfEther = async () => {
        const contract = await new web3.eth.Contract(contractAbi, contractAddress);
        let balance = await contract.methods.getThousandWorthOfEther().call();
        let unit = web3.utils.fromWei(balance.toString())
        setSwapUnit(Number(unit));
    }


    const getAmount = async (address) => {
        if (!address) {
            return;
        }
        const contract = await new web3.eth.Contract(contractAbi, contractAddress);
        let token = await contract.methods.balanceOf(address).call();
        let result = web3.utils.fromWei(token.toString())
        setTokenAmount(result);

        let ether = web3.utils.fromWei(await web3.eth.getBalance(address));
        setEtherAmount(ether);
    }


    const assetValidation = () => {
        if (isOpenedTab1) {
            if (Number(etherAmount) < inputAmount) {
                setIsLackBalance(true);
                return;
            }
        } else {
            if (Number(tokenAmount) < inputAmount) {
                setIsLackBalance(true);
                return;
            }
        }
        setSwapAmtChkModal(true);

    }

    const convertEther = async (tokenAmount) => {
        const contract = await new web3.eth.Contract(contractAbi, contractAddress);

        let blockNumber = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(blockNumber);
        let maxFeePerGas = (block.baseFeePerGas * 2) + 2500000000;
        let maxFeePerGasHex = web3.utils.toHex(maxFeePerGas.toString());

        let amount = web3.utils.toHex(web3.utils.toWei(tokenAmount.toString()));
        var data = contract.methods.convertEther(amount).encodeABI();

        let estimateGas = await web3.eth.estimateGas({
            'from': account,
            'to': contractAddress,
            'data': data,
        })

        const trxParameters = {
            'from': account,
            'to': contractAddress,
            'gas': String(estimateGas),
            'maxFeePerGas': maxFeePerGasHex,
            'maxPriorityFeePerGas': "0x77359400", //Miner Tip 2Gwei
            'data': data,
        };

        let txHash = null;

        try {
            txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [trxParameters]
            })

            var whenTransactionMined = function (tx, callback) {
                var check = setInterval(() => {
                    web3.eth.getTransactionReceipt(tx, (e, receipt) => {
                        console.log("Transaction Pending...")
                        if (receipt) {
                            clearInterval(check);
                            callback(receipt);
                        }
                    })
                }, 2000);
            };
            setIsLoading(true);
            whenTransactionMined(txHash, (receipt) => {
                if (receipt.status) {
                    console.log("receipt : ", receipt);
                    setEtherAmount(0);
                    setTokenAmount(0);
                    inputAmountClear();
                    setIsLoading(false);
                } else {

                }

            });
        } catch (error) {
            console.log(error);
        }
    }

    const convertToken = async (etherAmount) => {
        const contract = await new web3.eth.Contract(contractAbi, contractAddress);

        let blockNumber = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(blockNumber);
        let maxFeePerGas = (block.baseFeePerGas * 2) + 2500000000;
        let maxFeePerGasHex = web3.utils.toHex(maxFeePerGas.toString());

        var data = contract.methods.convertToken().encodeABI();
        let amount = web3.utils.toHex(web3.utils.toWei(etherAmount.toString()));
        let estimateGas = await web3.eth.estimateGas({
            'from': account,
            'to': contractAddress,
            'data': data,
            'value': amount
        })

        const trxParameters = {
            'from': account,
            'to': contractAddress,
            'gas': String(estimateGas),
            'maxFeePerGas': maxFeePerGasHex,
            'maxPriorityFeePerGas': "0x77359400", //Miner Tip 2Gwei
            'data': data,
            'value': amount
        };

        let txHash = null;

        try {
            txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [trxParameters]
            })

            var whenTransactionMined = function (tx, callback) {
                var check = setInterval(() => {
                    web3.eth.getTransactionReceipt(tx, (e, receipt) => {
                        console.log("Transaction Pending...")
                        if (receipt) {
                            clearInterval(check);
                            callback(receipt);
                        }
                    })
                }, 2000);
            };

            setIsLoading(true);
            whenTransactionMined(txHash, (receipt) => {
                if (receipt.status) {
                    console.log("receipt : ", receipt);
                    setEtherAmount(0);
                    setTokenAmount(0);
                    inputAmountClear();
                    setIsLoading(false);
                } else {

                }

            });
        } catch (error) {
            console.log(error);
        }
    }

    const upBtnClick = (number) => {
        let amount = 0;
        if (isOpenedTab1) {
            amount = Number(inputAmount) + (Number(swapUnit) * number);
            setInputAmount(Number(amount.toFixed(4)));
        } else {
            amount = inputAmount + number;
            setInputAmount(amount);
        }
    }

    const downBtnClick = (number) => {
        let amount = 0;
        if (isOpenedTab1) {
            amount = Number(inputAmount) - (Number(swapUnit) * number);
        } else {
            amount = inputAmount - number;
        }

        if (amount <= 0) {
            amount = 0;
            setInputAmount(amount);
            setOutputAmount(0);
            setSwapBtnDisabled(true);
        } else {
            if (isOpenedTab1) {
                setInputAmount(Number(amount.toFixed(4)));
            } else {
                setInputAmount(amount);
            }
        }
    }

    const tabClick = (tabNum) => {
        if (tabNum === 1) {
            setOpenedTab1(true);
            setOpenedTab2(false);
        } else {
            setOpenedTab1(false);
            setOpenedTab2(true);
        }
        setInputAmount(0);
        setOutputAmount(0);
        setSwapBtnDisabled(true);
    }
    const inputAmountClear = () => {
        setInputAmount(0);
        setOutputAmount(0);
        setSwapBtnDisabled(true);
    }

    const confirmLackBalance = () => {
        setIsLackBalance(false);
    }

    const convertAmount = () => {
        if (isOpenedTab1) {
            convertToken(inputAmount);
        } else {
            convertEther(inputAmount);
        }
        setSwapAmtChkModal(false);
    }

    const swapNoClick = () => {
        setSwapAmtChkModal(false);
    }
    return (
        <SwapPageBody>
            {isLoading && <Loading></Loading>}
            {<MetaMaskInstall visible={metaMaskDisabled}>MetaMask Not Install.</MetaMaskInstall>}
            {isLackBalance && <InsufficientCash func={confirmLackBalance} asset={isOpenedTab1 ? 'ETH' : 'BWE'}></InsufficientCash>}
            {isSwapAmtChkModal && <CheckAmount
                inputAmount={inputAmount}
                asset={isOpenedTab1 ? 'ETH' : 'BWE'}
                func1={convertAmount}
                func2={swapNoClick}></CheckAmount>}
            <Card>
                <Tab>
                    <TabBtn
                        onClick={() => tabClick(1)}
                        isOpened={isOpenedTab1}
                        tabName='Tab1'>
                        ETH &#x25B6; BWE
                    </TabBtn>
                    <TabBtn
                        onClick={() => tabClick(2)}
                        isOpened={isOpenedTab2}
                        tabName='Tab2'>
                        BWE &#x25B6; ETH
                    </TabBtn>
                </Tab>
                <AccountText>Account</AccountText>
                <AccountLayout>
                    <Account>{account}</Account>
                </AccountLayout>
                <MyAssetsText>My Assets</MyAssetsText>
                <MyAssetsLayout>
                    <EtherAmountLayout>
                        <AmountCategoryText>Ethereum</AmountCategoryText>
                        <AmountText>{etherAmount} ETH</AmountText>
                    </EtherAmountLayout>
                    <TokenAmountLayout>
                        <AmountCategoryText>ERC-20</AmountCategoryText>
                        <AmountText>{tokenAmount} BWE</AmountText>
                    </TokenAmountLayout>
                </MyAssetsLayout>
                <SwapRateText>Swap Rate</SwapRateText>
                <SwapRateLayout>
                    1 BWE == {swapUnit} ETH
                </SwapRateLayout>
                <InputText>Input ({isOpenedTab1 ? "ETH" : "BWE"})</InputText>
                <InputAmountLayout>
                    <InputAmount onChange={changeAmount}>{inputAmount}</InputAmount>
                    <ClearBtn onClick={inputAmountClear}>Clear</ClearBtn>
                    <AmountBtnLayout>
                        <UpAmountBtn onClick={() => upBtnClick(1)}>+1</UpAmountBtn>
                        <UpAmountBtn onClick={() => upBtnClick(10)}>+10</UpAmountBtn>
                        <UpAmountBtn onClick={() => upBtnClick(100)}>+100</UpAmountBtn>
                        <DownAmountBtn onClick={() => downBtnClick(1)}>-1</DownAmountBtn>
                        <DownAmountBtn onClick={() => downBtnClick(10)}>-10</DownAmountBtn>
                        <DownAmountBtn onClick={() => downBtnClick(100)}>-100</DownAmountBtn>
                    </AmountBtnLayout>
                </InputAmountLayout>


                <OutputText>Output ({isOpenedTab1 ? "BWE" : "ETH"})</OutputText>
                <OutputAmountLayout>
                    <OutputAmount>{outputAmount}</OutputAmount>
                    <SwapBtn disabled={swapBtnDisabled} onClick={assetValidation}>Swap</SwapBtn>
                </OutputAmountLayout>


            </Card>
        </SwapPageBody>
    )
}

export default SwapPage