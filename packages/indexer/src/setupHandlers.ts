import { setupEventHandlers } from "@/src/lib/setupEventHandlers";
import { indexedOpStackChains } from "@superchain-testnet-tools/indexed-chains";

indexedOpStackChains.map((indexedOpStackChain) => {
  console.log("registering event handlers for", indexedOpStackChain.l2Chain.network)
  setupEventHandlers(indexedOpStackChain)
})