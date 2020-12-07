import $ from "jquery";
import { ChromeMessage, ChromeMessageActionType } from "./types";

/**
 * Sort the table on the basis of the row
 * @param rowPosition Row position of the row being sorted
 */
function sortTable(rowPosition: number) {
  const rows = $("#mytable tbody tr").get();

  rows.sort(function (a, b) {
    const A = Number($(a).children("td").eq(rowPosition).text());
    const B = Number($(b).children("td").eq(rowPosition).text());

    if (A < B) {
      return 1;
    }
    if (A > B) {
      return -1;
    }
    return 0;
  });

  $.each(rows, function (_index, row) {
    $("#mytable").children("tbody").append(row);
  });
}

/**
 * Sort the table on the basis of the uploader name
 */
function sortTableUploader() {
  const pos = 5;
  const rows = $("#mytable tbody tr").get();
  rows.sort(function (a, b) {
    const A = $(a).children("td").eq(pos).text();
    const B = $(b).children("td").eq(pos).text();

    if (A < B) {
      return 1;
    }
    if (A > B) {
      return -1;
    }
    return 0;
  });

  $.each(rows, function (_index, row) {
    $("#mytable").children("tbody").append(row);
  });
}

/**
 * Renders the magnet icon and the checkbox in the table right next to the name column
 * @param html The html response from the link
 * @param index The index of the link the response belongs to.
 * Used to identify the correct td to place the magnet into
 */
function renderMagnetInDom(html: string, index: number) {
  const uploaderElement = $(html).find<HTMLAnchorElement>(
    "a[href^=\\/user]"
  )[0];
  const magnetElement = $(html).find<HTMLAnchorElement>("a[href^=magnet]")[0];
  const magnet = magnetElement.href;
  const uploader = uploaderElement.text;
  $($("td.torrent-helper-td")[index]).html(
    `
    <div style="display: flex;">
    <input class="torrent-helper" type="checkbox" style="margin-right: -23px; z-index: 3;"/>
    <a class="torrent-helper" style="text-align: end;" href="${magnet}" data-target="${uploader}">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADi0lEQVRoge2Y32tTZxjHP8+JZj+otbALC3Y/OhlD2aCC4LqKDSZNJ0zEjSleDAuy7WYwFOyGG2tadtWyf2E/YFPwct2IJo3EShu2XWwXInQDQfBiXmxs6qhNbR4vcpq8Tc6PnCSuOM8XAud98rzf7/d53+flvBwIESJEiBAtQNpNqPvpYYWdKC8AG+3wMsLvRPhF0txop15bCtAELwOHEV4H+nzSfwWmEc5JhiutardUgCbpBT5DOdoEVwk4wwqfyEWuN+uhqQIUhCQfoYwBj9X8vQjMoywg3LZVOlFeBF4FHq/JvwuMkWVKQIN6CVyAHuBJFvkC4UjNX9MoX2NxXjL86zg3RgdRXqPEMbvdTJzlDselwGIQP4EK0H6eoIOLwCtGeBZhVDL8GIgrTj8Wk8Aew02B28SDFGE1LJjCooNvqZpXhHGyxIKaB5AcBbLsRRivitBPB99ogIVtuADmOAUcMsQ+kAypZvp2FQIqGVIoJ4zwGwxxMgCHP3Qf24hwFYiWA0zJDKOB3PppDPE5VIwXKbFdclzzm7ehIfYNfIra5oUCy5z2NBOjiyjDKD32nBsUuSB5/nadtMyHbGQA2A1EET4GjvtZ890BTbAd4QrVdtsjWeYcc+NsQZhAGGF1t6ooAl9SYkxy3HScn2QvyiV7uEKJHZLjNy9//mdAeMvI+8HVfJKXsPgZ4V0H89ix97D4SePscJTKMItw3h5GbG1P+BegHKwq8JVjSoxulDTwtBGeBSaBSZTLRvwZLL7XOE+5KFY1xNB2gecZ0H1sRdhpD+9SrKzOWkSZqPQ7/AO8KVlya7gSDCOcAzqBXizGgffruCKkuccS5Tf8Lo3RLXn+cPPovQMWfayeE6Ugee7UFRmjC2WkEhCO1poHkBkuAG8boXd0P511eWluQeW9IkS8L4d+LdRrGFtwzIiSoHptnpcMaTcyyfKdYS7KPeLOiYZWhOe9DHoXIGtW6C/HHOVZY1Tw5Cvnzxv8z7lk/Vl5KtXvkgm/AqLG87JLzibjua7FHBRvGaPNLllLRn7t7bWG7iFHWMB6IyxgvfHQF9DYdRpAiWmSlFO8afU2cDZeAAyiDAbI/084H6EWgksI+bpoebubXcWWORsvQMhLpr5fNUmq6TZoA+cj1EJKQoccLlZqfJgKijZwBjkDA/avnWiZ83/eQiVmkAAfW0vOXyweOGeIECFChGgW9wG98vQ9dLt91QAAAABJRU5ErkJggg==" style="width: 40%;height: 40%;" />
    </a>
    </div>
    `
  );
}

/**
 * This function fetches magnets from the links and passes it down for rendering in the DOM
 */
function fetchMagnets() {
  const links = $<HTMLAnchorElement>("td.coll-1 a:not([class])");

  links.each((index, link) => {
    fetch(link.href).then(async (response) =>
      renderMagnetInDom(await response.text(), index)
    );
  });
}

/**
 * Sorts the table on Seedr column
 */
function sortSeederTable() {
  let pos = 1;
  $("th").each((index, th) => {
    if (th.classList.contains("coll-2")) {
      pos = index;
    }
  });
  sortTable(pos);
}

/**
 * Sorts the table on Leecher column
 */
function sortLeechTable() {
  let pos = 2;
  $("th").each((index, th) => {
    if (th.classList.contains("coll-3")) {
      pos = index;
    }
  });
  sortTable(pos);
}

/**
 * Selects or deselects all checkboxes for torrent selection
 */
function toggleCheckedTorrents() {
  const checked = $<HTMLInputElement>(".torrent-helper-all")[0].checked;
  const allInputHelpers = document.querySelectorAll<HTMLInputElement>(
    "input.torrent-helper"
  );
  allInputHelpers.forEach((elememnt) => (elememnt.checked = checked));
}

/**
 * Renders the basic blueprint for the Magnet row in the table
 */
function insertMagnetRows() {
  $("th.coll-1.name").after(
    `<th class="coll-2">
    <input class="torrent-helper-all" type="checkbox" style="margin-right: 7px;" />mg
    </th>`
  );
  $("td.coll-1.name").after(`<td class="coll-2 torrent-helper-td"></td>`);
  $(".torrent-helper-all").on("click", toggleCheckedTorrents);
}

/**
 * Entry function
 */
function main() {
  $(".table-list.table.table-responsive.table-striped").attr("id", "mytable");
  $("th.coll-2").on("click", sortSeederTable);
  $("th.coll-3").on("click", sortLeechTable);
  $("th.coll-5").on("click", sortTableUploader);
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
        const allInputs = $<HTMLInputElement>("input.torrent-helper");
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

$(main);
