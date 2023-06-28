import { useBalance } from "wagmi";
function MyBalance({ address, chainId, contractAddress, setMyBalance }) {
  const { data: ethBalance } = useBalance({
    address: address,
    watch: true,
    formatUnits: "ether",
    chainId: chainId,
  });
  const { data: tokenBalance } = useBalance({
    address: address,
    token: contractAddress,
    watch: true,
    formatUnits: "ether",
    chainId: chainId,
  });

  setMyBalance({ ethBalance, tokenBalance });
}
export default MyBalance;
