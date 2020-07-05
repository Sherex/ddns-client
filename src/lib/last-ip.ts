import { log } from "./logger.ts";
import { Config } from "./types.ts";
import { exists } from "./exists.ts";

const configPath = Deno.env.get('DDNS_CONFIG_PATH') || './config.json'

function setLastIp(ip: string): void {
  let config: Config.ConfigJson

  if (!exists(configPath)) {
    log("warn", ["last-ip", "couldn't find 'config.json'", "skipping setting IP"])
    return
  }

  try {
    config = JSON.parse(Deno.readTextFileSync(configPath));
    if (!config.storage) config.storage = {}
    config.storage.lastIp = ip;

    const configJson = JSON.stringify(config, null, 2);
    Deno.writeTextFileSync(configPath, configJson);
  } catch (error) {
    log("warn", ["last-ip", "failed to set lastIp in 'config.json'", "skipping setting IP"])
    return
  }
}

function getLastIp(): string | null {
  let config: Config.ConfigJson

  if (!exists(configPath)) {
    return null
  }
  
  try {
    config = JSON.parse(Deno.readTextFileSync(configPath));
  } catch (error) {
    log("warn", ["last-ip", "Invalid format in 'config.json'", "error", error]);
    return null
  }

  if (config.storage && config.storage.lastIp) return config.storage.lastIp;

  return null;
}

export {
  setLastIp,
  getLastIp,
};
