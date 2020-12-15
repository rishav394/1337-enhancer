/**
 * Copies text to the clipboard
 * @param text Text to copy
 */
export function copyTextToClipboard(text: string) {
  const copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

/**
 * Converts string html to a DOM Object
 * @param html String HTML
 */
export function htmlToElement(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content;
}
