import { expect } from 'chai';
import { getBuildingNumber, getStreet } from './address';

type AddressCase = {
  raw: string,
  result: number
}
const cases : AddressCase[] = [{
  raw: "Craigview, 5 Vine Street, Clovenfords, Galashiels",
  result: 5
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
  }];

describe('Get street', () => { // the tests container

  streetCases.forEach(({ raw, result }) => {
    it('checking default options', () => { // the single test

      expect(getStreet(raw)).to.equal(result);

      //expect(1).to.be.false;

    });
  })


});