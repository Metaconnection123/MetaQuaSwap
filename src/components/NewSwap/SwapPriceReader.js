import { useEffect } from "react";
import { formatEther } from "viem";
import { useContractRead } from "wagmi";
function SwapPriceReader({
  contractAddress,
  contractAbi,
  chainId,
  setSwapUnit,
}) {
  console.log({ contractAddress, contractAbi, chainId, setSwapUnit });
  const { data: contractData } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    chainId: chainId,
    functionName: "getSwapPrice",
    watch: true,
  });
  useEffect(() => {
    function handleSuccess() {
      if (contractData) {
        const convertedData = formatEther(contractData);
        setSwapUnit(convertedData);
      }
    }

    handleSuccess();
  }, [contractData]);

  return null;
}

export default SwapPriceReader;
