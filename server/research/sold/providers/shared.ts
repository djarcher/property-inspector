import { SoldByYearSummary, SoldPrices, Transaction } from "../../../types/property";

const getSummaryByYear: (transactions: Transaction[]) => SoldByYearSummary = transactions => {
  const interim: { [key: number]: number[] } = {

  }
  transactions.forEach(t => {
    interim[t.date.getFullYear()] = interim[t.date.getFullYear()] || [];
    interim[t.date.getFullYear()].push(t.price);
  });

  const result: { [key: number]: number } = {};
  Object.entries(interim).forEach(([year, values]) => {
    result[parseInt(year)] = Math.floor(values.reduce((acc, num) => num + acc, 0) / values.length);
  })

  return {
    averageSoldPriceByYear: result
  }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const doThisProperty = (propertyData: any, s: SoldPrices) => {
  if (propertyData.propertyType === 'Detached' && Object.keys(s.sameBuilding.byBedroomNumber).length === 1) {
    const x = Object.values(s.sameBuilding.byBedroomNumber)[0].properties[0];
    if (x) {
      s.thisProperty = {
        transactions: x.transactions,
        summary: getSummaryByYear(x.transactions)
      }
    }

  }
}