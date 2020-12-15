import { loadingGif } from "./constants";

let thatTimeout: number;

function popupMountEnterListener(element: HTMLElement) {
  thatTimeout = setTimeout(() => {
    const popup = document.createElement("div");
    const image = document.createElement("img");
    popup.append(image);
    image.classList.add("temp-popup-main-image");
    image.src = loadingGif;
    image.style.height = "70px";
    fetch(
      `https://picsum.photos/${Math.floor(Math.random() * 1000)}/${Math.floor(
        Math.random() * 1000
      )}`
    ).then((value) =>
      value.blob().then((blob) => {
        image.src = window.URL.createObjectURL(blob);
        image.style.height = "100%";
      })
    );
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
    .querySelectorAll<HTMLTableDataCellElement>("td.coll-1 a:not(.icon)")
    .forEach((element) => {
      element.addEventListener("mouseenter", () =>
        popupMountEnterListener(element)
      );
      element.addEventListener("mouseleave", popupMouseLeaveListener);
    });
}
