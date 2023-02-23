chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) 
{
  if (request.action === "getSelectedText") 
  {
    let selectedText = window.getSelection().toString()
    console.log(selectedText)
    sendResponse(selectedText);
  }
});