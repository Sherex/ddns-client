# Deno DDNS Client
A simple DDNS Client written in Typescript / Deno.

## How to use (temporary)
Currently it's pretty manual, I will add a dockerfile and a Deno bundle ASAP.
```sh
$ git clone https://github.com/sherex/ddns-client
$ cp template.env .env
$ vim .env # Or what editor you prefer
# Run deno
$ deno run --allow-read --allow-write --allow-net src/index.ts
```

## TODO
- [ ] Finish README
  - [ ] Create config overview
  - [ ] Create providers section
  - [ ] How to configure
  - [ ] Get API keys
- [ ] Move config from .env to config.json
  - [ ] Optional .env?
- [ ] Docker
  - [ ] Create dockerfile
  - [ ] Publish to Docker Hub
- [ ] Bundle files with Deno
- [ ] Create executable (Rust bundling)

## Configuration
### `DOMAIN`
The domain you own that should receive the record

### `RECORD_NAME = '@'`
The name of the record to update.  
`@` is replaced with the `DOMAIN` variable.

Ex. `subdomain.@`

### `RECORD_TYPE = 'A'`
The record type to update.

### `RECORD_DATA = '!ip'`
The data to put in the record, defaults to '!ip'.

### `PROVIDER`
The DNS provider that manages your records
Supported providers:
- [GoDaddy](https://godaddy.com/)

### `GD_BASE_URL = 'https://api.godaddy.com/'`
The base url for the provider GoDaddy, defaults to 'https://api.godaddy.com/'.  
Replace with 'https://api.ote-godaddy.com/' to use their OTE environment. (Requires seperate token and secret)

Create your API token and secret at 'https://developer.godaddy.com/keys'.

### `GD_TOKEN`
Your GoDaddy token received from 'https://developer.godaddy.com/keys'.

### `GD_SECRET`
Your GoDaddy secret received from 'https://developer.godaddy.com/keys'.

# License
[MIT](LICENSE)