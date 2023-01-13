import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import { HtmlOptions } from '../types/property';

const clean = (soCalledJson: string, replacement: string | RegExp) => {
  let firstPass = soCalledJson.trim().replace(replacement, '').trim().replace('</script>', '').replace('</script></body></html>', '');
  
  if (firstPass.indexOf('<script>') > 0) {
    firstPass = firstPass.substring(0, firstPass.indexOf('<script>'));
  }
  if (firstPass.indexOf(';') === firstPass.length - 1) {
    firstPass = firstPass.substring(0, firstPass.length - 1);
  }
  return firstPass;
}

export const extractRegex = (regex: RegExp, replacement: string | RegExp, raw: string) => {
  const title = regex.exec(raw);
  if (!title) {
    // eslint-disable-next-line no-console
    console.log(regex, raw);
    throw new Error('boo');
  }
   //console.log(title[0]);
  // return null;
  const f = clean(title[0], replacement);

  const data = JSON.parse(f);
  return data;
}

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}
if (!fs.existsSync('./data/html')) {
  fs.mkdirSync('./data/html');
}
// eslint-disable-next-line no-console


export const getHtml: (url: URL, options?: HtmlOptions) => Promise<string> = async (url, options = {}) => {

  //const hash = crypto.createHash('md5').update(url.toString()).digest("hex");
  const hash = url.toString()
    .replace(/\?/gi, '-')
    .replace(/\./gi, '_')
    .replace(':', '-')
    .replace(/\//gi, '-')
    .replace(/\*/g, '-');
  
  const useLocalCache = typeof options.useLocalCache === 'boolean' ? options.useLocalCache : true;

  const fullPath = `./data/html/${hash}.html`;
  if (fs.existsSync(fullPath) && useLocalCache ) {
    // eslint-disable-next-line no-console
    console.log('early');
    return fs.readFileSync(fullPath, 'utf8');
  }
  // eslint-disable-next-line no-console
  console.log('not early', process.cwd());

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (response.status !== 200) {
      return null;
    }

    const body = await response.text();
    if (useLocalCache) {
      fs.writeFileSync(fullPath, body);
    }
    
    return body;
  } catch (e) {
    if (e.name === 'TimeoutError') {
      // eslint-disable-next-line no-console
      console.log('time out');
    }

    return null;
  }
  
}