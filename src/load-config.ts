import "https://deno.land/x/dotenv/load.ts";
import validator from 'https://cdn.pika.dev/is-my-json-valid@^2.20.0'
import * as path from "https://deno.land/std/path/mod.ts";
import { log } from "./lib/logger.ts";
import { Config, Provider } from "./lib/types.ts"
import { exists } from "./lib/exists.ts";

const configPath = Deno.env.get('DDNS_CONFIG_PATH') || './config.json'
const configDirPath = path.dirname(configPath)

const configTemplatePath = './config.template.json'
const configSchemaPath = './config.schema.json'

let schema
let config: Config.ConfigJson

if (!exists(configDirPath)) {
  Deno.mkdirSync(configDirPath, { recursive: true })
}

if (!exists(path.resolve(configDirPath, configSchemaPath))) {
  log("warn", ["config", "config schema was not found", "creating"])
  Deno.copyFileSync(configSchemaPath, path.resolve(configDirPath, configSchemaPath))
}

if (!exists(configPath)) {
  log("warn", ["config", "config was not found", "creating"])
  Deno.copyFileSync(configTemplatePath, configPath)
  log("info", ["config", "creating", configPath, "please edit it", "exiting"])
  Deno.exit(0)
}

try {
  schema = JSON.parse(Deno.readTextFileSync(path.resolve(configDirPath, configSchemaPath)));
} catch (error) {
  log("error", ["config", "failed to read config.schema.json", configSchemaPath, "throwing"]);
  throw error
}

try {
  config = JSON.parse(Deno.readTextFileSync(configPath))
} catch (error) {
  log("error", ["config", "failed to read config.json", configPath, "throwing"]);
  throw error
}

const validate = validator(schema)

if (!validate(config)) {
  log("error", ["config", "invalid schema in 'config.json'", "the following messages contain the errors"]);
  validate.errors.forEach((error: Config.SchemaError) => {
    log("error", ["config", "invalid schema", "field", error.field, "message", error.message]);
    Deno.exit(1)
  })
}

for (const [providerName, props] of Object.entries(config.providers)) {
  if (!props) continue
  // TODO: Fix types for provider
  const provider: any = config.providers[providerName as Provider.ProviderNames]

  Object.entries(props).forEach(([key, value]) => {
    if (typeof value !== 'string') return
    if (!value.endsWith('_ENV')) return
    const envVar = value.replace(/_ENV$/, '')
    const envValue = Deno.env.get(envVar)
    if (!envValue) {
      log("error", ["config", "couldn't find env variable", envVar, "specified in config.json"])
      return
    }
    provider[key] = envValue
  })
}

// TODO: Fill defaults based on schema

export default config