type LogLevel = 'silly' | 'debug' | 'info' | 'verbose' | 'warn' | 'error'

let minimumLogLevel: LogLevel = 'info'

function isLogLevel(level: string | undefined): level is LogLevel {
  return typeof getLevel(level as LogLevel) !== 'undefined' 
}

const logLevelEnv = Deno.env.get('DDNS_LOGLEVEL')
if (isLogLevel(logLevelEnv)) {
  minimumLogLevel = logLevelEnv.toLocaleLowerCase() as LogLevel
}

async function log(level: LogLevel, message: string | string[]) {
  if (getLevel(level) > getLevel(minimumLogLevel)) return
  message = Array.isArray(message) ? message : [message];
  const { date, time, milli } = getDateTime();
  console.log(
    `[ ${date} ${time}.${milli} ] < ${level.toUpperCase()} > ${
      message.join(" - ")
    }`,
  );
}

function getDateTime() {
  const dateObject = new Date();
  const [date, time, milli] = dateObject.toISOString().split(/T|Z|\./);
  return {
    date,
    time,
    milli,
  };
}

function getLevel(level: LogLevel): number {
  level = level.toLocaleLowerCase() as LogLevel
  const levelMapper = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  }
  return levelMapper[level]
}



export {
  log,
};
