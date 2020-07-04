namespace Provider {
  interface Godaddy {
    name: 'godaddy',
    baseUrl: string,
    key: string,
    secret: string
  }

  export type Provider = Godaddy

  export type ProviderNames = 'godaddy'

  export interface DNSRecord {
    name: string;
    type: string;
    data?: string;
    ttl?: number;
  }
}

namespace Config {
  // Generated with "https://bcherny.github.io/json-schema-to-typescript-browser/"

  /**
   * Configuration of the ddns-client.
   */
  export interface ConfigJson {
    /**
     * The schema to verify this document against.
     */
    $schema?: string;
    /**
     * Defines one or more providers to add or update records at.
     */
    providers: {
      /**
       * Provider GoDaddy.
       */
      godaddy?: {
        /**
         * The url to the providers API.
         */
        apiUrl: string;
        /**
         * The API key you get from https://developer.godaddy.com/keys. Or add '_ENV' at the end of the string to use the string as a name for an env variable containing the key.
         */
        key: string;
        /**
         * The API secret you get from https://developer.godaddy.com/keys. Or add '_ENV' at the end of the string to use the string as a name for an env variable containing the secret.
         */
        secret: string;
        /**
         * All records to add or update at this provider
         */
        records: {
          /**
           * The domain to add or update this record to.
           */
          domainName: string;
          /**
           * The name of the record. '@' is replaced with the 'domainName'
           */
          recordName: string;
          /**
           * The type of record to add or update.
           */
          recordType: "A" | "AAAA" | "CNAME" | "MX" | "NS" | "SOA" | "TXT";
          /**
           * The data to put in the record. Use '!ip' to automatically get your external IP.
           */
          recordData: string;
          /**
           * The TTL (time to live) in seconds for the record.
           */
          recordTTL: number;
        }[];
      };
    };
    /**
     * Object for storing properties.
     */
    storage?: {
      /**
       * The last external IP for this client.
       */
      lastIp?: string;
      [k: string]: unknown;
    };
  }

  export interface SchemaError {
    field: string,
    message: string
  }
}

export {
  Provider,
  Config
}
