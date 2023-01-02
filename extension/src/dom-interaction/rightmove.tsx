import React from 'react';
import ReactDOM from 'react-dom/client';
import { AllPropertyDataResponse } from '../../../server/types/property';
import { DOMMessage, DOMMessageResponse, OtherDOMMessage } from '../typess/domMessage';
import Details from './detail';
import './rightmove.css'

const url = 'https://www.property-inspector.net/research/rightmove';
//const url = 'http://localhost:8080/research/rightmove';
const getResults: (urls: string[]) => Promise<AllPropertyDataResponse> = async (urls: string[]) => {
  const raw = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ urls }, null, 2),
    headers: {
      "content-type": "application/json"
    }
  });
  const result: AllPropertyDataResponse = await raw.json();

  return result;
}
const onLoad = async () => {
  if (window.location.pathname.indexOf('to-rent') > -1) {
    return;
  }
  console.log('here');
  if (window.location.pathname.indexOf('property-for-sale/find.html') === -1) {
    console.log('sldkfjs');
    return;
  }
  //console.log('[content.js]. Message received', msg);
  const n: HTMLElement[] = [];
  const divs = document.querySelectorAll('.propertyCard-price');
  //console.log(divs, 'sldkfjsdlkfj');
  divs.forEach(div => {
    const l = document.createElement('div');
    l.innerHTML = 'Loading valuation information...';
    l.classList.add('property-inspector-loading');
    div.appendChild(l);
    n.push(l);
  })
  const headlines = Array.from(document.querySelectorAll("a[data-test=property-img]"))
    .map(h1 => h1.getAttribute('href') || '').filter(h => !!h.length);
  if (!headlines.length) {
    console.log('nothing found');
    return;
  }

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

const elementToObserve = document.querySelector("#l-searchResults");

// create a new instance of `MutationObserver` named `observer`,
// passing it a callback function


function mCallback(mutations: any) {
  const found = [];
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (!node.tagName) continue; // not an element
      if (node.classList.contains('l-searchResult')) {
        found.push(node);
      } else if (node.firstElementChild) {
        found.push(...node.getElementsByClassName('l-searchResult'));
      }
    }
  }
  if (found.length) {
    onLoad();
  }
}

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: OtherDOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void) => {

  console.log('gottt it: ' + msg.message);
  //setTimeout(onLoad, 5000);
  //onLoad();

}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

//chrome.runtime.sendMessage({ msg: 'this are it' });

(async () => {
  const observer = new MutationObserver(mCallback);
  // call `observe()` on that MutationObserver instance,
  // passing it the element to observe, and the options object
  observer.observe(elementToObserve as Element, { subtree: true, childList: true });
  onLoad();

})()