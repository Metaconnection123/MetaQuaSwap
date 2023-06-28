import React, { useState, useEffect, useRef, forwardRef } from "react";
import Loading from "../Loading/Loading";
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
  MetaMaskGuideLayout,
  Web3ButtonLayout,
} from "./NewSwapElements";
import InsufficientCash from "../Modal/InsufficientCash";
import CheckAmount from "../Modal/CheckAmount";
import ContractAbi from "../../abi/TestToken17.json";
import SwapPriceReader from "./SwapPriceReader";
import { isAndroid, isIOS } from "react-device-detect";
import { Web3Button } from "@web3modal/react";
import {
  useAccount,
  useNetwork,
  useBalance,
  useSwitchNetwork,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import {
  encodeFunctionData,
  createPublicClient,
  http,
  toHex,
  parseEther,
  encodeAbiParameters,
} from "viem";
import { mainnet, goerli } from "viem/chains";
import PrePareSendTransction from "./PrePareSendTransaction";

const NewSwapPage = () => {
  const GOERLI_NETWORK_ID = 5;
  const MAINNET_NETWORK_ID = 1;

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const branchMode = process.env.REACT_APP_BRANCH_MODE;
  const sendTransactionRef = useRef(null);

  const [gas, setGas] = useState();
  const [maxFeePerGas, setMaxFeePerGas] = useState(0);

  const [inputBalance, setInputBalance] = useState(0);
  const [outputBalance, setOutputBalance] = useState(0);

  const [swapUnit, setSwapUnit] = useState();
  const [chainId, setChainId] = useState(-1);
  const [isMainNet, setIsMainNet] = useState(false); // 메인넷은 이더리움 메인넷을 말함
  const [isGoerli, setIsGoerli] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLackBalance, setIsLackBalance] = useState(false); //스왑에 필요한 자산을 보유하고 있는지 체크
  const [isSwapAmtChkModal, setSwapAmtChkModal] = useState(false); // 스왑 하기 직전 정말로 자산을 스왑할 건지 물어보기 위한 체크

  const [activeTabNum, setActiveTabNum] = useState(1);

  const [swapBtnDisabled, setSwapBtnDisabled] = useState(true);
  const [ethToBweAmount, setEthToBweAmount] = useState(0);
  const [bweToEthAmount, setBweToEthAmount] = useState(0);

  const { chain } = useNetwork(); //메타마스크에 설정되어 있는 네트워크
  const { switchNetwork } = useSwitchNetwork(); //메타마스크의 네트워크가 이더리움(개발에선 Goerli)이 아닐경우 해당 네트워크로 변경시키기 위한 훅
  const { isConnected, address } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  }); // 메타마스크와 연결되어 있는지, 연결되어 있다면 연결된 지갑주소가 address로 확인이 가능함

  // useEffect(() => {}, [address]);

  const publicClient = createPublicClient({
    chain: branchMode === "development" ? goerli : mainnet,
    transport: http(),
  });

  const { data: ethBalance } = useBalance({
    address: address,
    watch: true,
    formatUnits: "ether",
    chainId:
      branchMode === "development" ? GOERLI_NETWORK_ID : MAINNET_NETWORK_ID,
  });
  const { data: tokenBalance } = useBalance({
    address: address,
    token: contractAddress,
    watch: true,
    formatUnits: "ether",
    chainId:
      branchMode === "development" ? GOERLI_NETWORK_ID : MAINNET_NETWORK_ID,
  });

  useEffect(() => {
    if (chain) {
      setChainId(chain.id);
      if (branchMode === "development") {
        //테스트환경에서
        if (chain.id !== GOERLI_NETWORK_ID) {
          //메타마스크 네트워크가 Goeril가 아니라면
          if (switchNetwork) {
            switchNetwork(GOERLI_NETWORK_ID); //Goerli로 변경해라
          }
        } else {
          setIsGoerli(true);
        }
      } else {
        //프로덕션 환경에서 메타마스크 네트워크가 이더리움 메인넷이 아니라면
        if (chain.id !== MAINNET_NETWORK_ID) {
          if (switchNetwork) {
            switchNetwork(MAINNET_NETWORK_ID);
          }
        } else {
          setIsMainNet(true);
        }
      }
    }
  }, [chain, switchNetwork]);

  useEffect(() => {
    if (address) {
      inputAmountClear();
      setSwapBtnDisabled(true);
    }
  }, [address]);
  const confirmLackBalance = () => {
    setIsLackBalance(false);
  };

  const tabClick = (tabNum) => {
    if (tabNum !== activeTabNum) {
      setActiveTabNum(tabNum);
      setInputBalance(0);
      setOutputBalance(0);
      setSwapBtnDisabled(true);
    }
  };

  const inputAmountClear = () => {
    setBweToEthAmount(0);
    setEthToBweAmount(0);
    setInputBalance(0);
    setOutputBalance(0);
    setSwapBtnDisabled(true);
  };

  const swapNoClick = () => {
    setSwapAmtChkModal(false);
  };

  const inputAmountUpdateBtnClick = (number) => {
    console.log("inputAmountUpdateBtnClick() : number : ", number);
    if (number > 0) {
      if (activeTabNum === 1) {
        setEthToBweAmount((prev) => prev + number);
      } else {
        setBweToEthAmount((prev) => prev + number);
      }
    } else if (number < 0) {
      if (activeTabNum === 1) {
        setEthToBweAmount((prev) => Math.max(prev - Math.abs(number), 0));
      } else {
        setBweToEthAmount((prev) => Math.max(prev - Math.abs(number), 0));
      }
    }
  };

  useEffect(() => {
    if (inputBalance > 0 && outputBalance > 0) {
      setSwapBtnDisabled(false);
    } else {
      setSwapBtnDisabled(true);
    }
  }, [inputBalance]);
  useEffect(() => {
    if (swapUnit) {
      console.log(`swapUnit : ${swapUnit}`);
      console.log(`swapUnit typeof : ${typeof swapUnit}`);

      const decimalIndex = swapUnit.indexOf(".") + 1;
      const swapUnitPrecision = swapUnit.length - decimalIndex; // 소수점 이하 자릿수 정밀도

      // swapUnit을 정수로 변환 (예: 0.0000004 -> 4)
      const swapUnitInteger = Math.round(
        swapUnit * Math.pow(10, swapUnitPrecision)
      );

      if (activeTabNum === 1) {
        console.log(`ethToBweAmount : ${ethToBweAmount}`);
        console.log(`ethToBweAmount typeof : ${typeof ethToBweAmount}`);
        let calcBalance = swapUnitInteger * ethToBweAmount;
        calcBalance /= Math.pow(10, swapUnitPrecision);
        console.log({ calcBalance });
        setInputBalance(
          calcBalance !== 0
            ? parseFloat(calcBalance.toFixed(swapUnitPrecision))
            : 0
        ); // 4e-7과 같은 지수표기법이 아닌 일반적인 소수표기법을 위해 toFixed를 사용함
        setOutputBalance(ethToBweAmount);
        return;
      }

      if (activeTabNum === 2) {
        console.log(`bweToEthAmount : ${bweToEthAmount}`);
        console.log(`bweToEthAmount typeof : ${typeof bweToEthAmount}`);
        let calcBalance = swapUnitInteger * bweToEthAmount;
        calcBalance /= Math.pow(10, swapUnitPrecision);
        setInputBalance(bweToEthAmount);
        setOutputBalance(
          calcBalance !== 0
            ? parseFloat(calcBalance.toFixed(swapUnitPrecision))
            : 0
        );
        return;
      }
    }
  }, [ethToBweAmount, bweToEthAmount]);

  const assetValidation = async () => {
    if (activeTabNum === 1) {
      console.log(
        `assetValidation() : activeTabNum : ${activeTabNum} : inputBalance : ${inputBalance} : etherBalance : ${parseFloat(
          ethBalance.formatted
        )}`
      );
      if (inputBalance > parseFloat(ethBalance.formatted)) {
        setIsLackBalance(true);
      }
    } else {
      console.log(
        `assetValidation() : activeTabNum : ${activeTabNum} : inputBalance : ${inputBalance} : tokenBalance : ${parseFloat(
          tokenBalance.formatted
        )}`
      );
      if (inputBalance > Number(tokenBalance.formatted)) {
        setIsLackBalance(true);
      }
    }
    setSwapAmtChkModal(true);
    let maxFeePerGas = await getMaxFeePerGasHex();
    let gas = await getEstimateGas(inputBalance);
    setGas(gas);
    setMaxFeePerGas(maxFeePerGas);
  };

  //소수점 뒤의 0제거
  function removeTrailingZeros(numberString) {
    const trimmedString = numberString.replace(/\.?0+$/, "");
    return trimmedString;
  }

  const getEstimateGas = async (inputValue) => {
    let amount = toHex(parseEther(inputValue.toString()));
    console.log(`getEstimateGas() : amount : ${amount}`);
    const encodedData = encodeFunctionData({
      abi: ContractAbi,
      functionName: activeTabNum === 1 ? "convertToken" : "convertEther",
      args: activeTabNum === 1 ? [] : [amount],
    });
    let estimateGas = await publicClient.estimateGas({
      account: address,
      to: contractAddress,
      data: encodedData,
      value: activeTabNum === 1 ? amount : 0,
    });

    return estimateGas;
  };
  const getMaxFeePerGasHex = async () => {
    const block = await publicClient.getBlock(); //가장 최신 블록을 불러옴
    console.log("getMaxFeePerGasHex : block : ", block);
    let maxFeePerGas = block.baseFeePerGas * 2n + 2500000000n;
    let maxFeePerGasHex = toHex(maxFeePerGas);
    console.log(
      `getMaxFeePerGasHex() : maxFeePerGas : ${maxFeePerGas} : maxFeePerGasHex : ${maxFeePerGasHex}`
    );
    return maxFeePerGasHex;
  };
  const handleLoading = () => {
    setIsLoading(false);
  };
  return (
    <SwapPageBody>
      {isLoading && <Loading />}
      {isLackBalance && (
        <InsufficientCash
          func={confirmLackBalance}
          asset={activeTabNum === 1 ? "ETH" : "BWE"}
        />
      )}
      {isSwapAmtChkModal && (
        <CheckAmount
          // inputAmount={isOpenedTab1 ? viewInputEther : viewInputToken}
          inputAmount={inputBalance}
          asset={activeTabNum === 1 ? "ETH" : "BWE"}
          func1={() => {
            console.log(sendTransactionRef);
            sendTransactionRef.current.sendTransaction();
            setSwapAmtChkModal(false);
            setIsLoading(true);
          }}
          func2={swapNoClick}
        />
      )}

      {isConnected && chainId > 0 && (
        <SwapPriceReader
          contractAddress={contractAddress}
          contractAbi={ContractAbi}
          chainId={chainId}
          setSwapUnit={setSwapUnit}
        ></SwapPriceReader>
      )}
      {gas && maxFeePerGas && (
        <PrePareSendTransction
          activeTabNum={activeTabNum}
          inputBalance={inputBalance}
          contractAddress={contractAddress}
          ContractAbi={ContractAbi}
          maxFeePerGas={maxFeePerGas}
          gas={gas}
          chainId={chainId}
          ref={sendTransactionRef}
          setLoading={handleLoading}
        ></PrePareSendTransction>
      )}

      <Card>
        <Tab>
          <TabBtn
            onClick={() => tabClick(1)}
            // isOpened={isOpenedTab1}
            isOpened={activeTabNum === 1}
            tabName="Tab1"
          >
            ETH &#x25B6; BWE
          </TabBtn>
          <TabBtn
            onClick={() => tabClick(2)}
            // isOpened={isOpenedTab2}
            isOpened={activeTabNum === 2}
            tabName="Tab2"
          >
            BWE &#x25B6; ETH
          </TabBtn>
        </Tab>
        <AccountText>Account</AccountText>
        <AccountLayout>
          <Account>
            {address
              ? address
              : "Please confirm if you are connected to MetaMask."}
          </Account>
        </AccountLayout>
        <MyAssetsText>My Assets</MyAssetsText>

        <MyAssetsLayout>
          <EtherAmountLayout>
            <AmountCategoryText>Ethereum</AmountCategoryText>
            <AmountText>
              {ethBalance
                ? removeTrailingZeros(
                    parseFloat(ethBalance.formatted).toFixed(8)
                  )
                : "0"}{" "}
              ETH
            </AmountText>
          </EtherAmountLayout>
          <TokenAmountLayout>
            <AmountCategoryText>ERC-20</AmountCategoryText>
            <AmountText>
              {tokenBalance ? tokenBalance.formatted : "0"} BWE
            </AmountText>
          </TokenAmountLayout>
        </MyAssetsLayout>
        <SwapRateText>Swap Rate</SwapRateText>
        <SwapRateLayout>1 BWE == {swapUnit} ETH</SwapRateLayout>
        <InputText>Input ({activeTabNum === 1 ? "ETH" : "BWE"})</InputText>

        <InputAmountLayout>
          {/* <InputAmount onChange={changeAmount}>{viewInputAmount}</InputAmount> */}
          <InputAmount>
            {/* {isOpenedTab1 ? viewInputEther : viewInputToken} */}
            {inputBalance}
          </InputAmount>
          <ClearBtn onClick={inputAmountClear}>Clear</ClearBtn>
          <AmountBtnLayout>
            <UpAmountBtn onClick={() => inputAmountUpdateBtnClick(1)}>
              +1
            </UpAmountBtn>
            <UpAmountBtn onClick={() => inputAmountUpdateBtnClick(10)}>
              +10
            </UpAmountBtn>
            <UpAmountBtn onClick={() => inputAmountUpdateBtnClick(100)}>
              +100
            </UpAmountBtn>
            <DownAmountBtn onClick={() => inputAmountUpdateBtnClick(-1)}>
              -1
            </DownAmountBtn>
            <DownAmountBtn onClick={() => inputAmountUpdateBtnClick(-10)}>
              -10
            </DownAmountBtn>
            <DownAmountBtn onClick={() => inputAmountUpdateBtnClick(-100)}>
              -100
            </DownAmountBtn>
          </AmountBtnLayout>
        </InputAmountLayout>

        <OutputText>Output ({activeTabNum === 1 ? "BWE" : "ETH"})</OutputText>
        <OutputAmountLayout>
          <OutputAmount>
            {/* 굳이 outputBalance를 두지 않고 어떤 탭이 활성화 되어 있냐에 따라 곱하기 혹은 나누기 하면 되는거아닌감? */}
            {/* {isOpenedTab1 ? viewOutputToken : viewOutputEther} */}
            {outputBalance}
          </OutputAmount>
          <SwapBtn disabled={swapBtnDisabled} onClick={assetValidation}>
            Swap
          </SwapBtn>
        </OutputAmountLayout>

        {isAndroid && (
          <MetaMaskGuideLayout
            href="market://launch?id=io.metamask"
            target="_blank"
          >
            Do you have MetaMask installed?
          </MetaMaskGuideLayout>
        )}
        {isIOS && (
          <MetaMaskGuideLayout
            href="https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
            target="_blank"
          >
            Do you have MetaMask installed?
          </MetaMaskGuideLayout>
        )}
        <Web3ButtonLayout>
          <Web3Button />
        </Web3ButtonLayout>
      </Card>
    </SwapPageBody>
  );
};

export default NewSwapPage;
