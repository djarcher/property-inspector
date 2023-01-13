
import { parse, HTMLElement } from 'node-html-parser'
import { AdvertisedProperty, OfferType, RentPrices, RentalPeriod, SinglePropertyDataResponse, AllPropertyDataResponse } from '../types/property';
import { getBuildingNumber, getStreet } from './address';
import { getSoldPrices } from './soldPrices';
import { extractRegex, getHtml } from './utils';

const getRightmoveId : (url:string) => string = (url) => {
  return url.replace('/properties/', '').split('/')[0].replace('#', '');
}
const extractData = async (raw: string, url: string): Promise<AdvertisedProperty> => {
  const titleRegex = /window\.PAGE_MODEL = .*/i
  const replacement = 'window.PAGE_MODEL =';
  const data = extractRegex(titleRegex, replacement, raw);

  //console.log('propsdat', data.propertyData)

  const result: AdvertisedProperty = {
    postcode: data.analyticsInfo.analyticsProperty.postcode,
    street: getStreet(data.propertyData.address.displayAddress),
    buildingNumber: getBuildingNumber(data.propertyData.address.displayAddress),
    displayAddress: data.propertyData.address.displayAddress,
    //raw: data.propertyData,
    advertisedPrice: {
      value: parseInt(data.propertyData.prices.primaryPrice.replace('£', '').replace(',', '')),
      offerType: OfferType.OffersOver
    },
    id: getRightmoveId(url),
    numBedrooms: data.propertyData.bedrooms,
    propertyType: data.propertyData.propertySubType
  };

  return result;
}




const scrapeRightMoveRental: ({ postcode }: { postcode: string}) => Promise<RentPrices> = async ({postcode}) => {
  const url = `https://www.rightmove.co.uk/property-to-rent/${postcode.split(' ')[0]}.html`;
  const raw = await getHtml(new URL(url));
  if (!raw) {
    return {
      samePostcode:{byBedroomNumber:{}}
    }
  }
  const regex = /<script>window.jsonModel((?!<\/script).)*/;
  const line = regex.exec(raw);
  if (!line) {
    return;
  }
  const allData = JSON.parse(line[0].replace('<script>window.jsonModel = ', ''));
  //console.log(allData.properties[0]);

  const root = parse(raw);

  const resultsContainer = root.querySelector('#l-searchResults');
  if (!resultsContainer) {
    return null;
  }

  const items = resultsContainer.querySelectorAll("[data-test^='propertyCard']");
  /* if (!items.length) {
    items = resultsContainer.querySelectorAll('[itemprop=itemListElement].mb-4');
  } */
  // eslint-disable-next-line no-console
  console.log('count', items.length);

  const result: RentPrices = {
    samePostcode: {byBedroomNumber: {}}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allData.properties.forEach((property: any) => {
    const numBedrooms = property.bedrooms;
    result.samePostcode.byBedroomNumber[numBedrooms] = result.samePostcode.byBedroomNumber[numBedrooms] || [];
    result.samePostcode.byBedroomNumber[numBedrooms].push({
      displayAddress: 'unknown',
      street: '',
      buildingNumber: -1,
      postcode: postcode,
      numBedrooms: numBedrooms,
      propertyType: property.propertySubType,
      description: property.displayAddress,
      rentalPrice: {
        value: property.price.amount,
        rentalPeriod: RentalPeriod.CalendarMonth
      }
    });
  });
  return result;
  items.forEach((item: HTMLElement) => {
    // eslint-disable-next-line no-console
    //console.log('-------', item);
    const desc = item.querySelector('address meta[itemprop="streetAddress"]');
    if (!desc) {
      return;
    }
    // eslint-disable-next-line no-console
    //console.log('desc', desc);
    // eslint-disable-next-line no-console
    //console.log(desc.innerText.substring(0, desc.innerText.indexOf('&nbsp;')).trim());
    const price = item.querySelector('.propertyCard-priceValue');
    if (!price) {
      return;
    }

    const bedrooms = item.querySelector('[data-test="property-details"] .property-information');
    if (!bedrooms) {
      //console.log('no bedrooms data');
      return;
    }
    //console.log('got beds');
    const numBedrooms = parseInt(bedrooms.innerHTML.split(' ')[0]);

    // eslint-disable-next-line no-console
    console.log('price', price.getAttribute('content')?.trim(), price.innerHTML);
    // eslint-disable-next-line no-console
    console.log('add', desc.getAttribute('content').trim());

    result.samePostcode.byBedroomNumber[numBedrooms] = result.samePostcode.byBedroomNumber[numBedrooms] || [];
    result.samePostcode.byBedroomNumber[numBedrooms].push({
      displayAddress: 'unknown',
      street: '',
      buildingNumber: -1,
      postcode: postcode,
      numBedrooms: numBedrooms,
      description: desc.getAttribute('content').trim(),
      propertyType: 'unknown',
      rentalPrice: {
        value: parseInt(price.innerHTML.split(' ')[0].replace('£', '').replace(',', '')),
        rentalPeriod: RentalPeriod.CalendarMonth
      }
    });
  });
  return result;
}

const getRentPrices = async (propertyData: AdvertisedProperty) : Promise<RentPrices> => {

  const { postcode } = propertyData;

  
   //const url = `https://www.lettingweb.com/flats-to-rent/${postcode.replace(' ', '-')}?O=-date&P=1&S=25&Term=${postcode.replace(' ', '%20')}&IsGlasgowArea=False&IsMonthlyRent=False&IsSaved=False&IncludingBills=False`;
  //const url = `https://www.lettingweb.com/flats-to-rent/EH6?O=-date&P=1&S=25&Term=EH6&IsGlasgowArea=False&IsMonthlyRent=False&IsSaved=False&IncludingBills=False`;
  // eslint-disable-next-line no-console
  //console.log(url);

  
  // eslint-disable-next-line no-constant-condition
  if (true) {
    const result = await scrapeRightMoveRental({ postcode });
    return result;
  } else {
    const url = `https://www.lettingweb.com/flats-to-rent/${postcode.replace(' ', '-')}?O=-date&P=1&S=25&Term=${postcode.replace(' ', '%20')}&IsGlasgowArea=False&IsMonthlyRent=False&IsSaved=False&IncludingBills=False`;
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
      samePostcode: {byBedroomNumber:{1:[]}}
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

      result.samePostcode.byBedroomNumber[1].push({
        displayAddress: 'unknown',
        street: '',
        buildingNumber: -1,
        postcode: postcode,
        numBedrooms: -1,
        propertyType: 'unknown',
        description: desc.innerText.substring(0, desc.innerText.indexOf('&nbsp;')).trim(),
        rentalPrice: {
          value: parseInt(price.getAttribute('content')?.trim()),
          rentalPeriod: RentalPeriod.CalendarMonth
        }
      });
    });
    return result;
  }
  
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
    samePostcode: {byBedroomNumber:{}}
  };
}

const parsePropertyDetails = async (crawledUrl: URL, html: string): Promise<AdvertisedProperty> => {
  if (crawledUrl.hostname !== 'www.rightmove.co.uk') {
    throw new Error(`cannot parse. No parser for ${crawledUrl.hostname}`);
  }
  const data = await extractData(html, crawledUrl.pathname);
  return data;
}
export const getPropertyDetails: (url: string) => Promise<SinglePropertyDataResponse> = async (url: string) => {
  const parsedUrl = new URL(url);
  const html = await getHtml(parsedUrl);
  if (!html) {
    return null;
  }
  
  const data = await parsePropertyDetails(parsedUrl, html);
  //console.log(data);

  const soldData = await getSoldPrices(data);
  const rentData = await getRentPrices(data);
  
  return { propertyData: data, soldData, rentData };
}

export const getAllPropertyDetails: (urls: string[]) => Promise<AllPropertyDataResponse> = async (urls) => {
  const result: AllPropertyDataResponse = {propertyData: {}};
  for (let i = 0; i < urls.length; i++) {
    const path = urls[i];
    const url = `https://www.rightmove.co.uk${path}`;
    const singleResult = await getPropertyDetails(url);
    if (singleResult) {
      const { propertyData, soldData, rentData } = singleResult;
      result.propertyData[path] = { propertyData, soldData, rentData };
    }
  }

  return result;
}
