FROM hayd/alpine-deno:1.1.1

WORKDIR /app

VOLUME [ "/app/config.json" ]

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
ADD src/ .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index.ts

# "deno" is entrypoint, so all commands are arguments to deno
CMD [ "run", "--allow-read", "--allow-write", "--allow-net", "index.ts" ]