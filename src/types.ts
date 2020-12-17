export enum ChromeMessageActionType {
  "FETCH_MAGNETS" = "FETCH_MAGNETS",
  "COPY_SELECTED" = "COPY_SELECTED",
  "SELECT_USER_TORRENTS" = "SELECT_USER_TORRENTS",
}

export type ChromeMessage = {
  action: ChromeMessageActionType;
  info?: string;
};

export enum SortOrder {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

export enum OptionKeys {
  HOVER_POPUP = "HOVER_POPUP",
  SORTING = "SORTING",
  POPUP_IMAGE_INDEX = "POPUP_IMAGE_INDEX",
  POPUP_WIDTH = "POPUP_WIDTH",
}

export enum PopupImageIndexType {
  "FIRST" = "FIRST",
  "LAST" = "LAST",
  "MIDDLE" = "MIDDLE",
  "RANDOM" = "RANDOM",
}

export type OptionTypes = {
  [OptionKeys.HOVER_POPUP]: boolean;
  [OptionKeys.SORTING]: boolean;
  [OptionKeys.POPUP_IMAGE_INDEX]: PopupImageIndexType;
  [OptionKeys.POPUP_WIDTH]: number;
};
