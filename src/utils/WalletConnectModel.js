import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";

export const projectId = "efbef30781db35f509ba078461274246";
const chains = [mainnet, goerli];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
