import loadingImage from "./assets/loading.svg";
import { defaultSettings } from "./constants";
import { OptionKeys, OptionTypes, PopupImageIndexType } from "./types";
import { htmlToElement } from "./util";

let popupRenderTimeout: number;
let popupIndexLocation: PopupImageIndexType;
let popupWidth: number;

chrome.storage.sync.get((storageItems) => {
  const items = storageItems as OptionTypes;
  popupIndexLocation = items[OptionKeys.POPUP_IMAGE_INDEX];
  popupWidth = items[OptionKeys.POPUP_WIDTH];
});

/**
 * Returns the image from screenshots from the torrent
 * @param element The torrent description body where images will be looked up
 */
function getImage(element: Element | null) {
  if (!element) {
    return undefined;
  }
  const imageLinks = element.querySelectorAll<HTMLImageElement>("img");
  if (imageLinks.length <= 1) {
    return imageLinks[0].dataset.original;
  }

  return getImageForIndex(popupIndexLocation);

  /**
   * Returns the src for the selected image
   * @param popupIndexLocation The user index of the image to choose from
   */
  function getImageForIndex(
    popupIndexLocation: PopupImageIndexType
  ): string | undefined {
    switch (popupIndexLocation) {
      case PopupImageIndexType.FIRST: {
        return imageLinks[0].dataset.original;
      }
      case PopupImageIndexType.LAST: {
        return imageLinks[imageLinks.length - 1].dataset.original;
      }
      case PopupImageIndexType.MIDDLE: {
        return imageLinks[imageLinks.length / 2].dataset.original;
      }
      case PopupImageIndexType.RANDOM: {
        return imageLinks[~~(Math.random() * imageLinks.length)].dataset
          .original;
      }
      default: {
        chrome.storage.sync.set({
          [OptionKeys.POPUP_IMAGE_INDEX]:
            defaultSettings[OptionKeys.POPUP_IMAGE_INDEX],
        });
        return getImageForIndex(defaultSettings[OptionKeys.POPUP_IMAGE_INDEX]);
      }
    }
  }
}

/**
 * Mouse enter listener
 * @param element The anchor tag to bind the event
 */
function popupMountEnterListener(element: HTMLAnchorElement) {
  popupRenderTimeout = setTimeout(() => {
    const popup = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("temp-popup-main-image");
    const loadingSource = chrome.extension.getURL("dist/" + loadingImage);
    image.style.backgroundImage = `url("${loadingSource}")`;
    image.style.width = `${(93 / 100) * popupWidth}px`;
    popup.append(image);
    fetch(element.href)
      .then((response) =>
        response.text().then((value) => {
          const bestImage = getImage(
            htmlToElement(value).querySelector("div.tab-pane.active")
          );
          if (bestImage) {
            image.onload = () => {
              image.style.height = "100%";
            };
            image.src = bestImage;
            image.style.background = "none";
            image.onerror = popupMouseLeaveListener;
          } else {
            popupMouseLeaveListener();
          }
        })
      )
      .catch(popupMouseLeaveListener);

    popup.classList.add("temp-popup");
    popup.style.width = `${popupWidth}px`;
    element.parentNode?.append(popup);
    let steps = 0;
    const timer = setInterval(function () {
      steps++;
      popup.style.opacity = (0.1 * steps).toString();
      if (steps >= 10) {
        clearInterval(timer);
      }
    }, 17);
  }, 100);
}

/**
 * Mouse leave listener
 */
function popupMouseLeaveListener() {
  popupRenderTimeout && clearTimeout(popupRenderTimeout);
  document.querySelectorAll<HTMLDivElement>(".temp-popup").forEach((popup) => {
    let steps = 10;
    const timer = setInterval(function () {
      steps--;
      popup.style.opacity = (0.1 * steps).toString();
      if (steps <= 0) {
        clearInterval(timer);
        popup.remove();
      }
    }, 10);
  });
}

/**
 * Main function
 */
export function initHoverPopups() {
  document
    .querySelectorAll<HTMLAnchorElement>("td.coll-1 a:not(.icon)")
    .forEach((element) => {
      element.addEventListener("mouseenter", () =>
        popupMountEnterListener(element)
      );
      element.addEventListener("mouseleave", popupMouseLeaveListener);
    });
}
