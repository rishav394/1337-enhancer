import { magnetBase64 } from "./constants";
import "./content-styles.scss";
import { initHoverPopups } from "./image-popups";
import {
  ChromeMessage,
  ChromeMessageActionType,
  Features,
  OptionTypes,
  SortOrder,
} from "./types";
import { copyTextToClipboard, htmlToElement } from "./util";

/**
 * Sort the table on the basis of the row
 * @param columnPosition Row position of the row being sorted
 * @param sortOrder Controls the table sorting order.
 * @param modifier A function which is called upon every row element before comparison
 * @param table The parent enclosing function
 */
function sortTable(
  columnPosition: number,
  sortOrder: SortOrder,
  modifier: (text: string) => string | number | Date = (text: string) => text,
  table: HTMLTableElement | null = document.querySelector<HTMLTableElement>(
    ".table-list.table.table-responsive.table-striped"
  )
) {
  const tb = table?.tBodies[0];
  if (!tb) {
    return;
  }

  let tr = Array.prototype.slice.call(tb.rows, 0); // put rows into array
  tr = tr.sort(function (a, b) {
    const A = modifier(a.cells[columnPosition].textContent);
    const B = modifier(b.cells[columnPosition].textContent);

    if (A < B) {
      return sortOrder === SortOrder.ASCENDING ? -1 : 1;
    }
    if (A > B) {
      return sortOrder === SortOrder.ASCENDING ? 1 : -1;
    }
    return 0;
  });

  for (let i = 0; i < tr.length; ++i) {
    tb.appendChild(tr[i]);
  }
}

/**
 * Renders the magnet icon and the checkbox in the table right next to the name column
 * @param html The html response from the link
 * @param index The index of the link the response belongs to.
 * Used to identify the correct td to place the magnet into
 */
function renderMagnetInDom(html: string, index: number) {
  const template = htmlToElement(html);
  const uploaderElement = template.querySelector<HTMLAnchorElement>(
    "a[href^=\\/user]"
  );
  const magnetElement = template.querySelector<HTMLAnchorElement>(
    "a[href^=magnet]"
  );
  const magnet = magnetElement?.href;
  const uploader = uploaderElement?.text;
  document.querySelectorAll("td.torrent-helper-td")[index].innerHTML = `
    <div style="display: flex;">
    <input class="torrent-helper" type="checkbox" />
    <a class="torrent-helper" href="${magnet}" data-target="${uploader}">
    <img class="magnet-image" src="${magnetBase64}" />
    </a>
    </div>
    `;
}

/**
 * This function fetches magnets from the links and passes it down for rendering in the DOM
 */
function fetchMagnets() {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    "td.coll-1 a:not([class])"
  );

  links.forEach((link, index) => {
    fetch(link.href).then(async (response) =>
      renderMagnetInDom(await response.text(), index)
    );
  });
}

/**
 * Sort the table on the basis of the uploader name
 */
function sortTableViaUploader(this: HTMLTableHeaderCellElement) {
  let pos = 1;
  this.closest("table")
    ?.querySelectorAll("th")
    .forEach((th, index) => {
      if (th.classList.contains("coll-5")) {
        pos = index;
      }
    });
  sortTable(pos, SortOrder.ASCENDING, undefined, this.closest("table"));
}

function sortTableViaSize(this: HTMLTableHeaderCellElement) {
  enum FileSize {
    KB = "KB",
    MB = "MB",
    GB = "GB",
  }

  const fileSizeModifier = (text: string): string | number => {
    if (text.includes(FileSize.KB)) {
      return parseFloat(text.split(" ")[0].trim());
    }
    if (text.includes(FileSize.MB)) {
      return parseFloat(text.split(" ")[0].trim()) * 1024;
    }
    if (text.includes(FileSize.GB)) {
      return parseFloat(text.split(" ")[0].trim()) * 1024 * 1024;
    }
    return text;
  };

  let pos = 1;
  this.closest("table")
    ?.querySelectorAll("th")
    .forEach((th, index) => {
      if (th.classList.contains("coll-4")) {
        pos = index;
      }
    });

  sortTable(pos, SortOrder.DESCENDING, fileSizeModifier, this.closest("table"));
}

/**
 * Sorts the table on Seeders column
 */
function sortTableViaSeeder(this: HTMLTableHeaderCellElement) {
  let pos = 1;
  this.closest("table")
    ?.querySelectorAll("th")
    .forEach((th, index) => {
      if (th.classList.contains("coll-2")) {
        pos = index;
      }
    });
  sortTable(pos, SortOrder.DESCENDING, parseInt, this.closest("table"));
}

/**
 * Sorts the table on Leechers column
 */
function sortTableViaLeechers(this: HTMLTableHeaderCellElement) {
  let pos = 2;
  this.closest("table")
    ?.querySelectorAll("th")
    .forEach((th, index) => {
      if (th.classList.contains("coll-3")) {
        pos = index;
      }
    });
  sortTable(pos, SortOrder.DESCENDING, parseInt, this.closest("table"));
}

/**
 * Selects or deselects all checkboxes for torrent selection
 */
function toggleCheckedTorrents() {
  const checked = !!document.querySelector<HTMLInputElement>(
    ".torrent-helper-all"
  )?.checked;
  const allInputHelpers = document.querySelectorAll<HTMLInputElement>(
    "input.torrent-helper"
  );
  allInputHelpers.forEach((element) => (element.checked = checked));
}

/**
 * Renders the basic blueprint for the Magnet row in the table
 */
function insertMagnetRows() {
  document.querySelectorAll("th.coll-1.name").forEach((node) => {
    const headerCheckboxHelper = document.createElement("th");
    headerCheckboxHelper.classList.add("coll-2");
    headerCheckboxHelper.innerHTML = `<input class="torrent-helper-all" type="checkbox" />mg`;
    node.after(headerCheckboxHelper);
  });

  document.querySelectorAll("td.coll-1.name").forEach((node) => {
    const tdHelpers = document.createElement("td");
    tdHelpers.classList.add("coll-2", "torrent-helper-td");
    node.after(tdHelpers);
  });

  document
    .querySelectorAll(".torrent-helper-all")
    .forEach((node) => node.addEventListener("click", toggleCheckedTorrents));
}

/**
 * On click event listener adding helper for headers
 * @param selector Css selector for the header
 * @param eventListener The event listener on the header
 */
function addHeaderClickListener(selector: string, eventListener: () => void) {
  document
    .querySelectorAll<HTMLTableHeaderCellElement>(selector)
    .forEach((element) => {
      element.addEventListener("click", eventListener);
    });
}

/**
 * Entry function
 */
function main() {
  chrome.storage.sync.get((storageItems) => {
    const items = storageItems as OptionTypes;
    items[Features.HOVER_POPUP] && initHoverPopups();
    if (items[Features.SORTING]) {
      addHeaderClickListener("th.coll-2", sortTableViaSeeder);
      addHeaderClickListener("th.coll-3", sortTableViaLeechers);
      addHeaderClickListener("th.coll-4", sortTableViaSize);
      addHeaderClickListener("th.coll-5", sortTableViaUploader);
    }
  });
}

chrome.runtime.onMessage.addListener((msg: ChromeMessage) => {
  let copyText = "";

  switch (msg.action) {
    case ChromeMessageActionType.COPY_SELECTED: {
      const allLinks = document.querySelectorAll<HTMLAnchorElement>(
        `a.torrent-helper`
      );
      const allInputs = document.querySelectorAll<HTMLInputElement>(
        `input.torrent-helper`
      );
      allInputs.forEach((value, key) => {
        if (value.checked) {
          copyText += allLinks[key].href + "\n";
        }
      });
      copyTextToClipboard(copyText);
      break;
    }
    case ChromeMessageActionType.FETCH_MAGNETS: {
      insertMagnetRows();
      fetchMagnets();
      break;
    }
    case ChromeMessageActionType.SELECT_USER_TORRENTS: {
      const username = msg.info;
      if (username) {
        const allLinks = document.querySelectorAll<HTMLAnchorElement>(
          `a.torrent-helper`
        );
        const allInputs = document.querySelectorAll<HTMLInputElement>(
          "input.torrent-helper"
        );
        allLinks.forEach((value, key) => {
          const dataTarget = value.getAttribute("data-target");
          if (dataTarget && dataTarget.includes(username)) {
            allInputs[key].checked = true;
          }
        });
      }
      break;
    }
    default:
      break;
  }

  return true;
});

// see if DOM is already available
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // call on next available tick
  setTimeout(main, 1);
} else {
  document.addEventListener("DOMContentLoaded", main);
}
