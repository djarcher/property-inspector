import { expect } from 'chai';
import { getBuildingNumber } from './address';

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