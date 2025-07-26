import React, { useEffect, useState } from "react";
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
  view2
}) {
  const [error, setError] = useState(false);
  useEffect(() => {
    let sdate=parseInt(startDate?.toString()?.replace(/-/g,""),10);
    let edate = parseInt(endDate?.toString()?.replace(/-/g, ""), 10);
    if(sdate>edate){
      setError(true);
    }
    else {
      setError(false);
    }
  },[startDate,endDate])
  return (
    <div className="d-flex justify-content-center align-items-center mx-1">
      <div className="mr-2">
        <InputBox
          Icon={<i className="bi bi-calendar-event"></i>}
          type={"text"}
          placeholder={"Start Date"}
          label={"Start Date"}
          Name={startDate}
          InputStyle={{ padding: "5px 10px", width: "130px" }}
          onChange={() => {
            return;
          }}
          error={error}
          errorMsg={"Start Date Can not be greater than End Date"}
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
      <div className="ms-2">
        <InputBox
          Icon={<i className="bi bi-calendar-event"></i>}
          type={"text"}
          placeholder={"End Date"}
          label={"End Date"}
          Name={"EndDate"}
          InputStyle={{ padding: "5px 10px", width: "130px" }}
          onChange={() => {
            return;
          }}
          error={error}
          errorMsg={"End Date Can not be Lesser than Start Date"}
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
