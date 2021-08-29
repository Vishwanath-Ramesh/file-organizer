import React from 'react';
import path from 'path';
import fs from 'fs';

import utils from '../../../utils/utils';
import Textbox from '../../common/Textbox/Textbox';

const SORT_BY = [
  {
    valueField: '0',
    textField: '--Select--',
  },
  {
    valueField: 'datetime',
    textField: 'Datetime',
    cb: utils.sortByDatetime,
  },
  {
    valueField: 'filename',
    textField: 'Filename',
  },
];

function fileRenameReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FOLDERPATH':
      return {
        ...state,
        folderPath: action.payload,
      };
    case 'SET_SORTBY':
      return {
        ...state,
        sortBy: action.payload,
      };
    case 'UPDATE_FILENAME_FORMAT':
      return {
        ...state,
        filenameFormat: action.payload,
      };
    default:
      return state;
  }
}

function FileRename() {
  const initialState = {
    folderPath: '',
    sortBy: '0',
    filenameFormat: '',
  };
  const [state, dispatch] = React.useReducer(fileRenameReducer, initialState);

  function onSortByChangeHandler(event) {
    dispatch({ type: 'SET_SORTBY', payload: event.target.value });
  }

  function onRenameFile(filePath, index) {
    const { filenameFormat } = state;
    const folderPath = path.dirname(filePath);

    if (!state.filenameFormat) return null;
    return utils.renameFile(
      filePath,
      path.join(
        folderPath,
        `${filenameFormat.replaceAll('$', index + 1)}${path.extname(filePath)}`
      )
    );
  }

  function onReadDirSuccess(err, files) {
    files = files.map((file) => path.join(state.folderPath, file));

    const sortByType = SORT_BY.find(
      (sortType) => sortType.valueField === state.sortBy
    );
    if (sortByType.cb && typeof sortByType.cb === 'function')
      files.sort(sortByType.cb).forEach(onRenameFile);
    else files.sort().forEach(onRenameFile);
  }

  function onRenameClickHandler() {
    const { folderPath } = state;
    if (!folderPath) return null;

    return fs.readdir(folderPath, onReadDirSuccess);
  }

  const { folderPath, sortBy, filenameFormat } = state;

  return (
    <div className="filerename">
      <h2>File Rename</h2>
      <div className="filerename__container">
        <Textbox
          id="path"
          className="filerename__path"
          value={folderPath}
          onChange={(event) =>
            dispatch({ type: 'UPDATE_FOLDERPATH', payload: event.target.value })
          }
        />
        <select
          name="sortby"
          id="sortby"
          className="filerename__sortby"
          value={sortBy}
          onChange={onSortByChangeHandler}
        >
          {SORT_BY.map((sortType) => (
            <option key={sortType.valueField} value={sortType.valueField}>
              {sortType.textField}
            </option>
          ))}
        </select>
        <Textbox
          id="filenameformat"
          className="filename__filenameformat"
          value={filenameFormat}
          onChange={(event) =>
            dispatch({
              type: 'UPDATE_FILENAME_FORMAT',
              payload: event.target.value,
            })
          }
        />
        <button type="button" onClick={onRenameClickHandler}>
          Rename
        </button>
      </div>
    </div>
  );
}

export default FileRename;
