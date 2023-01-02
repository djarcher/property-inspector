import express from 'express';
import { Request, Response } from 'express';
import { AllPropertyDataResponse } from '../types/property';

const router = express.Router();
import { getAllPropertyDetails, getPropertyDetails } from '../research';

/* GET home page. */
router.post('/', async (req: Request, res: Response) => {
  const url = req.body.url || [];
  const data = await getPropertyDetails(url);
  if (!data) {
    return res.sendStatus(500);
  }
  const { propertyData, soldData, rentData } = data;
  // console.log(soldData[0].transactions);
  return res.json({
    url: req.body.url,
    searchedProperty: propertyData,
    soldData,
    rentData
  })
});
router.options('/rightmove', async (req: Request, res: Response) => { 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, x-access-token, X-Requested-With, Content-Type, Accept");
  return res.sendStatus(200);
});
router.post('/rightmove', async (req: Request, res: Response) => {
  const urls: string[] = req.body.urls || [];
  /* console.log(urls);
  return res.json({ foo: 'bar' }); */
  const result: AllPropertyDataResponse = await getAllPropertyDetails(urls);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json(result);
  
  /* const { propertyData, soldData, rentData } = await getPropertyDetails(url);
  // console.log(soldData[0].transactions);
  return res.json({
    url: req.body.url,
    searchedProperty: propertyData,
    soldData,
    rentData
  }) */
});

export default router;

