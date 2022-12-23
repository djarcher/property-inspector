
import { parse, HTMLElement } from 'node-html-parser'
import { AdvertisedProperty, OfferType, RentPrices, RentalPeriod } from '../types/property';
import { getSoldPrices } from './soldPrices';
import { extractRegex, getBuildingNumber, getHtml } from './utils';







const getRightmoveId : (url:string) => string = (url) => {
  return url.replace('/properties/', '').split('/')[0].replace('#', '');
}
const extractData = async (raw: string, url: string): Promise<AdvertisedProperty> => {
  const titleRegex = /window\.PAGE_MODEL = .*/i
  const replacement = 'window.PAGE_MODEL =';
  const data = extractRegex(titleRegex, replacement, raw);

  //console.log('propsdat', data.propertyData)


  // console.log(data.propertyData);
  const result: AdvertisedProperty = {
    postcode: data.analyticsInfo.analyticsProperty.postcode,
    buildingNumber: getBuildingNumber(data.propertyData.address.displayAddress),
    displayAddress: data.propertyData.address.displayAddress,
    //raw: data.propertyData,
    advertisedPrice: {
      value: parseInt(data.propertyData.prices.primaryPrice.replace('£', '').replace(',', '')),
      offerType: OfferType.OffersOver
    },
    id: getRightmoveId(url),
    numBedrooms: data.propertyData.bedrooms
  };
  return result;
}




const getRentPrices = async (propertyData: AdvertisedProperty) : Promise<RentPrices> => {

  const { postcode } = propertyData;

   const url = `https://www.lettingweb.com/flats-to-rent/${postcode.replace(' ', '-')}?O=-date&P=1&S=25&Term=${postcode.replace(' ', '%20')}&IsGlasgowArea=False&IsMonthlyRent=False&IsSaved=False&IncludingBills=False`;
  //const url = `https://www.lettingweb.com/flats-to-rent/EH6?O=-date&P=1&S=25&Term=EH6&IsGlasgowArea=False&IsMonthlyRent=False&IsSaved=False&IncludingBills=False`;
  // eslint-disable-next-line no-console
  console.log(url);
  const raw = await getHtml(new URL(url));
  const root = parse(raw);

  const resultsContainer = root.querySelector('#results');
  if (!resultsContainer) {
    return null;
  }

  let items = resultsContainer.querySelectorAll('[itemprop=itemListElement].col-lg-4');
  if (!items.length) {
    items = resultsContainer.querySelectorAll('[itemprop=itemListElement].mb-4');
  }
  // eslint-disable-next-line no-console
  console.log('count', items.length);
  
  const result: RentPrices = {
    samePostcode:[]
  }
  
  items.forEach((item: HTMLElement) => {
    // eslint-disable-next-line no-console
    console.log('-------');
    const desc = item.querySelector('[itemprop=description]');
    if (!desc) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(desc.innerText.substring(0, desc.innerText.indexOf('&nbsp;')).trim());
    const price = item.querySelector('[itemprop=price]');
    if (!price) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(price.getAttribute('content')?.trim());

    result.samePostcode.push({
      displayAddress: 'unknown',
      buildingNumber: -1,
      postcode: postcode,
      numBedrooms: -1,
      description: desc.innerText.substring(0, desc.innerText.indexOf('&nbsp;')).trim(),
      rentalPrice: {
        value: parseInt(price.getAttribute('content')?.trim()),
        rentalPeriod: RentalPeriod.CalendarMonth
      }
    });
  });
  return result;
  /* const regex = /<span itemprop="price" content="\d+/i;
  const replace = "<span itemprop=\"price\" content=\"";
  try {
    const price = extractRegex(regex, replace, raw);
    // eslint-disable-next-line no-console
    console.log(price);
  } catch (e) {
    return {
      samePostcode:[]
    }
  } */

  return {
    samePostcode: []
  };
}

const parsePropertyDetails = async (crawledUrl: URL, html: string): Promise<AdvertisedProperty> => {
  if (crawledUrl.hostname !== 'www.rightmove.co.uk') {
    throw new Error(`cannot parse. No parser for ${crawledUrl.hostname}`);
  }
  const data = await extractData(html, crawledUrl.pathname);
  return data;
}
export const getPropertyDetails = async (url: string) => {
  const parsedUrl = new URL(url);
  const html = await getHtml(parsedUrl);
  
  const data = await parsePropertyDetails(parsedUrl, html);

  const soldData = await getSoldPrices(data);
  const rentData = await getRentPrices(data);
  
  return { propertyData: data, soldData, rentData };
}
