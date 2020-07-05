# Deno DDNS Client 
A simple DDNS Client written in Typescript / Deno.

This project's purpose was mostly to test Deno and learn Typescript (I have a lot to learn here).

## Features
- Update multiple records, at multiple ([supported](#Supported-DNS-providers)) providers in one config
- Automatically get the client's external IP
- Has a JSON Schema for easy configuration
- Supports setting provider API keys and secrets in `config.json` and as environment variables
- Supports `.env`file

## How to use
[![Docker stats](https://dockeri.co/image/sherex/ddns-client)](https://hub.docker.com/r/sherex/ddns-client/)
### Docker Compose
1. Create a `docker-compose.yml` file
```yml
# docker-compose.yml
version: "3.7"
services:
  ddns_client:
    container_name: ddns-client
    image: sherex/ddns-client:latest
    volumes:
      - "./config:/app/config"
```
2. Start the container
```sh
# Creates the config directory and places config.json inside
$ docker-compose up

# Edit 'config/config.json' - I recommend VSCode to use the JSON schema.

# Start the container
$ docker-compose up # -d # Add '-d' switch to run as daemon
```
Check out [configuration](#Configuration) further down.

### Docker
```sh
# Creates the config directory and places config.json inside
# Replace $PWD with %cd% on Windows
$ docker run -v $PWD/config:/app/config --name ddns-client sherex/ddns-client

# Edit 'config/config.json' - I recommend VSCode to use the JSON schema.

# Start the container
$ docker start ddns-client -a # '-a' Attach STDOUT/STDERR and forward signals
```
Check out [configuration](#Configuration) further down.

### Manually
Requires [Deno](https://deno.land/#installation)
```sh
$ git clone https://github.com/sherex/ddns-client
$ cd ddns-client
# Run the client to create a template config.json
$ deno run --allow-read --allow-write --allow-net --allow-env src/index.ts

$ vim config.json # Or what editor you prefer

# Run the client
$ deno run --allow-read --allow-write --allow-net --allow-env src/index.ts
```
Check out [configuration](#Configuration) further down.

## Supported DNS providers
- [GoDaddy](https://godaddy.com/) - [API Key](https://developer.godaddy.com/keys) - [API Docs](https://developer.godaddy.com/doc/endpoint/domains)

## Configuration
Check out [`config.template.json`](./config.template.json) for an example config.

Check out [`config.schema.json`](./config.schema.json) for configuration options and description.
> Tip: VS Code has great support for JSON schema.

### Keys and secrets
Keys and secrets can be set as properties under each provider.  
If the value ends with `_ENV` it will try to get the value from the corresponding env variable.
> Example:
> `GD_KEY_ENV` will be replaced with the value of env variable `GD_KEY`

## TODO
- [X] Move config from .env to config.json
  - [X] Use config.json
  - [X] Support environment variables (not just a .env file)
  - [X] Support getting provider key and secret from env variable, if config.json entry ends with '_ENV'
  - [X] Update readme
- [X] Better provider support
  - [X] Dynamic import based on provider input (it imports all providers)
  - [X] Export needed TS interfaces
  - [X] Update readme
- [X] Docker
  - [X] Create dockerfile
  - [X] Publish to Docker Hub
  - [X] Update readme
- [ ] Break up types in configJson typings ([types.ts](./src/lib/types.ts))
- [ ] Use schema specified in the `config.json` `$schema` propterty for validation
- [ ] Create executable (Rust bundling or if Deno eventually supports it [denoland/deno Issue #986](https://github.com/denoland/deno/issues/986))


# License
[MIT](LICENSE)
