import { htmlToElement } from "./util";

let thatTimeout: number;

function getLastImage(element: Element | null) {
  if (!element) {
    return undefined;
  }
  const imageLinks = element.querySelectorAll<HTMLImageElement>("img");
  // TODO:: This needs better logic
  return imageLinks[imageLinks.length - 1].dataset.original;
}

function popupMountEnterListener(element: HTMLAnchorElement) {
  thatTimeout = setTimeout(() => {
    const popup = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("temp-popup-main-image");
    popup.append(image);
    fetch(element.href)
      .then((response) =>
        response.text().then((value) => {
          const lastImage = getLastImage(
            htmlToElement(value).querySelector("div.tab-pane.active")
          );
          if (lastImage) {
            image.onload = () => {
              image.style.height = "100%";
            };
            image.src = lastImage;
            image.onerror = popupMouseLeaveListener;
          } else {
            popupMouseLeaveListener();
          }
        })
      )
      .catch(popupMouseLeaveListener);

    popup.classList.add("temp-popup");
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
