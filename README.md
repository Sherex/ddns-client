# Deno DDNS Client
A simple DDNS Client written in Typescript / Deno.

This project's purpose was mostly to test Deno and learn Typescript (I have a lot to learn here).

## Features
- Update multiple records, at multiple ([supported](/README.md#Supported-DNS-providers)) providers in one config
- Automatically get the client's external IP
- Has a JSON Schema for easy configuration

## How to use
### Docker Compose
> Will update with DockerHub link when available.
```sh
$ git clone https://github.com/sherex/ddns-Client
$ cd ddns-client
$ docker-compose up # -d # Add '-d' switch to run as daemon

# Edit 'config/config.json' - I recommend VSCode to use the JSON schema.

# Start the container
$ docker-compose up
```

### Docker
> Will update with DockerHub link when available.
```sh
$ git clone https://github.com/sherex/ddns-Client
$ cd ddns-client
$ docker build . -t ddns-client &&
  docker run -v /absolute/path/to/volume:/app/config --name ddns-client ddns-client

# Edit 'config/config.json' - I recommend VSCode to use the JSON schema.

# Start the container
$ docker-compose up
```

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

## Supported DNS providers
- [GoDaddy](https://godaddy.com/) - [API Key](https://developer.godaddy.com/keys) - [API Docs](https://developer.godaddy.com/doc/endpoint/domains)

## Configuration
Check out [`config.template.json`](./config.template.json) for an example config.

Check out [`config.schema.json`](./config.schema.json) for configuration options and description.
> Tip: VS Code has great support for JSON schema.

## TODO
- [ ] Move config from .env to config.json
  - [X] Use config.json
  - [X] Support environment variables (not just a .env file)
  - [ ] Support getting provider key and secret from env variable, if config.json entry ends with '_ENV'
  - [X] Update readme
- [X] Better provider support
  - [X] Dynamic import based on provider input (it imports all providers)
  - [X] Export needed TS interfaces
  - [X] Update readme
- [X] Docker
  - [X] Create dockerfile
  - [ ] Publish to Docker Hub
  - [X] Update readme
- [ ] Use schema specified in the `config.json` `$schema` propterty for validation
- [ ] Create executable (Rust bundling or if Deno eventually supports it [denoland/deno Issue #986](https://github.com/denoland/deno/issues/986))


# License
[MIT](LICENSE)