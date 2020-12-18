import { OptionKeys, OptionTypes, PopupImageIndexType } from "./types";

export const defaultSettings: OptionTypes = {
  [OptionKeys.HOVER_POPUP]: true,
  [OptionKeys.SORTING]: true,
  [OptionKeys.POPUP_IMAGE_INDEX]: PopupImageIndexType.FIRST,
  [OptionKeys.POPUP_WIDTH]: 300,
};

export const textForOptions: { [key: string]: string[] } = {
  [OptionKeys.HOVER_POPUP]: ["Enable popups on hover"],
  [OptionKeys.SORTING]: ["Enable sorting"],
  [OptionKeys.POPUP_IMAGE_INDEX]: ["Hover popup image index"],
  [OptionKeys.POPUP_WIDTH]: ["Popup width"],
};
