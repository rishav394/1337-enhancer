/// <reference types="chrome"/>
import axios from "axios";
import $ from "jquery";

function sortTable(pos: number) {
  var rows = $("#mytable tbody tr").get();

  rows.sort(function (a, b) {
    var A = Number($(a).children("td").eq(pos).text());
    var B = Number($(b).children("td").eq(pos).text());

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

function sortTableUploader(pos: number) {
  var rows = $("#mytable tbody tr").get();
  rows.sort(function (a, b) {
    var A = $(a).children("td").eq(pos).text();
    var B = $(b).children("td").eq(pos).text();

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

function parseDom(data: string, index: number) {
  var element = ($(data).find(
    "a[href^=magnet]"
  )[0] as any) as HTMLAnchorElement;
  var magnet = element.href;
  $($("td.coll-1")[index]).append(
    `
    <div style="display: flex;">
    <input class="torrent-helper" type="checkbox"/>
    <a class="torrent-helper" style="text-align: end;" href="${magnet}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADi0lEQVRoge2Y32tTZxjHP8+JZj+otbALC3Y/OhlD2aCC4LqKDSZNJ0zEjSleDAuy7WYwFOyGG2tadtWyf2E/YFPwct2IJo3EShu2XWwXInQDQfBiXmxs6qhNbR4vcpq8Tc6PnCSuOM8XAud98rzf7/d53+flvBwIESJEiBAtQNpNqPvpYYWdKC8AG+3wMsLvRPhF0txop15bCtAELwOHEV4H+nzSfwWmEc5JhiutardUgCbpBT5DOdoEVwk4wwqfyEWuN+uhqQIUhCQfoYwBj9X8vQjMoywg3LZVOlFeBF4FHq/JvwuMkWVKQIN6CVyAHuBJFvkC4UjNX9MoX2NxXjL86zg3RgdRXqPEMbvdTJzlDselwGIQP4EK0H6eoIOLwCtGeBZhVDL8GIgrTj8Wk8Aew02B28SDFGE1LJjCooNvqZpXhHGyxIKaB5AcBbLsRRivitBPB99ogIVtuADmOAUcMsQ+kAypZvp2FQIqGVIoJ4zwGwxxMgCHP3Qf24hwFYiWA0zJDKOB3PppDPE5VIwXKbFdclzzm7ehIfYNfIra5oUCy5z2NBOjiyjDKD32nBsUuSB5/nadtMyHbGQA2A1EET4GjvtZ890BTbAd4QrVdtsjWeYcc+NsQZhAGGF1t6ooAl9SYkxy3HScn2QvyiV7uEKJHZLjNy9//mdAeMvI+8HVfJKXsPgZ4V0H89ix97D4SePscJTKMItw3h5GbG1P+BegHKwq8JVjSoxulDTwtBGeBSaBSZTLRvwZLL7XOE+5KFY1xNB2gecZ0H1sRdhpD+9SrKzOWkSZqPQ7/AO8KVlya7gSDCOcAzqBXizGgffruCKkuccS5Tf8Lo3RLXn+cPPovQMWfayeE6Ugee7UFRmjC2WkEhCO1poHkBkuAG8boXd0P511eWluQeW9IkS8L4d+LdRrGFtwzIiSoHptnpcMaTcyyfKdYS7KPeLOiYZWhOe9DHoXIGtW6C/HHOVZY1Tw5Cvnzxv8z7lk/Vl5KtXvkgm/AqLG87JLzibjua7FHBRvGaPNLllLRn7t7bWG7iFHWMB6IyxgvfHQF9DYdRpAiWmSlFO8afU2cDZeAAyiDAbI/084H6EWgksI+bpoebubXcWWORsvQMhLpr5fNUmq6TZoA+cj1EJKQoccLlZqfJgKijZwBjkDA/avnWiZ83/eQiVmkAAfW0vOXyweOGeIECFChGgW9wG98vQ9dLt91QAAAABJRU5ErkJggg==" style="width: 50%;height: 50%;" /></a>
    </div>
    `
  );
}

function fetchMagnets() {
  var links = $("td.coll-1 a:not([class])") as JQuery<HTMLAnchorElement>;

  links.each((index, link) => {
    axios
      .get(link.href)
      .then((data: any) => {
        parseDom(data.data, index);
      })
      .catch((err: any) => console.log(err));
  });
}

function main() {
  var table = $(".table-list.table.table-responsive.table-striped");
  table.attr("id", "mytable");

  $(".coll-2").click(function () {
    sortTable(1);
  });
  $(".coll-3").click(function () {
    sortTable(2);
  });
  $(".coll-5").click(function () {
    sortTableUploader(5);
  });

  $("td.coll-1").css({
    "flex- direction": "row",
    display: "flex",
    flex: 1,
    "justify-content": "space-between",
    width: "100%",
  });

  $("th.coll-1").css({
    "flex- direction": "row",
    display: "flex",
    flex: 1,
    "justify-content": "space-between",
    width: "100%",
  });

  $("th.coll-1").append(`<input class="torrent-helper-all" type="checkbox""/>`);
  $(".torrent-helper-all").on("click", () => {
    const checked = ($(".torrent-helper-all")[0] as HTMLInputElement).checked;
    if (checked) {
      $("input.torrent-helper").attr("checked", "true");
    } else {
      $("input.torrent-helper").removeAttr("checked");
    }
  });

  // fetchMagnets();
}

function copyTextToClipboard(text: string) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

chrome.runtime.onMessage.addListener((msg) => {
  let copytext = "";

  if (msg.action === "copy") {
    const allLinks = document.querySelectorAll(`a.torrent-helper`);
    const allInputs = document.querySelectorAll(`input.torrent-helper`);
    console.log(allInputs.length);
    allInputs.forEach((value, key) => {
      if ((value as HTMLInputElement).checked) {
        copytext += (allLinks[key] as HTMLAnchorElement).href + "\n";
      }
    });
    copyTextToClipboard(copytext);
  } else if (msg.action === "fetch") {
    fetchMagnets();
  }

  return true;
});

$(document).ready(main);
