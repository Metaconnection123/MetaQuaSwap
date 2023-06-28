import { forwardRef, useImperativeHandle } from "react";
import { encodeFunctionData, parseEther, toHex } from "viem";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

const PrePareSendTransction = forwardRef(
  (
    {
      activeTabNum,
      inputBalance,
      contractAddress,
      ContractAbi,
      maxFeePerGas,
      gas,
      chainId,
      setLoading,
    },
    ref
  ) => {
    console.log("PrePareSendTransction : params : ", {
      activeTabNum,
      inputBalance,
      contractAddress,
      ContractAbi,
      maxFeePerGas,
      gas,
      chainId,
    });

    console.log("PrePareSendTransction : inputBalance : ", inputBalance);
    // inputBalance를 hex로 변경해볼까?
    let inputBalanceToHex = toHex(parseEther(inputBalance.toString()));
    let trxObject = {
      to: contractAddress,
      value: activeTabNum === 1 ? inputBalanceToHex : "0x0",
      maxPriorityFeePerGas: "0x77359400", //Miner Tip 2Gwei
      maxFeePerGas: maxFeePerGas,
      gas: gas,
      data: encodeFunctionData({
        abi: ContractAbi,
        functionName: activeTabNum === 1 ? "convertToken" : "convertEther",
        args: activeTabNum === 1 ? [] : [inputBalanceToHex],
      }),
      chainId: chainId,
    };
    console.log("PrePareSendTransction : trxObject : ", trxObject);

    const { config } = usePrepareSendTransaction({
      ...trxObject,
      onSuccess(data) {
        console.log("usePrepareSendTransaction : Success", data);
      },
      onError(error) {
        console.log("usePrepareSendTransaction : Error", error);
      },
    });

    const { data, sendTransaction } = useSendTransaction({
      ...config,
      onSuccess(data) {
        console.log("useSendTransaction : Success", data);
      },
      onError(error) {
        console.log("useSendTransaction : Error", error);
      },
    });

    const { receipt } = useWaitForTransaction({
      hash: data?.hash,
      onSuccess(result) {
        console.log("useWaitForTransaction : Success", result);
        setLoading(false);
      },
      onError(error) {
        console.log("useWaitForTransaction : Error", error);
        setLoading(false);
      },
    });

    // 외부로 노출할 함수를 정의
    useImperativeHandle(ref, () => ({
      sendTransaction,
    }));

    return null;
  }
);

export default PrePareSendTransction;
