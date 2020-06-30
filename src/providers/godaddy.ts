import config from '../config.ts'
import { log } from '../lib/logger.ts'

interface DNSRecord {
  name: string,
  type: string,
  data?: string,
  ttl?: number
}

const fetchConfig: RequestInit = {
  headers: {
    Authorization: `sso-key ${config.GD_TOKEN}:${config.GD_SECRET}`,
  }
}

async function getRecord(domain: string, record: DNSRecord): Promise<DNSRecord | null> {
  record.name = record.name.replace('@', domain)

  log('info', ['godaddy', 'getting record for domain', domain, 'with name', record.name])
  const res = await fetch(`${config.GD_BASE_URL}/v1/domains/${domain}/records/${record.type}/${record.name}`, fetchConfig)
  if (res.status !== 200) {
    log('error', ['godaddy', 'failed to GET record', 'statuscode', String(res.status), 'message', res.statusText])
    throw Error(`Failed to fetch record. StatusCode: ${res.status}, msg: ${res.statusText}`)
  }
  let data = await res.json()
  log('info', ['godaddy', 'got record', data.length])
  if (data && data.length > 0) {
    data = data[0]
    return {
      name: data.name.replace('@', domain),
      type: data.type,
      data: data.data,
      ttl: data.ttl
    }
  } else {
    return null
  }
}

async function setRecord(domain: string, record: DNSRecord): Promise<void> {
  record.name = record.name.replace('@', domain)
  const body = JSON.stringify([
    {
      data: record.data,
      ttl: record.ttl || 3600
    }
  ])
  log('info', ['godaddy', 'setting record', 'data', record.data ? record.data : '\'\''])
  const res = await fetch(`${config.GD_BASE_URL}/v1/domains/${domain}/records/${record.type}/${record.name}`, {
    headers: {
      ...fetchConfig.headers,
      'Content-Type': 'application/json'
    },
    body,
    method: 'PUT'
  })
  if (res.status !== 200) {
    let body = await res.text()
    log('error', ['godaddy', 'failed to PUT record', 'statuscode', String(res.status), 'message', res.statusText, 'body', body])
    throw Error(`Failed to PUT record. StatusCode: ${res.status}, msg: ${res.statusText}`)
  }
}

export {
  getRecord,
  setRecord,
  DNSRecord
}