import { AllPropertyDataResponse } from '../../../server/types/property';

//const url = 'https://www.property-inspector.net/research/rightmove';
const url = 'http://localhost:8080/research/rightmove';
export const getResults: (urls: string[]) => Promise<AllPropertyDataResponse> = async (urls: string[]) => {
  const raw = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ urls }, null, 2),
    headers: {
      "content-type": "application/json"
    }
  });
  const result: AllPropertyDataResponse = await raw.json();

  return result;
}

