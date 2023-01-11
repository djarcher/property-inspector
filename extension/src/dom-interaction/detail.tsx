import React from "react";
import { Property, RentPrices, SoldPrices } from "../../../server/types/property";
import styles from './rightmove.module.css';
import styled from 'styled-components';
import DetailTable from "./detailTable";

const Div = styled.div`
  background: #fff;
  color: #000;
  border: 1px solid #000;
`

const getAverageRent = (rentData: RentPrices | null, numBedrooms: number, propertyType: string) => {
  if (!rentData?.samePostcode.byBedroomNumber[numBedrooms]) {
    return 0;
  }

  const same = rentData.samePostcode.byBedroomNumber[numBedrooms].filter(r => r.propertyType === propertyType);

  //console.log(rentData.samePostcode.byBedroomNumber[numBedrooms].length, same.length);
  return same.reduce((acc, r) => acc + r.rentalPrice.value, 0) / same.length;
}

const Detail = function ({ property, soldData, rentData }: { property: Property, rentData: RentPrices | null, soldData: SoldPrices | null }) {
  if (!soldData) {
    return (
      <>
        <span>Property Inspector</span>
      </>
    )
  } else {

    const rent = getAverageRent(rentData, property.numBedrooms, property.propertyType);

    //console.log('Property Inspector', soldData.samePostcode.byBedroomNumber, property.numBedrooms);
    const soldSamePostcode = soldData.samePostcode.byBedroomNumber[property.numBedrooms] ? Object.entries(soldData.samePostcode.byBedroomNumber[property.numBedrooms].summary.averageSoldPriceByYear).map(([year, amount]) => ({ year: year as unknown as number, amount })) : [];
    let sameBuildingData = soldData.sameBuilding.byBedroomNumber[property.numBedrooms];
    if (!sameBuildingData && property.propertyType === 'Detached' && soldData.thisProperty) {
      sameBuildingData = { properties: [{ property: property, transactions: soldData.thisProperty.transactions, detailUrl: ''}]} ;
    }
    const soldSameBuilding = sameBuildingData ? Object.entries(sameBuildingData.summary.averageSoldPriceByYear).map(([year, amount]) => ({ year: year as unknown as number, amount })) : [];
    soldSamePostcode.sort((a, b) => b.year - a.year);
    soldSameBuilding.sort((a, b) => b.year - a.year);
    //const soldSamePostcode = soldData?.samePostcode.data[1] && soldData?.samePostcode.data[1].length ? soldData.samePostcode.data[1][0].transactions[0].price : 0;
    //const soldSameBuilding = soldData?.sameBuilding.data[1] && soldData?.sameBuilding.data[1].length ? soldData.sameBuilding.data[1][0].transactions[0].price : 0;

    return (
      <Div>
        <h6 style={{
          background: '#98c1d9',
          width: '100%',
          fontWeight: 'bold',
          minHeight: '20px',
          textAlign: 'right',
          padding: '5px'
        }}>Other {property.numBedrooms} bed properties</h6>
        <DetailTable postcodeOutcode={property.postcode.split(' ')[0]} title={property.propertyType === 'Flat' ? "Properties in the same building" : "This Property"} rentPrice={0} soldPrices={{ prices: soldSameBuilding }} />
        <DetailTable postcodeOutcode={property.postcode.split(' ')[0]} title="Other properties same postcode" rentPrice={rent} soldPrices={{ prices: soldSamePostcode }} />


        {/* <div>Sold same building: {soldSameBuilding}</div>
        <div>Sold same postcode: {soldSamePostcode}</div>
        <div>Rent same postcode: {rent}</div> */}
      </Div>
    )
  }
}

export default Detail;
