import React from 'react';
import ReactDOM from 'react-dom/client';
import { DOMMessage, DOMMessageResponse, PropertyDataResponse } from '../typess/domMessage';
import Details from './detail';
import './rightmove.css'

const getResults: (urls: string[]) => Promise<PropertyDataResponse> = async (urls: string[]) => {
  const raw = await fetch('http://localhost:8080/research/rightmove', {
    method: 'POST',
    body: JSON.stringify({ urls }, null, 2),
    headers: {
      "content-type": "application/json"
    }
  });
  const result: PropertyDataResponse = await raw.json();

  return result;
}
const onLoad = async () => {
  //console.log('[content.js]. Message received', msg);
  const n: HTMLElement[] = [];
  const divs = document.querySelectorAll('.propertyCard-price');
  divs.forEach(div => {
    const l = document.createElement('div');
    l.innerHTML = 'Fetching property info';
    l.classList.add('property-inspector-loading');
    div.appendChild(l);
    n.push(l);
  })
  const headlines = Array.from(document.querySelectorAll("a[data-test=property-img]"))
    .map(h1 => h1.getAttribute('href') || '');

  const results = await getResults(headlines);

  const msg = { response: results }
  console.log(msg.response);
  n.forEach(aa => aa.remove());
  Object.values(msg.response.propertyData).forEach(result => {
    const node = document.getElementById(`property-${result.propertyData.id}`)?.querySelector('.propertyCard-price');
    console.log(node);
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(
      div as HTMLElement
    );
    node?.appendChild(div);
    root.render(
      <React.StrictMode>
        <Details property={result.propertyData} soldData={result.soldData} rentData={result.rentData} />
      </React.StrictMode>)
  })
  // Prepare the response object with information about the site
  /* const response: DOMMessageResponse = {
    title: document.title,
    headlines
  };
  console.log('head', headlines)
  sendResponse(response);
  return; */
}
// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void) => {

  if (!msg.response) {

  } else {

  }

}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
console.log('hiya');
(async () => onLoad())()