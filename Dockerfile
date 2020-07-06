FROM hayd/alpine-deno:1.1.1

WORKDIR /app

VOLUME [ "/app/config" ]
ENV DDNS_CONFIG_PATH=./config/config.json

# Script will move them to the /app/config directory later
ADD config.*.json ./

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
ADD src/ .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index*.ts

# "deno" is entrypoint, so all commands are arguments to deno
CMD [ "run", "--allow-read", "--allow-run", "--allow-env", "index.docker.ts" ]