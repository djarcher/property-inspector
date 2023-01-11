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
  let part = parts[current];
  
  while (part) {
    
    const yesIsFlatNumberOnly = isFlatNumberOnly(part);
    if (yesIsFlatNumberOnly) {
      current += 1;
      part = parts[current];
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
    part = parts[current];
    
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

export const getPostCode = (displayAddress: string): string => {
  return '-' || displayAddress;
}