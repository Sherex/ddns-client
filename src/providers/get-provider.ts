import { log } from "../lib/logger.ts";
import { Provider } from "../lib/types.ts";
import Godaddy from "./godaddy.ts"

function getProvider(provider: Provider.Provider) {
  switch (provider.name) {
    case "godaddy":
      return new Godaddy(provider)
  
    default:
      log('error', ['get-provider', 'unknown provider', provider.name])
      Deno.exit(1)
  }
}

export default getProvider
