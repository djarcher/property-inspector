
import { SoldPrices } from '../types/property';
import { getSoldPrices as getAllProvidersSoldPrices } from './sold/providers';



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSoldPrices = async (propertyData: any): Promise<SoldPrices> => {
  return await getAllProvidersSoldPrices(propertyData);
}