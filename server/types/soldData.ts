import { SoldPrices } from "./property"

export type SoldDataProvider = {
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSoldPrices: (propertyData: any)=> Promise<SoldPrices>
  // missingData: string[]
}