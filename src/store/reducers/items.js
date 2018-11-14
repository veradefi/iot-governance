import React from 'react';
import * as actionTypes from "../actions/actionTypes";

const initialState = {
    posts: undefined,
    current: -1,
    metaData: {},
    dialogShowing:false,
    dialogContent: (<div></div>),
    dialogTitle: null,
    dialogSize: 'large',

};


const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.SET_CURRENT:
      return {
        ...state,
        current: action.current
      };
    case actionTypes.SET_POSTS:

        console.log('initial items');
        console.log(action.posts);
        return {
            ...state,
            posts: action.posts
      };
    case actionTypes.SET_METAINFO:

      console.log('Received MetaData');
      console.log(action.metaData);
      return {
          ...state,
          metaData: action.metaData
    };
    case actionTypes.VIEW_MEDIA:

    console.log('view_media');
    console.log(action.item);
    return {
        ...state,
        media_item:action.item,
        media_info:action.info
    };
    case actionTypes.VIEW_MAP:

        console.log('view map');
        console.log(action.item);
        return {
            ...state,
            map_item:action.item,
            map_info:action.info

      };
      case actionTypes.VIEW_NODE:

        console.log('view node');
        console.log(action.item);
        return {
            ...state,
            node_item:action.item
      };

    case actionTypes.SHOW_DIALOG:

      console.log('show dialog');
      return {
          ...state,
          dialogShowing:true,
          dialogContent:action.content,
          dialogTitle:null,
          dialogSize:action.dialogType
    };
    case actionTypes.CLOSE_DIALOG:

    console.log('close dialog');
    return {
        ...state,
        dialogShowing:false,
        dialogContent: (<div></div>),
        dialogTitle:null
    };

    case actionTypes.SHOW_DIALOG2:

      console.log('show dialog2');
      return {
          ...state,
          dialogShowing2:true,
          dialogContent2:action.content,
          dialogTitle2:null,
          dialogSize2:action.dialogType
    };
    case actionTypes.CLOSE_DIALOG2:

    console.log('close dialog2');
    return {
        ...state,
        dialogShowing2:false,
        dialogContent2: (<div></div>),
        dialogTitle2:null
    };
    default:
      return state;
  }
};


export default reducer;
