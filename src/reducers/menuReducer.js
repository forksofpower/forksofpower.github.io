import { TOGGLE_MENU, HIDE_MENU, SHOW_MENU } from "../actions/types";

const initialState = {
  visible: true
};


export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_MENU:
      return {
        ...state,
        visible: true
      };
    case HIDE_MENU:
      return {
        ...state,
        visible: false
      };
    case TOGGLE_MENU:
      return {
        ...state,
        visible: !state.visible
      };
    default:
      return state;
  }
}