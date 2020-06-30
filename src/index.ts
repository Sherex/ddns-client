import config from './config.ts'
import { log } from './lib/logger.ts'
import getCurrentIp from "./lib/get-current-ip.ts";
import { setLastIp, getLastIp } from "./lib/last-ip.ts";
import { getRecord, setRecord } from "./providers/godaddy.ts";

let recordData = ''

if (config.RECORD_DATA === '!ip') {
  const lastIp = await getLastIp()
  const currentIp = await getCurrentIp()

  if (lastIp && lastIp === currentIp) {
    log('debug', ['index', 'current IP is equal to last check', 'exiting'])
    Deno.exit(0)
  }
  recordData = currentIp
} else {
  recordData = config.RECORD_DATA
}

const currentRecord = await getRecord(config.DOMAIN, {
  name: config.RECORD_NAME,
  type: config.RECORD_TYPE
})

if (currentRecord && currentRecord.data === recordData) {
  log('debug', ['index', 'RECORD_DATA is equal to the DNS record', 'exiting'])
  if (config.RECORD_DATA === '!ip') {
    log('info', ['index', 'updating lastIp in config'])
    await setLastIp(currentRecord.data)
  }
  Deno.exit(0)
} else {
  log('info', ['index', 'setting record', 'name', config.RECORD_NAME, 'type', config.RECORD_TYPE, 'data', recordData])
  await setRecord(config.DOMAIN, {
    name: config.RECORD_NAME,
    type: config.RECORD_TYPE,
    data: recordData
  })
  if (config.RECORD_DATA === '!ip') {
    log('info', ['index', 'updating lastIp in config'])
    await setLastIp(recordData)
  }
}
log('info', ['index', 'done!', 'exiting'])
