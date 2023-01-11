import { getBuildingNumber, getPostCode, getStreet } from "../../address";
import { GroupedByBedroomsSoldPriceData, Property, SoldPrices, SoldPropertyPrice, Transaction } from "../../../types/property";
import { extractRegex, getHtml } from "../../utils";
import { doThisProperty } from "./shared";

const fetchRawSoldPriceData: ({ postcode }: { postcode: string }) => Promise<string> = async ({ postcode }) => {
  const url = new URL(`https://www.rightmove.co.uk/house-prices/${postcode.toLowerCase().replace(' ', '-')}.html`);
  const raw = await getHtml(url);
  return raw;
} 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractSinglePriceHistory = (soldDataRaw: any): SoldPropertyPrice => {
  //console.log('sss', soldDataRaw);
  const property: Property = {
    displayAddress: soldDataRaw.address,
    street: getStreet(soldDataRaw.address),
    buildingNumber: getBuildingNumber(soldDataRaw.address),
    postcode: getPostCode(soldDataRaw.address),
    numBedrooms: soldDataRaw.bedrooms || -1,
    propertyType: soldDataRaw.propertyType  // usually unknown
  }
  const transactions: Transaction[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  soldDataRaw.transactions.forEach((t: any) => {
    const date = new Date(Date.parse(t.dateSold));
    const price = parseInt(t.displayPrice.replace('£', '').replace(',', ''))
    const transaction = { date, price }
    transactions.push(transaction);
  });
  return { property, transactions, detailUrl: soldDataRaw.detailUrl };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRelatedData: (properties: unknown[], filterFn: any) => GroupedByBedroomsSoldPriceData = (properties, filterFn) => {
  const related = properties.filter(filterFn);

  const priced: SoldPropertyPrice[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  related.forEach((soldDataRaw: any) => {
    const d = extractSinglePriceHistory(soldDataRaw);
    priced.push(d);
  });

  const bedrooms: GroupedByBedroomsSoldPriceData = {
    byBedroomNumber: {

    }
  };

  priced.forEach(p => {
    //console.log('beds', p.property.numBedrooms);
    bedrooms.byBedroomNumber[p.property.numBedrooms] = bedrooms.byBedroomNumber[p.property.numBedrooms] || {
      properties: [],
      summary: {
        averageSoldPriceByYear: {}
      }
    };
    bedrooms.byBedroomNumber[p.property.numBedrooms].properties.push(p);
  });

  Object.values(bedrooms.byBedroomNumber).forEach(b => {
    const rawDataForYearSummaries: { [key: number]: number[] } = {};

    b.properties.forEach(p => {
      p.transactions.forEach(t => {
        rawDataForYearSummaries[t.date.getFullYear()] = rawDataForYearSummaries[t.date.getFullYear()] || [];
        rawDataForYearSummaries[t.date.getFullYear()].push(t.price);
      });
    });

    Object.entries(rawDataForYearSummaries).forEach(([year, values]) => {
      const sum = values.reduce((a, b) => a + b);
      b.summary.averageSoldPriceByYear[year as unknown as number] = sum / values.length;
    });
  });


  return bedrooms;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSoldPrices = async (propertyData: any): Promise<SoldPrices> => {
  const raw = await fetchRawSoldPriceData({ postcode: propertyData.postcode });

  const titleRegex = /window.__PRELOADED_STATE__ = .*/i
  const replacement = 'window.__PRELOADED_STATE__ =';
  const data = extractRegex(titleRegex, replacement, raw);


  const result: SoldPrices = {
    thisProperty: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sameBuilding: getRelatedData(data.results.properties, (p: any) => getBuildingNumber(p.address) === propertyData.buildingNumber),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    samePostcode: getRelatedData(data.results.properties, (p: any) => getBuildingNumber(p.address) !== propertyData.buildingNumber)
  }

  doThisProperty(propertyData, result);

  return result;
}
