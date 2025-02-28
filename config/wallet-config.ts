import { createConfig, http } from "wagmi";
import { base, mainnet, seiDevnet, sepolia } from "wagmi/chains";
import { injected, safe, walletConnect } from "wagmi/connectors";

export const projectId = "3bdcb2f2810725e8f870c033ac5a6223";

if (!projectId) throw new Error("Project ID is not defined");

export const config = createConfig({
  chains: [mainnet, base, sepolia, seiDevnet],
  connectors: [injected(), walletConnect({ projectId }), safe()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [seiDevnet.id]: http(),
  },
  ssr: true,
});
