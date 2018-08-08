import { TOGGLE_MENU, HIDE_MENU, SHOW_MENU } from "./types.js";

export const showMenu = () => dispatch => {
    dispatch({
      type: SHOW_MENU
    });
};

export const hideMenu = () => dispatch => {
  dispatch({
    type: HIDE_MENU
  })
};

export const toggleMenu = () => dispatch => {
  dispatch({
    type: TOGGLE_MENU
  })
};