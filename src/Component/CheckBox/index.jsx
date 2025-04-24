import React from 'react'

function CheckBox({ Label, onChange, cname, cvalue, isChecked }) {
  return (
    <div className="flex-wrap mt-1">
      <label className="text-pos-cen">
        <input
          name={cname}
          value={cvalue}
          checked={isChecked}
          type="checkbox"
          placeholder={Label}
          onChange={onChange}
          className="mt-2"
        />
        <span className="small">{` ${Label}`}</span>
      </label>
    </div>
  );
}

export default CheckBox