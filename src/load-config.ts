import "https://deno.land/x/dotenv/load.ts";
import { log } from "./lib/logger.ts";
import { Config } from "./lib/types.ts"
import validator from 'https://cdn.pika.dev/is-my-json-valid@^2.20.0'

const configPath = Deno.env.get('DDNS_CONFIG_PATH') || './config.json'
const configTemplatePath = Deno.env.get('DDNS_CONFIG_TEMPLATE_PATH') || './config.template.json'
const configSchemaPath = Deno.env.get('DDNS_CONFIG_SCHEMA_PATH') || './config.schema.json'

let schema
let config: Config.ConfigJson

try {
  config = JSON.parse(Deno.readTextFileSync(configPath))
} catch (error) {
  log("error", ["config", "could not find config", configPath, "creating", configPath, "please edit it for your purpose"]);
  const configTemplate = Deno.readTextFileSync(configTemplatePath)
  Deno.writeTextFileSync(configPath, configTemplate)
  Deno.exit(0)
}

try {
  schema = JSON.parse(Deno.readTextFileSync(configSchemaPath));
} catch (error) {
  log("warn", ["config", "could not find schema", configSchemaPath]);
}

const validate = validator(schema)

if (!validate(config)) {
  log("error", ["config", "invalid schema in 'config.json'", "the following messages contain the errors"]);
  validate.errors.forEach((error: Config.SchemaError) => {
    log("error", ["config", "invalid schema", "field", error.field, "message", error.message]);
    Deno.exit(1)
  })
}

// TODO: If provider key and secert ends with _ENV check env vars
// TODO: Fill defaults based on schema

export default config