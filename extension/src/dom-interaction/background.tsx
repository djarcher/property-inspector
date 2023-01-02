/* chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: 'helloaaa!',
      url: changeInfo.url
    })
  }
}
); */

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener(async(message, callback) => {
  const tabId = await getCurrentTab();
  chrome.tabs.sendMessage(tabId.id as number, {
    message: 'helloaaa! ' + message.msg,
    url: 'got it: ' + message.msg
  })
});
export {}