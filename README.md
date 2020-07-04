# Deno DDNS Client
A simple DDNS Client written in Typescript / Deno.

## How to use (temporary)
Currently it's pretty manual, I will add a dockerfile and a Deno bundle ASAP.

### Manually
Requires [Deno](https://deno.land/#installation)
```sh
$ git clone https://github.com/sherex/ddns-client
# Either run the client or copy config.template.json to config.json
$ cp config.template.json config.json
$ vim config.json # Or what editor you prefer
# Run deno
$ deno run --allow-read --allow-write --allow-net --allow-env src/index.ts
```

## TODO
- [ ] Move config from .env to config.json
  - [X] Use config.json
  - [ ] Support environment variables (not just a .env file)
  - [ ] Update readme
- [X] Better provider support
  - [ ] Dynamic import based on provider input
  - [X] Export needed TS interfaces
  - [ ] Update readme
- [ ] Docker
  - [X] Create dockerfile (Needs proper environment variable support)
  - [ ] Publish to Docker Hub
  - [ ] Update readme
- [ ] Bundle files with Deno
- [ ] Create executable (Rust bundling)

## Supported DNS providers
- [GoDaddy](https://godaddy.com/) - [API Key](https://developer.godaddy.com/keys) - [API Docs](https://developer.godaddy.com/doc/endpoint/domains)

## Configuration
Check out `config.schema.json` for configuration options and description.
> Tip: VS Code has great support for JSON schema.

# License
[MIT](LICENSE)