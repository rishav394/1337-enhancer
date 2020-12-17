import { defaultSettings } from "./constants";
import "./options-styles.scss";
import { OptionKeys } from "./types";

function restore_options() {
  chrome.storage.sync.get(defaultSettings, (items) => {
    Object.keys(items).forEach((option) => {
      const element = document.getElementById(
        option
      ) as HTMLInputElement | null;
      if (element) {
        if (element.type === "checkbox") {
          // It is a checkbox. Changes `checked`
          element.checked = items[option];
        } else {
          element.value = items[option];
        }
      }
    });
  });
}

function save_options() {
  const finalSettings: { [option: string]: any } = {};

  Object.values(OptionKeys).forEach((option) => {
    const element = document.getElementById(option) as HTMLInputElement | null;
    if (element) {
      if (element.type === "checkbox") {
        finalSettings[option] = element.checked;
      } else {
        finalSettings[option] = element.value;
      }
    }
  });

  chrome.storage.sync.set(finalSettings, () => {
    var status = document.getElementById("status");
    if (status) {
      status.textContent = "Options saved.";
      setTimeout(() => {
        window.close();
      }, 1200);
    }
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save")?.addEventListener("click", save_options);
