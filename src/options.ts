import { defaultSettings, textForOptions } from "./constants";
import "./options-styles.scss";
import { OptionKeys, PopupImageIndexType } from "./types";

/**
 * Restores saves settings to the user form
 */
function restore_options() {
  chrome.storage.sync.get((items) => {
    // background script makes sure this doesn't happen but ¯\_(ツ)_/¯
    if (
      !items ||
      (Object.keys(items).length === 0 && items.constructor === Object)
    ) {
      saveSettings(defaultSettings, "", reset_options);
    } else {
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
    }
  });
}

/**
 * Saves settings to chrome
 * @param settings The settings to save
 * @param statusText The status text to show after saving settings
 * @param closeWindow
 */
function saveSettings(
  settings: any,
  statusText: string,
  callback?: () => void,
  closeWindow = true
) {
  chrome.storage.sync.set(settings, () => {
    callback && callback();
    const status = document.getElementById("status");
    if (status) {
      status.textContent = statusText;
      closeWindow &&
        setTimeout(() => {
          window.close();
        }, 1200);
    }
  });
}

/**
 * Resets user options to default
 */
function reset_options() {
  saveSettings(defaultSettings, "Options reset.", () => {
    restore_options();
  });
}

/**
 * Saves user settings from the form
 */
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

  saveSettings(finalSettings, "Options saved.");
}

/**
 * Renders the respective body in the DOM
 * @param optionKey Settings name
 */
function renderBody(optionKey: OptionKeys) {
  const container = document.getElementById("root") as HTMLDivElement | null;
  if (!container) {
    return;
  }
  const row = document.createElement("div");
  row.classList.add("row");
  switch (optionKey) {
    case OptionKeys.SORTING:
    case OptionKeys.HOVER_POPUP: {
      const heading = document.createElement("div");
      heading.classList.add("heading");
      heading.textContent = textForOptions[optionKey][0];
      row.append(heading);

      const label = document.createElement("label");
      label.classList.add("switch");
      const input = document.createElement("input");
      input.id = optionKey;
      input.type = "checkbox";
      const span = document.createElement("span");
      span.classList.add("slider", "round");
      label.append(input, span);
      row.append(label);

      break;
    }
    case OptionKeys.POPUP_IMAGE_INDEX: {
      const heading = document.createElement("div");
      heading.classList.add("heading");
      heading.textContent = textForOptions[optionKey][0];
      row.append(heading);

      const select = document.createElement("select");
      select.id = optionKey;
      select.classList.add("custom-select");
      Object.values(PopupImageIndexType).forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type;
        select.append(option);
      });
      row.append(select);

      break;
    }
    case OptionKeys.POPUP_WIDTH: {
      const heading = document.createElement("div");
      heading.classList.add("heading");
      heading.textContent = textForOptions[optionKey][0];
      row.append(heading);

      const div = document.createElement("div");
      const input = document.createElement("input");
      input.id = optionKey;
      input.type = "number";
      const span = document.createElement("span");
      span.textContent = "px";
      div.append(input, span);
      row.append(div);

      break;
    }
    default: {
    }
  }
  container.append(row);
}

/**
 * Main entry function
 */
function main() {
  Object.values(OptionKeys).forEach(renderBody);
  restore_options();
}

document.addEventListener("DOMContentLoaded", main);
document.getElementById("save")?.addEventListener("click", save_options);
document.getElementById("reset")?.addEventListener("click", reset_options);
