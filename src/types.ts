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

export enum Features {
  HOVER_POPUP = "HOVER_POPUP",
  SORTING = "SORTING",
}

export type OptionTypes = {
  [Features.HOVER_POPUP]: boolean;
  [Features.SORTING]: boolean;
};

export const defaultSettings: OptionTypes = {
  [Features.HOVER_POPUP]: true,
  [Features.SORTING]: true,
};
