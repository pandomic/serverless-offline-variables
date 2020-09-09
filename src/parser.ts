const ENV_SPLIT_REGEX = /=(?:"(.+)"|(.+))/;

export const parseDotEnv = (content: string): { [name: string]: string } => {
  const lines = content.split("\n").map(line => line.trim()).filter(Boolean);

  return lines.map(line => line.split(ENV_SPLIT_REGEX))
    .map(([name, quotedValue, rawValue]) => [name, quotedValue || rawValue])
    .reduce((memo, [name, value]) => ({ ...memo, [name]: value }), {});
};
