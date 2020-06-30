import { log } from './logger.ts'

interface Config {
  ip: string | null;
}

async function setLastIp(ip: string): Promise<void> {
  let config: Config = {
    ip: null,
  };

  if (await exists("./config.json")) {
    try {
      config = JSON.parse(await Deno.readTextFile("./config.json"));
      config.ip = ip;

      const configJson = JSON.stringify(config, null, 2);
      await Deno.writeTextFile("./config.json", configJson);
    } catch (error) {
      log('warn', ['last-ip', 'Invalid format in \'config.json\'', 'skipping setting IP']);
    }
  }
}

async function getLastIp(): Promise<string | null> {
  let config: Config = {
    ip: null,
  };

  if (await exists("./config.json")) {
    try {
      config = JSON.parse(await Deno.readTextFile("./config.json"));
    } catch (error) {
      log('warn', ['last-ip', 'Invalid format in \'config.json\'']);
    }
  }

  if (typeof config.ip === "string") return config.ip;

  return null;
}

async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}

export {
  setLastIp,
  getLastIp,
};
