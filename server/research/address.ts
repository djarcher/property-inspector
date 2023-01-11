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