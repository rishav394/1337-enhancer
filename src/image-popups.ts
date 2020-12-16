import { Features, OptionTypes } from "./types";
import { htmlToElement } from "./util";

let thatTimeout: number;
let popupIndexLocation: string;
let popupWidth: number;

chrome.storage.sync.get((storageItems) => {
  const items = storageItems as OptionTypes;
  popupIndexLocation = items[Features.POPUP_IMAGE_INDEX];
  popupWidth = items[Features.POPUP_WIDTH];
});

function getImage(element: Element | null) {
  if (!element) {
    return undefined;
  }
  const imageLinks = element.querySelectorAll<HTMLImageElement>("img");
  if (imageLinks.length <= 1) {
    return imageLinks[0].dataset.original;
  }
  switch (popupIndexLocation) {
    case "first": {
      return imageLinks[0].dataset.original;
    }
    case "last": {
      return imageLinks[imageLinks.length - 1].dataset.original;
    }
    case "middle": {
      return imageLinks[imageLinks.length / 2].dataset.original;
    }
    case "random":
    default: {
      return imageLinks[~~(Math.random() * imageLinks.length)].dataset.original;
    }
  }
}

function popupMountEnterListener(element: HTMLAnchorElement) {
  thatTimeout = setTimeout(() => {
    const popup = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("temp-popup-main-image");
    image.style.width = `${(90 / 100) * popupWidth}px`;
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

function popupMouseLeaveListener() {
  thatTimeout && clearTimeout(thatTimeout);
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
