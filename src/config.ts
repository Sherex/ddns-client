import { config } from "https://deno.land/x/dotenv/mod.ts";
import { log } from './lib/logger.ts'
const envs = config()

const validProviders = [
  'godaddy'
]

if (!envs.DOMAIN) throw Error('Please enter a valid \'DOMAIN\' in the \'.env\' file')
if (!envs.RECORD_NAME) {
  log('info', ['config', '\'RECORD_NAME\' is empty, defaulting to: \'@\''])
  envs.RECORD_NAME = '@'
}
if (!envs.RECORD_TYPE) {
  log('info', ['config', '\'RECORD_TYPE\' is empty, defaulting to: \'A\''])
  envs.RECORD_TYPE = 'A'
}
if (!envs.RECORD_DATA) {
  log('info', ['config', '\'RECORD_DATA\' is empty, defaulting to: \'!ip\' (your external IP)'])
  envs.RECORD_DATA = '!ip'
}
if (!envs.PROVIDER || !validProviders.includes(envs.PROVIDER)) throw Error('Please enter a valid \'PROVIDER\' in the \'.env\' file')
if (envs.PROVIDER === 'godaddy') {
  if (!envs.GD_BASE_URL) {
    log('info', ['config', '\'GD_BASE_URL\' is empty, defaulting to: \'https://api.godaddy.com/\''])
    envs.GD_BASE_URL = 'https://api.godaddy.com/'
  }
  if (!envs.GD_TOKEN) throw Error('Please enter a valid \'GD_TOKEN\' in the \'.env\' file')
  if (!envs.GD_SECRET) throw Error('Please enter a valid \'GD_SECRET\' in the \'.env\' file')
}

export default {
  DOMAIN: envs.DOMAIN,
  RECORD_NAME: envs.RECORD_NAME,
  RECORD_TYPE: envs.RECORD_TYPE,
  RECORD_DATA: envs.RECORD_DATA,
  PROVIDER: envs.PROVIDER,
  GD_BASE_URL: envs.GD_BASE_URL,
  GD_TOKEN: envs.GD_TOKEN,
  GD_SECRET: envs.GD_SECRET
}
