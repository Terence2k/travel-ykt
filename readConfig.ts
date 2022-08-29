import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
const config: Record<string, any> = getEnvConfig();

function getEnvConfig() {
  let contentDev = {},
    contentDefault = {};
  const joinPath = path.resolve(__dirname, '.env.development');
  if (existsSync(joinPath)) {
    contentDev = parse(readFileSync(joinPath, 'utf-8'));
  }
  const joinPathEnv = path.resolve(__dirname, '.env');
  if (existsSync(joinPathEnv)) {
    contentDefault = parse(readFileSync(joinPathEnv, 'utf-8'));
  }
  return { ...contentDefault, ...contentDev };
}

function parse(string: string) {
  const obj: Record<string, string> = {};
  const regExp = '(\\S+)\\s*=\\s*(\\S+)';
  const list = string.match(new RegExp(regExp, 'g'));
  list &&
    list.forEach(item => {
      const data = item.match(new RegExp(regExp));
      const key = data ? data[1].trim() : undefined;
      const value = data ? data[2].trim() : undefined;
      key && (obj[key] = value);
    });
  return obj;
}
export { config };
