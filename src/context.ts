/// <reference types="chrome"/>

import { ChromeMessageActionType } from "./types";

chrome.contextMenus.onClicked.addListener((info) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id || 0, {
      action: info.menuItemId,
      info: info.selectionText,
    });
  });
});

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Fetch magnets",
    id: ChromeMessageActionType.FETCH_MAGNETS,
  });
  chrome.contextMenus.create({
    title: "Copy checked magnets",
    id: ChromeMessageActionType.COPY_SELECTED,
  });
  chrome.contextMenus.create({
    title: "Select magnets from %s",
    id: ChromeMessageActionType.SELECT_USER_TORRENTS,
    contexts: ["selection"],
  });
});
