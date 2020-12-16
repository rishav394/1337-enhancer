import "./options-styles.scss";
import { defaultSettings, Features } from "./types";

function restore_options() {
  chrome.storage.sync.get(defaultSettings, (items) => {
    Object.keys(items).forEach((option) => {
      const element = document.getElementById(option);
      if (element) {
        switch (typeof items[option]) {
          case "boolean":
            (element as HTMLInputElement).checked = items[option];
            break;
          default:
            break;
        }
      }
    });
  });
}

function save_options() {
  const finalSettings: { [option: string]: any } = {};

  Object.values(Features).forEach((option) => {
    const element = document.getElementById(option);
    if (element) {
      switch (typeof defaultSettings[option]) {
        case "boolean":
          finalSettings[option] = (element as HTMLInputElement).checked;
          break;
        default:
          break;
      }
    }
  });

  chrome.storage.sync.set(finalSettings, () => {
    var status = document.getElementById("status");
    if (status) {
      status.textContent = "Options saved.";
      setTimeout(function () {
        if (status) {
          status.innerHTML = "&nbsp;";
        }
      }, 750);
    }
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save")?.addEventListener("click", save_options);
