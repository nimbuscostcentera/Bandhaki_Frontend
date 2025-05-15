import React, { useState } from "react";
import BongCalender from "../BongCalender";
import InputBox from "../InputBox";
function BongDatePicker({
  startDate,
  endDate,
  handleChange,
  handleClose,
  handleOpenEndDate,
  handleOpenStartDate,
  view1,
  view2,
}) {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="mx-1">
        <InputBox
          Icon={<i className="bi bi-calendar-event"></i>}
          type={"text"}
          placeholder={"Start Date"}
          label={"Start Date"}
          Name={startDate}
          InputStyle={{ padding: "8px 10px", width: "120px" }}
          onChange={() => {
            return;
          }}
          error={false}
          errorMsg={""}
          maxlen={10}
          value={startDate}
          SearchIcon={<i className="bi bi-calendar-event"></i>}
          SearchButton={true}
          SearchHandler={handleOpenStartDate}
          isdisable={false}
          isfrontIconOff={true}
          onFocusChange={() => {
            return;
          }}
        />
      </div>
      <div className="mx-1">
        <InputBox
          Icon={<i className="bi bi-calendar-event"></i>}
          type={"text"}
          placeholder={"End Date"}
          label={"End Date"}
          Name={"EndDate"}
          InputStyle={{ padding: "8px 10px", width: "120px" }}
          onChange={() => {
            return;
          }}
          error={false}
          errorMsg={""}
          maxlen={10}
          value={endDate}
          SearchIcon={<i className="bi bi-calendar-event"></i>}
          SearchButton={true}
          SearchHandler={handleOpenEndDate}
          isdisable={false}
          isfrontIconOff={true}
          onFocusChange={() => {
            return;
          }}
        />
      </div>
      <BongCalender
        key={1}
        view={view1}
        handleSave={(e) => handleChange(e, "StartDate")}
        handleclose={handleClose}
      />
      <BongCalender
        key={2}
        view={view2}
        handleSave={(e) => handleChange(e, "EndDate")}
        handleclose={handleClose}
      />
    </div>
  );
}

export default BongDatePicker;
