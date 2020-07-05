type LogLevel = 'debug' | 'info' | 'warn' | 'error'

async function log(level: LogLevel, message: string | string[]) {
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

export {
  log,
};
