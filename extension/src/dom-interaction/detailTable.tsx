import React from "react";
import styled from 'styled-components';
import { AverageSoldPrice, ByNumBedsByYearAverage } from "../typess/property";

const Table = styled.div`
  display: table;
   
   width: 100%;
   table-layout: fixed;
`;
const TableRow = styled.div`
  display: table-row;
`;

const TableCol = styled.div`
  display: table-cell;
  padding: 2px;
`;
const TableColTitle = styled.div`
  display: table-cell;
  width: 60%
`;
const Section = styled.section`
  padding: 5px;
`;
const Header = styled.header`
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 5px;
`
export interface AverageSoldPrices {
  prices: ByNumBedsByYearAverage
}

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function DetailTable({
  title,
  soldPrices,
  rentPrice,
  postcodeOutcode
}: {
    title: string,
    soldPrices: AverageSoldPrices,
    rentPrice: number,
    postcodeOutcode: string
}) {
  
  return (
    <Section>
      <Header>{title}</Header>
      {/* <div class="line-break"></div> */}
      <Table>
        {Object.keys(soldPrices.prices).length === 0 ? (
          <TableRow>
            <TableColTitle style={{ background: '#e0fbfc'}}>No sold price history found</TableColTitle>
        </TableRow>) : (
            Object.entries(soldPrices.prices).map(([numBeds, averageOverYears]) => <>
              <TableRow>
                <TableColTitle>{numBeds === '-1' ? 'Unknown number' : numBeds} bed average sold price </TableColTitle>
              </TableRow>
              {averageOverYears.map((soldPrice: AverageSoldPrice, index: number) => <>
                <TableRow style={{ background: index % 2 === 0 ? '#e0fbfc' : '#fff' }}>
                  <TableColTitle>&nbsp;-&nbsp;{soldPrice.year}</TableColTitle>
                  <TableCol>{formatter.format(soldPrice.amount)}</TableCol>
                </TableRow>
                <TableRow></TableRow>
              </>)}
            </>)
              
        )}
        
        {rentPrice > 0 ? 
          <TableRow style={{ background: 'rgba(238, 108, 77, 0.2)' }}>
            <TableColTitle>Current avg monthly rental ({postcodeOutcode}) </TableColTitle>
            <TableCol>{rentPrice > 0 ? formatter.format(rentPrice) : 'no current rental data'}</TableCol>
          </TableRow>
        : null}
        
      </Table>

    </Section>
  )
}