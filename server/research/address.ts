const isFlatNumberOnly: (raw: string) => boolean = raw => {
  const hasFlatNumber = raw.indexOf('/') > -1  || raw.indexOf('f') > -1;
  if (!hasFlatNumber) {
    return false;
  }
  
  let working = raw;
  if (raw.indexOf(',') === raw.length - 1) {
    working = working.replace(',', '');
  }
  // 34/2
  if (parseInt(working.replace('/', '')).toString() == working.replace('/', '')) {
    return true;
  }

  // 2f1
  if (parseInt(working.replace('f', '')).toString() == working.replace('f', '')) {
    return true;
  }

  return false; 
}

const getStreetAfterFlat: (raw: string) => string = (raw) => {
  let working = raw;
  if (working.indexOf(',') === working.length - 1) {
    working = working.replace(',', '');
  }

  const parts = working.split(' ');
  if (parts.length === 1) {
    return null;
  }

  if (isFlatNumberOnly(parts[0])) {
    return parts.slice(1).join(' ');
  }

  return null;
}

const getStreetAfterPlainNumber: (raw: string) => string = (raw) => {
  
  let working = raw.trim();
  if (working.indexOf(',') === working.length - 1) {
    working = working.replace(',', '');
  }

  const parts = working.split(' ');
  if (parts.length === 1) {
    return null;
  }

  
  if (parseInt(parts[0]).toString() === parts[0]) {
  
    return parts.slice(1).join(' ');
  }

  return null;
}

export const getStreet: (displayAddress: string) => string = (displayAddress) => {
  const parts = displayAddress.split(',');
  let current = 0;
  let part = parts[current].trim();
  
  while (part) {
    
    const yesIsFlatNumberOnly = isFlatNumberOnly(part);
    if (yesIsFlatNumberOnly) {
      if (current === 0) {
        return getStreet(displayAddress.replace(',',''));
      }
      
      current += 1;
      part = parts[current].trim();
      continue;
    } 

    const afterFlat = getStreetAfterFlat(part);
    if (afterFlat) {
      return afterFlat;
    }

    const afterPlainNumber = getStreetAfterPlainNumber(part);
    if (afterPlainNumber) {
      return afterPlainNumber;
    }

    current += 1;
    part = parts[current]?.trim();
    
  }
  
  return '';
} 

export const getBuildingNumber = (displayAddress: string): number => {
  const parts = displayAddress.split(' ');
  // console.log(parts[0]);
  if (parts[0].indexOf('/') > -1) {
    return parseInt(parts[0].split('/')[0], 10);
  }

  let current = 0;
  let part = parts[current];
  while (part) {
    /* if (part.indexOf(',') === parts[0].length - 1) {
      part = part.substring(0, part.length - 1);
    } */
    if (!isNaN(parseInt(part))) {
      break;
    }
    current += 1;
    part = parts[current];
  }
  if (!part) {
    return -1;
  }

  return parseInt(part, 10);
}

//https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes
const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
export const getPostCode = (displayAddress: string): string => {
  const m = displayAddress.match(postcodeRegex);
  if (!m || !m.length) {
    return '-';
  }
  const magicOutcode = m[3].trim();
  const code = m[0].replace(magicOutcode, '').trim();
  return `${magicOutcode} ${code}`.toUpperCase();
  //return '-' || displayAddress;
}