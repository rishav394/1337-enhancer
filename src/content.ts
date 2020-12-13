import { ChromeMessage, ChromeMessageActionType, SortOrder } from "./types";

/**
 * Sort the table on the basis of the row
 * @param columnPosition Row position of the row being sorted
 * @param sortOrder Controls the table sorting order.
 * @param modifier A function which is called upon every row element before comparision
 * @param table The parent enclosing function
 */
function sortTable(
  columnPosition: number,
  sortOrder: SortOrder,
  modifier: (text: string) => string | number | Date = (text: string) => text,
  table: HTMLTableElement | null = document.querySelector<HTMLTableElement>(
    "#mytable"
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
 * Converts string html to a DOM Object
 * @param html String HTML
 */
function htmlToElement(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content;
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
    <input class="torrent-helper" type="checkbox" style="margin-right: -23px; z-index: 3;"/>
    <a class="torrent-helper" style="text-align: end;" href="${magnet}" data-target="${uploader}">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADi0lEQVRoge2Y32tTZxjHP8+JZj+otbALC3Y/OhlD2aCC4LqKDSZNJ0zEjSleDAuy7WYwFOyGG2tadtWyf2E/YFPwct2IJo3EShu2XWwXInQDQfBiXmxs6qhNbR4vcpq8Tc6PnCSuOM8XAud98rzf7/d53+flvBwIESJEiBAtQNpNqPvpYYWdKC8AG+3wMsLvRPhF0txop15bCtAELwOHEV4H+nzSfwWmEc5JhiutardUgCbpBT5DOdoEVwk4wwqfyEWuN+uhqQIUhCQfoYwBj9X8vQjMoywg3LZVOlFeBF4FHq/JvwuMkWVKQIN6CVyAHuBJFvkC4UjNX9MoX2NxXjL86zg3RgdRXqPEMbvdTJzlDselwGIQP4EK0H6eoIOLwCtGeBZhVDL8GIgrTj8Wk8Aew02B28SDFGE1LJjCooNvqZpXhHGyxIKaB5AcBbLsRRivitBPB99ogIVtuADmOAUcMsQ+kAypZvp2FQIqGVIoJ4zwGwxxMgCHP3Qf24hwFYiWA0zJDKOB3PppDPE5VIwXKbFdclzzm7ehIfYNfIra5oUCy5z2NBOjiyjDKD32nBsUuSB5/nadtMyHbGQA2A1EET4GjvtZ890BTbAd4QrVdtsjWeYcc+NsQZhAGGF1t6ooAl9SYkxy3HScn2QvyiV7uEKJHZLjNy9//mdAeMvI+8HVfJKXsPgZ4V0H89ix97D4SePscJTKMItw3h5GbG1P+BegHKwq8JVjSoxulDTwtBGeBSaBSZTLRvwZLL7XOE+5KFY1xNB2gecZ0H1sRdhpD+9SrKzOWkSZqPQ7/AO8KVlya7gSDCOcAzqBXizGgffruCKkuccS5Tf8Lo3RLXn+cPPovQMWfayeE6Ugee7UFRmjC2WkEhCO1poHkBkuAG8boXd0P511eWluQeW9IkS8L4d+LdRrGFtwzIiSoHptnpcMaTcyyfKdYS7KPeLOiYZWhOe9DHoXIGtW6C/HHOVZY1Tw5Cvnzxv8z7lk/Vl5KtXvkgm/AqLG87JLzibjua7FHBRvGaPNLllLRn7t7bWG7iFHWMB6IyxgvfHQF9DYdRpAiWmSlFO8afU2cDZeAAyiDAbI/084H6EWgksI+bpoebubXcWWORsvQMhLpr5fNUmq6TZoA+cj1EJKQoccLlZqfJgKijZwBjkDA/avnWiZ83/eQiVmkAAfW0vOXyweOGeIECFChGgW9wG98vQ9dLt91QAAAABJRU5ErkJggg==" style="width: 40%;height: 40%;" />
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
 * Sorts the table on Seedr column
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
 * Sorts the table on Leecher column
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
  allInputHelpers.forEach((elememnt) => (elememnt.checked = checked));
}

/**
 * Renders the basic blueprint for the Magnet row in the table
 */
function insertMagnetRows() {
  document.querySelectorAll("th.coll-1.name").forEach((node) => {
    const headerCheckboxHelper = document.createElement("th");
    headerCheckboxHelper.classList.add("coll-2");
    headerCheckboxHelper.innerHTML = `<input class="torrent-helper-all" type="checkbox" style="margin-right: 7px;" />mg`;
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
 * Entry function
 */
function main() {
  document
    .querySelector(".table-list.table.table-responsive.table-striped")
    ?.setAttribute("id", "mytable");

  document
    .querySelectorAll<HTMLTableHeaderCellElement>("th.coll-2")
    .forEach((element) => {
      element.style.cursor = "pointer";
      element.addEventListener("click", sortTableViaSeeder);
    });

  document
    .querySelectorAll<HTMLTableHeaderCellElement>("th.coll-3")
    .forEach((element) => {
      element.style.cursor = "pointer";
      element.addEventListener("click", sortTableViaLeechers);
    });

  document
    .querySelectorAll<HTMLTableHeaderCellElement>("th.coll-5")
    .forEach((element) => {
      element.style.cursor = "pointer";
      element.addEventListener("click", sortTableViaUploader);
    });

  document
    .querySelectorAll<HTMLTableHeaderCellElement>("th.coll-4")
    .forEach((element) => {
      element.style.cursor = "pointer";
      element.addEventListener("click", sortTableViaSize);
    });
}

/**
 * Copies text to the clipboard
 * @param text Text to copy
 */
function copyTextToClipboard(text: string) {
  const copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

chrome.runtime.onMessage.addListener((msg: ChromeMessage) => {
  let copytext = "";

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
          copytext += allLinks[key].href + "\n";
        }
      });
      copyTextToClipboard(copytext);
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
