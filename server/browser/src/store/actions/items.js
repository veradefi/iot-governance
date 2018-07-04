import * as actionTypes from "./actionTypes";



export const setPosts = (posts) => {
  return { type: actionTypes.SET_POSTS, posts };
};

export const setMetaInfo = (metaData) => {
  return { type: actionTypes.SET_METAINFO, metaData };
};

export const setCurrent = (current) => {
    return { type: actionTypes.SET_CURRENT, current };
  };

export const initializePosts = (apiKey) => {
return { type: actionTypes.INITIALIZE_POSTS, apiKey };
};

export const viewNode = (item) => {
  return { type: actionTypes.VIEW_NODE, 
           item 
          };
};


export const viewMedia = (item, info) => {
  return { type: actionTypes.VIEW_MEDIA, 
           item,
           info 
          };
};


export const viewMap = (item, info) => {
  return { 
        type: actionTypes.VIEW_MAP, 
        item, 
        info 
      };
};

export const showDialog = (show, content, dialogType='large') => {
  return { type: actionTypes.SHOW_DIALOG, 
    show, 
    content, 
    dialogType };
};

export const closeDialog = () => {
  return { type: actionTypes.CLOSE_DIALOG,  };
};
