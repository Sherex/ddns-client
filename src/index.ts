import config from "./load-config.ts";
import { log } from "./lib/logger.ts";
import { updateRecord } from "./lib/update-record.ts";
import { Provider } from "./lib/types.ts";

// TODO: Figure out how to get the type Providers from config

for (let [providerName, data] of Object.entries(config.providers)) {
  if (!data) throw Error("Godaddy data is undefined")
  const providerData: Provider.Provider = {
    name: providerName as Provider.ProviderNames,
    baseUrl: data.apiUrl,
    key: data.key,
    secret: data.secret
  }
  for (const record of data.records) {
    const recordData: Provider.DNSRecord = {
      name: record.recordName,
      type: record.recordType,
      data: record.recordData,
      ttl: record.recordTTL
    }
    try {
      log("info", ["index", "updateRecord", "domain", record.domainName, "record", record.recordName])
      await updateRecord(providerData, record.domainName, recordData)
      log("info", ["index", "updateRecord", "done!"])
    } catch (error) {
      log("error", ["index", "updateRecord", "failed to update record!", "error", error])
      console.error(error)
    }
  }
}
