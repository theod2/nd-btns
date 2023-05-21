chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'storeData') {
    chrome.storage.local.set( request.data, function() {
      sendResponse({ message: 'Données stockées avec succès !' });
    });
  } else if (request.action === 'getData') {
    chrome.storage.local.get(request.keys, function(data) {
      sendResponse({ data: data });
    });
  }
  return true;
});
