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
  postcode: string,
  numBedrooms: number
}

export interface AdvertisedProperty extends Property {
  advertisedPrice: AdvertisedPrice,
  id: string
}

export interface Transaction {
  date: Date,
  price: number
}

export interface SoldPropertyPrice {
  property: Property,
  detailUrl: string,
  transactions: Transaction[]
}

export interface GroupedByBedroomsSoldPriceData {
  
  
  byBedroomNumber: {
    [key: number]: {
      properties: SoldPropertyPrice[],
      summary: {
        averageSoldPriceByYear: {
          [key: number]: number
        }
      }
    },

  },
  
}

export interface SoldPrices {
  sameBuilding: GroupedByBedroomsSoldPriceData,/*  SoldPropertyPrice[], */
  samePostcode: GroupedByBedroomsSoldPriceData, /*  SoldPropertyPrice[] */
}

export interface RentalProperty extends Property {
  rentalPrice: RentalPrice
  description: string
}
export interface RentPrices {
  samePostcode: RentalProperty[]
}