import React from 'react';
import fs from 'fs';
import path from 'path';
import NodeID3 from 'node-id3';

import utils from '../../../utils/utils';
import Textbox from '../../common/Textbox/Textbox';
import tagFields from './tagFields.json'
import './FileOrganizer.css';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PATH':
      return {
        folderPath: action.payload
          ? action.payload.replace(new RegExp('\\\\', 'g'), '/')
          : '',
      };

    default:
      throw new Error(`Unhandled action type - ${action.type}`);
  }
}

function FileOrganizer() {
  const initialState = {
    folderPath: '',
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);

  function onArrangeClickHandler() {
    const { folderPath } = state;
    console.log(folderPath);
    if (!folderPath) return null;

    fs.stat(folderPath, (folderErr, folderStats) => {
      if (folderErr) console.log(folderErr);

      if (folderStats.isDirectory())
        fs.readdir(
          folderPath,
          { encoding: 'utf8', withFileTypes: false },
          (err, files) => {
            if (err) alert(err);

            files.forEach((file) => {
              fs.stat(`${folderPath}/${file}`, (fileErr, fileStat) => {
                if (fileErr) console.log(fileErr);

                if (fileStat.isFile()) {
                  NodeID3.read(`${folderPath}/${file}`, (err, tags) => {
                    if (err) console.log(err);

                    if (tags?.album)
                      utils.createDirectory(`${folderPath}/${tags.album}`);

                    utils.moveFile(
                      `${folderPath}/${file}`,
                      `${folderPath}/${tags.album}`
                    );
                  });
                }
              });
            });
          }
        );
    });
  }

  const { folderPath } = state;

  return (
    <div className="file-organizer">
      <label htmlFor="path">Path</label>
      <Textbox
        id="path"
        value={folderPath}
        onChange={(event) =>
          dispatch({ type: 'UPDATE_PATH', payload: event.target.value })
        }
      />
      <button type="button" onClick={onArrangeClickHandler}>
        Arrange
      </button>
      <select name="tag-fields" id="TagFields">
        {tagFields.data.map((tagField) => (
          <option key={tagField.valueField} value={tagField.valueField}>
            {tagField.textField}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FileOrganizer;
