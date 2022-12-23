import { AdvertisedProperty, SoldPrices, RentPrices } from "../../../server/types/property";

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
}

export type PropertyDataResponse = {
  propertyData:
  {
    [key: string]:
    { propertyData: AdvertisedProperty, soldData: SoldPrices, rentData: RentPrices }
  }
}

export type DOMMessage = {
  type: 'GET_DOM',
  response: PropertyDataResponse | null
}