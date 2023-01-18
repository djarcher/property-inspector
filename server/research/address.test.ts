import { expect } from 'chai';
import { getBuildingNumber, getStreet, getPostCode } from './address';

type AddressCase = {
  raw: string,
  result: number
}
const cases : AddressCase[] = [{
  raw: "Craigview, 5 Vine Street, Clovenfords, Galashiels",
  result: 5
},
  
  {
    raw: "5/1, Morningside Drive, Edinburgh, Midlothian EH10 5LZ",
    result: 5
  },
  {
    raw: "220, Wallace Street, Flat 3-49, Kingston Quay, Glasgow, G58AF",
    result: 220
  },
  {
    raw: "6 2F3, Springvalley Terrace, Edinburgh, EH10 4QD",
    result: 6
  }];
describe('Get building number', () => { // the tests container
  
  cases.forEach(({raw, result}) => {
    it('checking default options', () => { // the single test

      expect(getBuildingNumber(raw)).to.equal(result);
    
      //expect(1).to.be.false;

    });
  })

  
});

type StreetCase = {
  raw: string,
  result: string
}
const streetCases: StreetCase[] = [{
  raw: "Craigview, 5 Vine Street, Clovenfords, Galashiels",
  result: 'Vine Street'
},
  {
    raw: "3/4 Grey park, Galashiels",
    result: 'Grey park'
  },
  {
    raw: "5/1, Morningside Drive, Edinburgh, Midlothian EH10 5LZ",
    result: 'Morningside Drive'
}];

describe('Get street', () => { // the tests container

  streetCases.forEach(({ raw, result }) => {
    it('checking default options', () => { // the single test

      expect(getStreet(raw)).to.equal(result);

      //expect(1).to.be.false;

    });
  })


});

const postcodeCases: StreetCase[] = [
{
  raw: "220, Wallace Street, Flat 3-49, Kingston Quay, Glasgow, G58AF",
  result: 'G5 8AF'
},
{
  raw: "5/1, Morningside Drive, Edinburgh, Midlothian EH10 5LZ",
  result: 'EH10 5LZ'
}];
describe('Get postcode', () => { // the tests container

  postcodeCases.forEach(({ raw, result }) => {
    it('checking default options', () => { // the single test

      expect(getPostCode(raw)).to.equal(result);

      //expect(1).to.be.false;

    });
  })


});