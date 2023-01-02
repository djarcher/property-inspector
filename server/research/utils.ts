import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import { HtmlOptions } from '../types/property';

export const extractRegex = (regex: RegExp, replacement: string | RegExp, raw: string) => {
  const title = regex.exec(raw);
  if (!title) {
    // eslint-disable-next-line no-console
    console.log(regex, raw);
    throw new Error('boo');
  }
  // console.log(title[0]);
  // return null;
  const data = JSON.parse(title[0].trim().replace(replacement, '').trim().replace('</script>', ''));
  return data;
}

export const getBuildingNumber = (displayAddress: string): number => {
  const parts = displayAddress.split(' ');
  // console.log(parts[0]);
  if (parts[0].indexOf('/') > -1) {
    return parseInt(parts[0].split('/')[0], 10);
  }

  if (parts[0].indexOf(',') === parts[0].length - 1) {
    return parseInt(parts[0], 10);
  }

  return parseInt(parts[0], 10);
}

export const getPostCode = (displayAddress: string): string => {
  return '-' || displayAddress;
}
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}
if (!fs.existsSync('./data/html')) {
  fs.mkdirSync('./data/html');
}
// eslint-disable-next-line no-console


export const getHtml: (url: URL, options?: HtmlOptions) => Promise<string> = async (url, options = {}) => {

  const hash = crypto.createHash('md5').update(url.toString()).digest("hex");
  if (url.pathname.indexOf('property-to-rent') > -1) {
    console.log(hash);
  }
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