import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MetaMaskInstall from '../Modal/MetaMaskInstall';
import InsufficientCash from '../Modal/InsufficientCash';
import CheckAmount from '../Modal/CheckAmount';
import Loading from '../Loading/Loading';
import axios from 'axios';
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { isMobile } from 'react-device-detect';
import WalletConnectProvider from "@walletconnect/web3-provider";
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
    const [contract, setContract] = useState();
    const [contractAddress, setContractAddress] = useState();
    const [contractAbi, setContractAbi] = useState();

    const [isOpenedTab1, setOpenedTab1] = useState(true);
    const [isOpenedTab2, setOpenedTab2] = useState(false);

    const [calcInputEther, setCalcInputEther] = useState(0);
    const [calcInputToken, setCalcInputToken] = useState(0);

    const [viewInputToken, setViewInputToken] = useState(0);
    const [viewOutputEther, setViewOutputEther] = useState(0);

    const [viewInputEther, setViewInputEther] = useState(0);
    const [viewOutputToken, setViewOutputToken] = useState(0);

    const [viewSwapUnit, setViewSwapUnit] = useState(0);
    const [calcSwapUnitWei, setCalcSwapUnitWei] = useState(0);

    const [swapBtnDisabled, setSwapBtnDisabled] = useState(true);
    const [metaMaskDisabled, setMetaMaskDisabled] = useState(false);

    const [isLackBalance, setIsLackBalance] = useState(false);
    const [isSwapAmtChkModal, setSwapAmtChkModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [connector, setConnector] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [provider, setProvider] = useState();



    useEffect(() => {
        setContractAddress('0xAFf00Ebc8c08B88C8e025331Bd8af281995D5308');
        const abi = require('../../abi/TestToken13.json')
        setContractAbi(abi);
        initWeb3();

        if (isMobile) {
            setConnector(new WalletConnect({ bridge: "https://bridge.walletconnect.org" }));
            
        } else {
            if (window.ethereum) {
                setMetaMaskDisabled(false);
                covertGoerli();
                connectAccount();

                window.ethereum.on('accountsChanged', () => {
                    setAccount(window.ethereum.selectedAddress)
                })
            } else {
                setMetaMaskDisabled(true);
            }
        }
        return () => {
        }
    }, [])

    useEffect(() => {
        if (web3) {
            console.log("web3 : ", web3);
            initContract(contractAbi, contractAddress);
        }
    }, [web3])

    useEffect(() => {
        if (provider) {
            // Subscribe to accounts change
            provider.on("accountsChanged", (accounts) => {
                console.log("accountChanged : provider : ", accounts);
            });

            // Subscribe to chainId change
            provider.on("chainChanged", (chainId) => {
                console.log("accountChanged : chainChanged : ", chainId);
            });

            // Subscribe to session disconnection
            provider.on("disconnect", (code, reason) => {
                console.log("accountChanged : disconnect : ", code, reason);
            });
        }
    }, [provider])


    useEffect(() => {
        if (connector && isMobile) {
            console.log(connector);
            if (!connector.connected) {
                console.log("!connector.connected");
                connector.createSession().then(() => {
                    console.log("connector.createSession");
                    const uri = connector.uri;
                    WalletConnectQRCodeModal.open(uri, () => {
                        console.log("QR Code Modal closed");
                    });
                });
            } else {
                console.log(connector._accounts[0]);
                setAccount(connector._accounts[0]);
            }


            connector.on("connect", (error, payload) => {
                console.log("connector.on connect");
                if (error) {
                    console.log(error);
                    throw error;
                }

                WalletConnectQRCodeModal.close();

                // Get provided accounts and chainId
                const { accounts, chainId } = payload.params[0];
                console.log("accounts : ", accounts);
                console.log("chainId : ", chainId);
            });

            connector.on("session_update", (error, payload) => {
                console.log("connector.on session_update");
                if (error) {
                    console.log(error);
                    throw error;
                }

              
                const { accounts, chainId } = payload.params[0];
                console.log("accounts : ", accounts);
                console.log("chainId : ", chainId);
            });

            connector.on("disconnect", (error, payload) => {
                console.log("connector.on disconnect");
                if (error) {
                    console.log(error)
                    throw error;
                }
            });
        }
    }, [connector])

    useEffect(() => {
        if (account) {
            // setAmount(account)
            setBweTokenAmount(account);
            setEthereumAmount(account);

            setSwapPrice();
            inputAmountClear();
            setSwapBtnDisabled(true);
        }
    }, [account])


    useEffect(() => {
        if (isSuccess) {
            setBweTokenAmount(account);
            setEthereumAmount(account);

            setSwapPrice();
            inputAmountClear();
            setSwapBtnDisabled(true);
            setIsSuccess(false);
        }
    }, [isSuccess])

    const connectAccount = async () => {
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        setAccount(accounts[0]);
    }

    const initWeb3 = () => {
        if (isMobile) {
            const tmpProvider = new WalletConnectProvider({ infuraId: "62af827323cb4244953cb85b4419971f" });
            setProvider(tmpProvider);
            console.log("initWeb3 isMobile : provider : ", tmpProvider);
            const webThree = new Web3(tmpProvider);
            setWeb3(webThree);
        } else {
            const webThree = new Web3(window.ethereum);
            setWeb3(webThree);
        }
    }


    useEffect(() => {
        if (isOpenedTab1 && calcInputEther) {
            if (web3) {
                if (Number(calcInputEther) % Number(calcSwapUnitWei) === 0) {
                    let outputAmount = Number(calcInputEther) / Number(calcSwapUnitWei);
                    setViewOutputToken(outputAmount)
                    setViewInputEther(web3.utils.fromWei(calcInputEther.toString()));
                    setSwapBtnDisabled(false);
                }
            }
        }

        if (calcInputEther === 0) {
            setViewInputEther(0);
            setViewOutputToken(0);
            setSwapBtnDisabled(true);
        }

    }, [calcInputEther])


    useEffect(() => {
        if (isOpenedTab2 && calcInputToken) {
            if (web3) {
                let amount = Number(calcInputToken) * Number(calcSwapUnitWei);
                setViewInputToken(calcInputToken)
                setViewOutputEther(web3.utils.fromWei(amount.toString()))
                setSwapBtnDisabled(false);
            }
        }

        if (calcInputToken === 0) {
            setViewInputToken(0);
            setViewOutputEther(0);
            setSwapBtnDisabled(true);
        }
    }, [calcInputToken])


    useEffect(() => {
        if (account) {
            // setAmount(account)
            setSwapPrice();
        }
    }, [chainId])


    const covertGoerli = async () => {
        try {
            const cid = await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x5" }],
            });
            setChainId(parseInt(cid, 16).toString());
        } catch (error) {
            console.log(error);
        }
    }

    // const convertMumbai = async () => {
    //     try {
    //         await window.ethereum.request({
    //             method: "wallet_switchEthereumChain",
    //             params: [{ chainId: "0x13881" }],
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const setSwapPrice = async () => {
        const contract = await new web3.eth.Contract(contractAbi, contractAddress);
        let calcSwapUnitWei = await contract.methods.getSwapPrice().call();
        setCalcSwapUnitWei(calcSwapUnitWei);
        let swapUnit = web3.utils.fromWei(calcSwapUnitWei.toString())
        setViewSwapUnit(swapUnit);
    }


    const initContract = async (contractAbi, contractAddress) => {
        console.log("contractAbi : ", contractAbi);
        console.log("contractAddress : ", contractAddress);
        const tmpContract = await new web3.eth.Contract(contractAbi, contractAddress);
        console.log("tmpContract : ", tmpContract)
        setContract(tmpContract);
    }

    const setBweTokenAmount = async (address) => {
        console.log("setBweTokenAmount : address : ", address)
        if (!address) {
            return;
        }
        console.log("setBweTokenAmount : contract : ", contract)
        let tokenWei = await contract.methods.balanceOf(address).call();
        console.log("setBweTokenAmount : tokenWei : ", tokenWei)
        let token = web3.utils.fromWei(tokenWei.toString());
        console.log("setBweTokenAmount : token : ", token)
        setTokenAmount(token);
    }

    const setEthereumAmount = async (address) => {
        console.log("setEthereumAmount : address : ", address)
        console.log("setEthereumAmount : web3 : ", web3)
        let etherWei = await web3.eth.getBalance(address)
        console.log("setEthereumAmount : etherWei : ", etherWei)
        let ether = web3.utils.fromWei(etherWei);
        console.log("setEthereumAmount : ether : ", ether)
        setEtherAmount(ether);
    }

    const assetValidation = () => {
        if (isOpenedTab1) {
            if (Number(etherAmount) < Number(viewInputEther)) {
                setIsLackBalance(true);
                return;
            }
        } else {
            if (Number(tokenAmount) < Number(viewInputToken)) {
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
                    // axios.post('http://localhost:8080/api/goods/addSwapLog', {
                    //     sendAddress :account,
                    //     receiveAddress :contractAddress,
                    //     sendGoods:'BToken',
                    //     sendAmount: viewInputToken,
                    //     receiveGoods:'Ethereum',
                    //     receiveAmount: viewOutputEther,
                    //     eventPoint: 1,
                    // }, {
                    //     headers: {
                    //         'Content-type': 'application/json',
                    //         'Accept': 'application/json'
                    //         }
                    //     }
                    // )
                    // .then((response)=>{console.log(response.data);})
                    // .catch((response)=>{console.log('Error!')});


                    setEtherAmount(0);
                    setTokenAmount(0);
                    inputAmountClear();
                    setIsLoading(false);
                    setIsSuccess(true);
                } else {

                }

            });
        } catch (error) {
            console.log(error);
        }
    }

    const convertTokenWithMobile = async (etherAmount) => {
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

        try {
            // Send transaction
            connector.sendTransaction(trxParameters)
                .then((result) => {
                    // Returns transaction id (hash)
                    console.log(result);
                })
                .catch((error) => {
                    // Error returned when rejected
                    console.error(error);
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
                    // axios.post('http://localhost:8080/api/goods/addSwapLog', {
                    //     sendAddress :account,
                    //     receiveAddress :contractAddress,
                    //     sendGoods:'Ethereum',
                    //     sendAmount: viewInputEther,
                    //     receiveGoods:'BToken',
                    //     receiveAmount: viewOutputToken,
                    //     eventPoint: 1,
                    // }, {
                    //     headers: {
                    //         'Content-type': 'application/json',
                    //         'Accept': 'application/json'
                    //         }
                    //     }
                    // )
                    // .then((response)=>{console.log(response.data);})
                    // .catch((response)=>{console.log('Error!')});

                    setEtherAmount(0);
                    setTokenAmount(0);
                    inputAmountClear();
                    setIsLoading(false);
                    setIsSuccess(true);
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
            amount = Number(calcInputEther) + (Number(calcSwapUnitWei) * number);
            setCalcInputEther(amount.toString());
        } else {
            amount = Number(calcInputToken) + number;
            setCalcInputToken(amount.toString());
        }
    }

    const downBtnClick = (number) => {
        let amount = 0;
        if (isOpenedTab1) {
            amount = Number(calcInputEther) - (Number(calcSwapUnitWei) * number);
            if (amount <= 0) {
                amount = 0;
            }
            setCalcInputEther(amount);
        } else {
            amount = Number(calcInputToken) - number;
            if (amount <= 0) {
                amount = 0;
            }
            setCalcInputToken(amount);
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
        setCalcInputEther(0);
        setCalcInputToken(0);
        setViewInputEther(0);
        setViewInputToken(0);
        setSwapBtnDisabled(true);
    }
    const inputAmountClear = () => {
        setCalcInputEther(0);
        setCalcInputToken(0);
        setViewInputEther(0);
        setViewInputToken(0);
        setViewOutputEther(0);
        setViewOutputToken(0)
        setSwapBtnDisabled(true);
    }

    const confirmLackBalance = () => {
        setIsLackBalance(false);
    }

    const convertAmount = () => {
        if (isOpenedTab1) {
            if (isMobile) {
                convertTokenWithMobile(viewInputEther);
            } else {
                convertToken(viewInputEther);
            }

        } else {
            if (isMobile) {

            } else {
                convertEther(viewInputToken);
            }

        }
        setSwapAmtChkModal(false);
    }

    const swapNoClick = () => {
        setSwapAmtChkModal(false);
    }

    const sleep = (mil) => {
        new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, mil)
        })
    }
    return (
        <SwapPageBody>
            {isLoading && <Loading></Loading>}
            {<MetaMaskInstall visible={metaMaskDisabled}>MetaMask Not Install.</MetaMaskInstall>}
            {isLackBalance && <InsufficientCash func={confirmLackBalance} asset={isOpenedTab1 ? 'ETH' : 'BWE'}></InsufficientCash>}
            {isSwapAmtChkModal && <CheckAmount
                inputAmount={isOpenedTab1 ? viewInputEther : viewInputToken}
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
                        <AmountText>{Number(etherAmount).toFixed(8)} ETH</AmountText>
                    </EtherAmountLayout>
                    <TokenAmountLayout>
                        <AmountCategoryText>ERC-20</AmountCategoryText>
                        <AmountText>{Number(tokenAmount).toFixed(8)} BWE</AmountText>
                    </TokenAmountLayout>
                </MyAssetsLayout>
                <SwapRateText>Swap Rate</SwapRateText>
                <SwapRateLayout>
                    1 BWE == {viewSwapUnit} ETH
                </SwapRateLayout>
                <InputText>Input ({isOpenedTab1 ? "ETH" : "BWE"})</InputText>
                <InputAmountLayout>
                    {/* <InputAmount onChange={changeAmount}>{viewInputAmount}</InputAmount> */}
                    <InputAmount>{isOpenedTab1 ? viewInputEther : viewInputToken}</InputAmount>
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
                    <OutputAmount>{isOpenedTab1 ? viewOutputToken : viewOutputEther}</OutputAmount>
                    <SwapBtn disabled={swapBtnDisabled} onClick={assetValidation}>Swap</SwapBtn>
                </OutputAmountLayout>


            </Card>
        </SwapPageBody>
    )
}

export default SwapPage