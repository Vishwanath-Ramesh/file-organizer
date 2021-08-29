import React from 'react';

function Textbox({ id, name, value, className, onChange }) {
  return (
    <input
      type="text"
      name={name || id}
      id={id}
      defaultValue={value}
      onChange={onChange}
    />
  );
}

export default Textbox;
