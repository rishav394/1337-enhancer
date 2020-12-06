export enum ChromeMessageActionType {
  "FETCH_MAGNETS" = "FETCH_MAGNETS",
  "COPY_SELECTED" = "COPY_SELECTED",
  "SELECT_USER_TORRENTS" = "SELECT_USER_TORRENTS",
}

export type ChromeMessage = {
  action: ChromeMessageActionType;
  info?: string;
};
