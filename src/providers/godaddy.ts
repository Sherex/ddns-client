import config from "../config.ts";
import { log } from "../lib/logger.ts";
import { Provider } from "../lib/types.ts"

export default class Godaddy {
  private options: Provider.Provider
  private fetchConfig: RequestInit

  constructor(options: Provider.Provider) {
    if (options.name !== 'godaddy') throw Error('Invalid provider options for godaddy!')
    this.options = options
    this.fetchConfig = {
      headers: {
        Authorization: `sso-key ${options.key}:${options.secret}`,
      }
    }
  }

  public getRecord = async (domain: string, record: Provider.DNSRecord): Promise<Provider.DNSRecord | null> => {
    // Godaddy wants '@' if the record is for the root domain
    if (record.name !== '@') record.name = record.name.replace("@", domain);

    log("info", ["godaddy", "getting record for domain", domain, "with name", record.name]);
    const res = await fetch(
      `${this.options.baseUrl}/v1/domains/${domain}/records/${record.type}/${record.name}`,
      this.fetchConfig,
    );
    if (res.status !== 200) {
      log(
        "error",
        [
          "godaddy",
          "failed to GET record",
          "statuscode",
          String(res.status),
          "message",
          res.statusText,
        ],
      );
      throw Error(
        `Failed to fetch record. StatusCode: ${res.status}, msg: ${res.statusText}`,
      );
    }
    let data = await res.json();
    log("info", ["godaddy", "got record", data.length]);
    if (data && data.length > 0) {
      data = data[0];
      return {
        name: data.name.replace("@", domain),
        type: data.type,
        data: data.data,
        ttl: data.ttl,
      };
    } else {
      return null;
    }
  }

  public setRecord = async (domain: string, record: Provider.DNSRecord): Promise<void> => {
    // Godaddy wants '@' if the record is for the root domain
    if (record.name !== '@') record.name = record.name.replace("@", domain);

    const body = JSON.stringify([
      {
        data: record.data,
        ttl: record.ttl || 3600,
      },
    ]);
    log(
      "info",
      ["godaddy", "setting record", "data", record.data ? record.data : "''"],
    );
    const res = await fetch(
      `${this.options.baseUrl}/v1/domains/${domain}/records/${record.type}/${record.name}`,
      {
        headers: {
          ...this.fetchConfig.headers,
          "Content-Type": "application/json",
        },
        body,
        method: "PUT",
      },
    );
    if (res.status !== 200) {
      let resBody = await res.text();
      log(
        "error",
        [
          "godaddy",
          "failed to PUT record",
          "statuscode",
          String(res.status),
          "message",
          res.statusText,
          "body",
          resBody,
        ],
      );
      if (res.status === 422) console.log("PUT Body:\n" + body)
      throw Error(
        `Failed to PUT record. StatusCode: ${res.status}, msg: ${res.statusText}`,
      );
    }
  }
}
