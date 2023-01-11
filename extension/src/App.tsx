import React from 'react';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './typess/domMessage';

function App() {
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);

  const getResults = async (urls: string[]) => {
    console.log('hiya');
    const raw = await fetch('https://www.property-inspector.net/research/rightmove', {
      method: 'POST',
      body: JSON.stringify({ urls }, null, 2),
      headers: {
        "content-type": "application/json"
      }
    });
    const result = await raw.json();
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM', response: result } as DOMMessage,
        (response: DOMMessageResponse) => {
          console.log('ype here');
          /* console.log('got it');
          setTitle('123');
          getResults(response.headlines);
          setHeadlines(response.headlines); */
        });
    });
  }
  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          console.log('got it');
          setTitle('123');
          getResults(response.headlines);
          setHeadlines(response.headlines);
        });
    });
  }, []);

  return (
    <div className="App">
      <h1>Property Inspector</h1>

      <h4>The ultimate helper in your search for property on Rightmove</h4>

      <div>Icon from <a href="https://icons8.com/icons/set/magnifying-glass">icons8</a></div>
      
    </div>
  );
}

export default App;