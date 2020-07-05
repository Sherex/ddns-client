import { log } from "./logger.ts";
import getCurrentIp from "./get-current-ip.ts";
import { setLastIp, getLastIp } from "./last-ip.ts";
import { Provider } from "./types.ts"
import getProvider from "../providers/get-provider.ts";

export {
  updateRecord
}

async function updateRecord(provider: Provider.Provider, domain: string, record: Provider.DNSRecord) {
  const { setRecord, getRecord } = getProvider(provider)
  const newRecord = record

  if (record.data === "!ip") {
    const lastIp = await getLastIp();
    const currentIp = await getCurrentIp();

    if (lastIp && lastIp === currentIp) {
      log("debug", ["update-record", record.name, "current IP is equal to last check", "skipping"]);
      return false
    }
    newRecord.data = currentIp;
  }

  const currentRecord = await getRecord(domain, newRecord);

  if (currentRecord && currentRecord.data && currentRecord.data === newRecord.data) {
    log("debug", ["update-record", record.name, "RECORD_DATA is equal to the DNS record", "skipping"]);
    if (record.data === "!ip") {
      log("debug", ["update-record", record.name, "updating lastIp in config"]);
      await setLastIp(currentRecord.data);
    }
    return false
  } else {
    log(
      "info",
      [
        "update-record",
        record.name,
        "setting record",
        "name",
        newRecord.name,
        "type",
        newRecord.type,
        "data",
        newRecord.data ? newRecord.data : "",
      ],
    );
    await setRecord(domain, newRecord);
    if (record.data === "!ip" && newRecord.data) {
      log("info", ["update-record", record.name , "updating lastIp in config"]);
      await setLastIp(newRecord.data);
    }
  }
  log("info", ["update-record", record.name ,"done!"]);
}