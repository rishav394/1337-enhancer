/// <reference types="chrome"/>

chrome.contextMenus.onClicked.addListener((info) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id || 0, { action: info.menuItemId });
  });
});

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Copy checked magnets",
    id: "copy",
  });
  chrome.contextMenus.create({
    title: "Fetch magnets",
    id: "fetch",
  });
});
