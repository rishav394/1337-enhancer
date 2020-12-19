import { defaultSettings } from "./constants";
import { ChromeMessageActionType } from "./types";

const documentUrlPatterns = [
  "*://1337.root.yt/*",
  "*://1337x.to/*",
  "*://1337x.st/*",
  "*://x1337x.ws/*",
  "*://x1337x.eu/*",
  "*://x1337x.se/*",
  "*://1337x.is/*",
  "*://1337x.gd/*",
];

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
  chrome.storage.sync.get((items) => {
    // Extension installed. Maybe this check is redundant and I know no settings are saved.
    // Need confirmation. TODO:: Read up on if onInstalled is really only triggered on installed
    if (
      !items ||
      (Object.keys(items).length === 0 && items.constructor === Object)
    ) {
      // Nothing is set. Set now.
      chrome.storage.sync.set(defaultSettings, () => {
        console.log("Default settings set");
      });
    }
  });

  chrome.contextMenus.create({
    title: "Fetch magnets",
    id: ChromeMessageActionType.FETCH_MAGNETS,
    documentUrlPatterns,
  });
  chrome.contextMenus.create({
    title: "Copy checked magnets",
    id: ChromeMessageActionType.COPY_SELECTED,
    documentUrlPatterns,
  });
  chrome.contextMenus.create({
    title: "Select magnets from %s",
    id: ChromeMessageActionType.SELECT_USER_TORRENTS,
    contexts: ["selection"],
    documentUrlPatterns,
  });
});
