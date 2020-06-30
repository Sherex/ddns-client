async function getCurrentIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org/");
  if (!res.body) throw Error("Couldn't get the external IP");
  return res.text();
}

export default getCurrentIp;
