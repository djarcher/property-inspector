import { SoldDataProvider } from "../../../types/soldData";
//import { getSoldPrices as rightmove } from "./rightmoveSoldPrices"
import { getSoldPrices as espc } from "./espcSoldPrices"
import { SoldPrices } from "../../../types/property";

export const providers: SoldDataProvider[] = [
  /* {
    name: 'rightmove',
    getSoldPrices: rightmove
  }, */
  {
    name: 'espc',
    getSoldPrices: espc
  }
];


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSoldPrices = async (propertyData: any): Promise<SoldPrices> => {
  const all: Promise<SoldPrices>[] = [];
  providers.forEach(async provider => {
    all.push(provider.getSoldPrices(propertyData));
  })
  const results = await Promise.all(all);
  if (!results.length) {
    return {
      thisProperty: null,
      sameBuilding: { byBedroomNumber: {} },
      samePostcode: { byBedroomNumber: {} },
    }
  }

  //console.log(results[0]);
  return results[0];
}