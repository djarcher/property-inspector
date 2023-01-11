export enum OfferType {
  OffersOver = "Offers Over",
  
}

export enum RentalPeriod {
  CalendarMonth = "per calendar month",
}

interface AdvertisedPrice {
  value: number,
  offerType: OfferType
}

interface RentalPrice {
  value: number,
  rentalPeriod: RentalPeriod
}

export interface Property {
  displayAddress: string,
  buildingNumber: number,
  street: string,
  postcode: string,
  numBedrooms: number,
  propertyType: string
}

export interface AdvertisedProperty extends Property {
  advertisedPrice: AdvertisedPrice,
  id: string
}

export interface Transaction {
  date: Date,
  price: number
}

export type HtmlOptions = {
  useLocalCache?: boolean
}

export interface SoldPropertyPrice {
  property: Property,
  detailUrl: string,
  transactions: Transaction[]
}

export interface SoldByYearSummary {
  averageSoldPriceByYear: {
    [key: number]: number
  }
}
export interface GroupedByBedroomsSoldPriceData {
  
  
  byBedroomNumber: {
    [key: number]: {
      properties: SoldPropertyPrice[],
      summary: SoldByYearSummary
    },

  },
  
}

export interface GroupedByBedroomsRentPriceData {
  byBedroomNumber: {
    [key: number]: RentalProperty[]
  }
}

export interface SoldPrices {
  thisProperty: {
    transactions: Transaction[],
    summary: SoldByYearSummary
  } | null,
  sameBuilding: GroupedByBedroomsSoldPriceData,/*  SoldPropertyPrice[], */
  samePostcode: GroupedByBedroomsSoldPriceData, /*  SoldPropertyPrice[] */
}

export interface RentalProperty extends Property {
  rentalPrice: RentalPrice
  description: string
}
export interface RentPrices {
  samePostcode: GroupedByBedroomsRentPriceData
}

export type SinglePropertyDataResponse = {
  propertyData: AdvertisedProperty,
  soldData: SoldPrices,
  rentData: RentPrices
}

export type AllPropertyDataResponse = {
  propertyData:
  {
    [key: string]:SinglePropertyDataResponse
  },
  // missingData: string[]
}
