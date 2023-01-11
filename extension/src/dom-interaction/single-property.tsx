import React from 'react';
import ReactDOM from 'react-dom/client';
import Details from './detail';
import { getResults } from "./functions";

const singleProperty = async () => {
  //console.log('[content.js]. Message received', msg);
  const n: HTMLElement[] = [];
  const div = document.querySelector('[data-testid="priceQualifier"]');
  if (!div) {
    return;
  }
  
  //console.log(divs, 'sldkfjsdlkfj');
  

  const l = document.createElement('div');
  l.innerHTML = 'Loading valuation information...';
  l.classList.add('property-inspector-loading');
  div.nextElementSibling?.appendChild(l);
  n.push(l);



  const headlines = [window.location.pathname];

  const results = await getResults(headlines);

  const msg = { response: results }
  //console.log(msg.response);
  l.innerHTML = '';
  //n.forEach(aa => aa.remove());

  if (!Object.entries(msg.response.propertyData).length) {
    return;
  }
  const result = Object.entries(msg.response.propertyData)[0][1];
  

    //console.log(node);
  
    const root = ReactDOM.createRoot(
      l as HTMLElement
    );
    //node?.appendChild(div);
    root.render(
      <React.StrictMode>
        <Details property={result.propertyData} soldData={result.soldData} rentData={result.rentData} />
      </React.StrictMode>)
  
}

export default singleProperty;
