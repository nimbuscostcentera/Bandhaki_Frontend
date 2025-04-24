import { useState, useCallback, memo } from "react";
import SelectOption from "../SelectOption";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EstimateTable.css";
import "../Table/table.css";
import { Button } from "react-bootstrap";
import SearchableDropdown from "../SearchableDropDown/index1";
import InputBox from "../InputBox";
import BongCalender from "../BongCalender";

const CellRenderer = memo(
  ({
    col,
    row,
    indexrow,
    handleChange,
    SearchHandler,
    fileInputRefs,
    toaster,
    bongView,
    setBongView,
    CloseBongCal,
    priorityref,
  }) => {
    const handleDateCheck = useCallback(
      (event) => {
        const regex = /^(?:14|15)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[02])$/;
        if (regex.test(event.target.value) == false) {
          toaster.error(
            "Invalid Date Format. It should be YYYY-MM-DD. Also make sure day and month number contain 0 if less than 10."
          );
        }
      },
      [indexrow, col.key, handleChange, toaster]
    );

    const handleBongSave = useCallback(
      (bengalidate) => {
        const obj = {
          target: {
            value: bengalidate,
            name: "date",
          },
        };
        handleChange(indexrow, col.key, obj);
        CloseBongCal();
      },
      [indexrow, col.key, handleChange, CloseBongCal]
    );

    // Checkbox
    if (col?.isCheckbox) {
      return (
        <div className="table-input-wrapper mx-5">
          <input
            type="checkbox"
            name={col.key}
            checked={!!row[col.key]}
            onChange={(event) =>
              handleChange(indexrow, col.key, event.target.checked)
            }
          />
        </div>
      );
    }

    // Select Option
    if (col?.SelectOption) {
      return (
        <div className="table-input-wrapper">
          <SelectOption
            Soptions={col?.isCustomized ? row?.StoneSubList : col?.data}
            SName={col?.key}
            PlaceHolder={col?.PlaceHolder}
            Value={row[col?.key]}
            OnSelect={(event) => handleChange(indexrow, col?.key, event)}
            SelectStyle={{
              height: "35px",
              margin: 0,
              padding: "0px 5px",
              fontSize: "12px",
              color: "grey",
            }}
          />
        </div>
      );
    }

    // Table Selection with Search
    if (col?.isTableSelection) {
      return (
        <div className="d-flex justify-content-start flex-nowrap table-input-wrapper">
          <input
            type={col.type}
            name={col.key}
            value={row[col.key] || ""}
            maxLength={col?.maxlen}
            onChange={(event) => handleChange(indexrow, col.key, event)}
            style={{ minWidth: "170px", width: "100%" }}
            placeholder={col.label}
            className="input-cell"
          />
          <Button
            className="table-button"
            onClick={() => SearchHandler(row?.id, col.key)}
          >
            <i className="bi bi-search"></i>
          </Button>
        </div>
      );
    }

    // Searchable Dropdown
    if (col?.AutoSearch) {
      return (
        <SearchableDropdown
          handleChange={(obj) => handleChange(indexrow, col?.key, obj)}
          id={col?.SearchValue}
          label={col?.SearchLabel}
          options={col?.data}
          selectedVal={row[col?.key]}
          key={`${indexrow}${col.key}`}
          placeholder={col?.PlaceHolder}
          defaultval={row[col?.key]}
          width={col?.width}
        />
      );
    }

    // Date with Bong Calendar
    if (col?.type === "date" && col?.banglaDate) {
      return (
        <div className="d-flex justify-content-start flex-nowrap table-input-wrapper">
          <InputBox
            type="text"
            placeholder="yyyy-mm-dd"
            label={col.label}
            Name={col.key}
            onChange={(event) => handleChange(indexrow, col.key, event)}
            onFocusChange={(e) => {
              handleDateCheck(e);
              col?.LostFocus && col?.LostFocus(indexrow, e.target.value);
            }}
            Icon={<i className="bi bi-calendar"></i>}
            SearchButton={true}
            SearchIcon={<i className="bi bi-calendar"></i>}
            SearchHandler={() => setBongView(true)}
            InputStyle={{ width: "100%" }}
            value={row[col.key]}
          />
          {bongView && (
            <BongCalender
              key={`${indexrow}-${col.key}`}
              view={bongView}
              handleclose={() => {
                setBongView(!bongView);
              }}
              handleSave={(bdate, edate) => {
                handleBongSave(bdate);
                CloseBongCal();
                col?.LostFocus && col?.LostFocus(indexrow, bdate);
                setBongView(!bongView);
              }}
            />
          )}
        </div>
      );
    }

    // File Input
    if (col?.type === "file") {
      return (
        <input
          type="file"
          name={col.key}
          ref={fileInputRefs}
          onChange={(event) => handleChange(indexrow, col.key, event)}
          style={{ width: "170px" }}
          placeholder={col.label}
          className="input-cell"
        />
      );
    }

    // Default Input
    return (
      <input
        type={col.type}
        name={col.key}
        ref={col?.proprefs ? priorityref : null}
        value={row[col.key] || ""}
        maxLength={col?.maxlen}
        onChange={(event) => handleChange(indexrow, col.key, event)}
        placeholder={col.label}
        className="input-cell form-input"
        style={{ width: "100%" }}
      />
    );
  }
);

function EstimateTable({
  toaster,
  columns,
  rows,
  handleChange,
  FetchRowId,
  deleteRow,
  SelectStyle,
  SearchHandler,
  isDelete,
  id,
  fileInputRefs,
  tableWidth,
  priorityref,
}) {
  const [bongView, setBongView] = useState(false);

  const toggleBongView = useCallback(() => {
    setBongView((prev) => !prev);
  }, []);

  return (
    <div
      style={{ overflow: "auto", width: "auto" }}
      className="table-responsive slider border m-0"
    >
      <table
        className="table align-middle m-0 p-0"
        style={{ width: tableWidth || "auto" }}
      >
        <thead className="thead-decor tab-head">
          <tr>
            <th className="th-decor" style={{ width: "80px" }}>
              Row
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="th-decor"
                style={{ width: col?.width || "auto" }}
              >
                {col.label}
              </th>
            ))}
            {isDelete && <th className="th-decor">Actions</th>}
          </tr>
        </thead>
        <tbody className="table-body-decor tab-body">
          {rows.map((row, indexrow) => (
            <tr key={indexrow}>
              <td className="th-decor">{indexrow + 1}</td>
              {columns.map((col) => (
                <td
                  key={`${indexrow}-${col.key}`}
                  className="td-cell"
                  style={{ width: col?.width }}
                >
                  <CellRenderer
                    col={col}
                    row={row}
                    indexrow={indexrow}
                    handleChange={handleChange}
                    SearchHandler={SearchHandler}
                    fileInputRefs={fileInputRefs}
                    toaster={toaster}
                    bongView={bongView}
                    setBongView={setBongView}
                    CloseBongCal={toggleBongView}
                    priorityref={priorityref} // Pass the ref to CellRenderer
                  />
                </td>
              ))}
              {isDelete && (
                <td className="td-cell" style={{ width: "50px" }}>
                  <button
                    className={
                      row?.[id] === 1
                        ? "table-button-del-disabled"
                        : "table-button-del"
                    }
                    disabled={row?.[id] === 1}
                    onClick={() => deleteRow(row?.[id])}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(EstimateTable);
