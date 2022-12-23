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
const Detail = function ({ property, soldData, rentData }: { property: Property, rentData: RentPrices | null, soldData: SoldPrices | null }) {
  if (!soldData) {
    return (
      <>
        <span>hiya</span>
      </>
    )
  } else {
    const rent = rentData?.samePostcode.length ? rentData.samePostcode[0].rentalPrice.value : 0;

    console.log('fooooo', soldData.samePostcode.byBedroomNumber, property.numBedrooms);
    const soldSamePostcode = soldData.samePostcode.byBedroomNumber[property.numBedrooms] ? Object.entries(soldData.samePostcode.byBedroomNumber[property.numBedrooms].summary.averageSoldPriceByYear).map(([year, amount]) => ({ year: year as unknown as number, amount })) : [];
    const soldSameBuilding = soldData.sameBuilding.byBedroomNumber[property.numBedrooms] ? Object.entries(soldData.sameBuilding.byBedroomNumber[property.numBedrooms].summary.averageSoldPriceByYear).map(([year, amount]) => ({ year: year as unknown as number, amount })) : [];
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
        <DetailTable title="Properties in the same building" rentPrice={rent} soldPrices={{ prices: soldSameBuilding }} />
        <DetailTable title="Other properties same postcode" rentPrice={rent} soldPrices={{ prices: soldSamePostcode }} />


        {/* <div>Sold same building: {soldSameBuilding}</div>
        <div>Sold same postcode: {soldSamePostcode}</div>
        <div>Rent same postcode: {rent}</div> */}
      </Div>
    )
  }
}

export default Detail;
