"use client";

import { useCallback, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./table.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BongCalender from "../BongCalender";
import InputBox from "../InputBox";

const ActionButton = ({ icon, color, onClick, disabled, title }) => (
  <button
    className="btn btn-link p-0 m-0"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{height:"30px"}}
  >
    <i
      className={`bi bi-${icon}`}
      style={{
        color: disabled ? "lightgrey" : color || "#ac4bec",
        fontSize: "20px",
      }}
    />
  </button>
);

const RenderCellContent = ({
  item,
  field,
  index,
  toaster,
  CloseBongCal,
  ActionId,
  HandleMultiSelection,
  EditedData,
  img,
  OnChangeHandler,
  bongView,
  setBongView,
  useInputRef,
  isUseInputRef,
  PictureHandler,
}) => {
  const handleDateCheck = useCallback(
    (event) => {
      const regex = /^(?:14|15)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[02])$/;
      if (!regex.test(event.target.value)) {
        toaster.error(
          "Invalid Date Format. It should be YYYY-MM-DD. Also make sure day and month number contain 0 if less than 10."
        );
      }
    },
    [toaster]
  );

  const handleBongSave = useCallback(
    (bengalidate) => {
      const obj = {
        target: {
          value: bengalidate,
          name: `${field?.fieldname}`,
        },
      };
      OnChangeHandler(index, obj);
      CloseBongCal();
    },
    [index, OnChangeHandler, CloseBongCal]
  );

  if (field?.isIconicData) {
    return item[field.fieldname] != 0 && item[field.fieldname] != null
      ? field.iconSuccess(item)
      : field.iconError(item);
  }

  if (ActionId === index && !field?.isNotEditable) {
    if (field?.isSelection) {
      return field?.isMultiSelection ? (
        <MultipleSelection
          options={field.options}
          handleChange={HandleMultiSelection}
          selectedVal={
            EditedData[field.selectionname] || item[field.selectionname]
          }
          label={field.labelname}
          placeholder={field.placeholder}
          defaultval={EditedData[field.labelname]}
        />
      ) : (
        <SearchableDropDown
          options={field.options}
          handleChange={(e) => OnChangeHandler(index, e)}
          selectedVal={
            EditedData[field.selectionname] || item[field.selectionname]
          }
          label={field.selectionname}
          placeholder={field.headername}
          defaultval={item[field.fieldname]}
        />
      );
    }
    if (field?.isBongDate) {
      return (
        <div
          className="d-flex justify-content-start flex-nowrap table-input-wrapper"
          style={{ width: field?.width }}
        >
          <InputBox
            type="text"
            placeholder="yyyy-mm-dd"
            label={field.headername}
            Name={field.fieldname}
            onChange={(event) => OnChangeHandler(index, event)}
            onFocusChange={(e) => {
              handleDateCheck(e);
              field?.LostFocus?.(index, e.target.value);
            }}
            SearchButton={true}
            isfrontIconOff={true}
            SearchIcon={<i className="bi bi-calendar" />}
            SearchHandler={() => setBongView(true)}
            InputStyle={{ width: "100%", padding: "5px 8px" }}
            value={EditedData[field.fieldname] || item[field.fieldname]}
          />
          {bongView && (
            <BongCalender
              key={`${index}-${field.fieldname}`}
              view={bongView}
              handleclose={() => setBongView(false)}
              handleSave={(bdate) => {
                handleBongSave(bdate);
                field?.LostFocus?.(index, bdate);
                setBongView(false);
              }}
            />
          )}
        </div>
      );
    }
    return (
      <input
        name={field.fieldname}
        maxLength={field.max}
        placeholder={field.headername}
        value={EditedData[field.fieldname] || ""}
        ref={field?.isUseInputRef ? useInputRef : null}
        type={field.type || "text"}
        onChange={(e) => OnChangeHandler(index, e)}
        className="input-cell form-input w-100"
        readOnly={field?.isReadOnly || false}
      />
    );
  }

  if (field?.type === "Img" && ActionId !== index) {
    const imageUrl = item[field.fieldname]
      ? `${process.env.REACT_APP_BASEURL_IMAGE}/${item[field.fieldname]}`
      : defaultimage;

    return (
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ height: "30px" }}>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt=""
              className="w-100 cursor-pointer"
              style={{ height: "30px", width: "35px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultimage;
              }}
            />
          </div>
        </div>
      </a>
    );
  }

  if (field?.type === "Img" && ActionId === index) {
    return (
      <input
        type="file"
        name={"Img"}
        accept="image/*"
        ref={field?.isUseInputRef ? useInputRef : null}
        onChange={(e) => PictureHandler(index, e)}
        className="input-cell form-input w-100"
        readOnly={field?.isReadOnly || false}
      />
    );
  }
  return item[field.fieldname] == 0 ? "-" : item[field.fieldname];
};

const Table = ({
  grandtotal = 0,
  checkedIds = [],
  isCheck,
  isFooter,
  isPrint,
  isView,
  isDelete,
  isEdit,
  viewPref,
  tab = [],
  ActionId,
  ActionFunc,
  onSorting,
  Col = [],
  OnChangeHandler,
  OnSaveHandler,
  EditedData = {},
  img,
  HandleMultiSelection,
  isLoading,
  PageNumber,
  rowsperpage,
  height,
  width,
  handleViewClick,
  handleprint,
  handleDelete,
  onCheckChange,
  getFocusText,
  useInputRef,
  showScrollButtons,
  FooterBody,
  toaster,
  bongView,
  setBongView,
  CloseBongCal,
  isUseInputRef,
  actions = [],
  PictureHandler,
}) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTo({
        top: direction === "up" ? 0 : container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const renderActionButtons = (item, index) => {
    return actions.map((action, i) => {
      if (action.type === "checkbox") {
        return (
          <td key={i} style={{ Width: "120px" }}>
            <input
              type="checkbox"
              checked={action.checkedItems?.some(
                (i) => i[action.checkKey] === item[action.checkKey]
              )}
              onChange={(e) => action.onChange(item, e.target.checked)}
              className="cursor-pointer"
              style={{ width: "100px", height: "18px" }}
            />
          </td>
        );
      }

      return (
        <td key={i}>
          <ActionButton
            icon={action.icon}
            color={action.color}
            onClick={() => action.handler(index, item)}
            disabled={
              action.disabledCondition?.(index, ActionId, item) ?? false
            }
            title={action.title}
          />
        </td>
      );
    });
  };

  const renderRowNumber = (index) => {
    return PageNumber && rowsperpage
      ? (PageNumber - 1) * rowsperpage + index + 1
      : index + 1;
  };

  const renderLoadingSkeleton = () =>
    [...Array(12)].map((_, index) => (
      <tr key={index}>
        <td>
          <Skeleton width={30} />
        </td>
        {Col.map((_, colIndex) => (
          <td key={colIndex}>
            <Skeleton height={30} />
          </td>
        ))}
        {actions.map((_, i) => (
          <td key={i}>
            <Skeleton circle height={26} width={26} />
          </td>
        ))}
      </tr>
    ));

  const renderNoDataRow = () => {
    const colspan =
      Col.length +
      (isEdit ? 2 : 0) +
      (isView ? 1 : 0) +
      (isPrint ? 1 : 0) +
      (isCheck ? 1 : 0) +
      (isDelete ? 1 : 0) +
      actions.length +
      1;

    return (
      <tr>
        <td></td>

        <td
          colSpan={colspan}
          className="text-center text-muted bg-light"
          style={{
            height: "40vh"||"auto",
            fontSize: "16px",
            letterSpacing: "1px",
          }}
        >
          <i className="bi bi-exclamation-circle me-2" />
          No Data Found
        </td>
      </tr>
    );
  };

  const renderDataRows = () =>
    tab.map((item, index) => (
      <tr key={index} className="m-0 p-0">
        <td style={{ width: "45px" }}>{renderRowNumber(index)}</td>
        {Col?.map((field, indexfield) => (
          <td
            style={{
              height: "25px",
              maxWidth: field?.width || "200px",
              textAlign: "center",
            }}
            key={indexfield}
            onClick={() => getFocusText?.(item[field?.fieldname])}
          >
            <div
              style={{
                textAlign: "center",
                Width: field?.width || "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <RenderCellContent
                item={item}
                field={field}
                index={index}
                toaster={toaster}
                CloseBongCal={CloseBongCal}
                ActionId={ActionId}
                HandleMultiSelection={HandleMultiSelection}
                EditedData={EditedData}
                img={img}
                OnChangeHandler={OnChangeHandler}
                bongView={bongView}
                setBongView={setBongView}
                useInputRef={useInputRef}
                isUseInputRef={isUseInputRef}
                PictureHandler={PictureHandler}
              />{" "}
            </div>
          </td>
        ))}

        {isEdit && (
          <>
            <td style={{ width: "45px" }}>
              <ActionButton
                icon="pencil-square"
                color="#ac4bec"
                onClick={() => ActionFunc(index)}
                title="Edit"
              />
            </td>
            <td style={{ width: "45px" }}>
              <ActionButton
                icon="floppy"
                color={index === ActionId ? "green" : "lightgrey"}
                onClick={() => OnSaveHandler(index)}
                disabled={ActionId == null || ActionId === -1}
                title="Save"
              />
            </td>
          </>
        )}

        {isView && (
          <td style={{ width: "45px" }}>
            <ActionButton
              icon="eye"
              color="#ac4bec"
              onClick={() => handleViewClick(index)}
              title={`${viewPref} View`}
            />
          </td>
        )}

        {isPrint && (
          <td style={{ width: "45px" }}>
            <ActionButton
              icon="printer"
              color="#ac4bec"
              onClick={() => handleprint(index)}
              title="Print"
            />
          </td>
        )}

        {isCheck && (
          <td style={{ width: "120px" }}>
            <input
              type="checkbox"
              checked={checkedIds.some(
                (i) => i?.LotNo === item.LotNo && i?.SRL === item.SRL
              )}
              onChange={(e) => onCheckChange(item, e.target.checked)}
              className="cursor-pointer"
              style={{ width: "18px", height: "18px" }}
            />
          </td>
        )}

        {isDelete && (
          <td style={{ width: "45px" }}>
            <ActionButton
              icon="trash"
              color="#ff0000"
              onClick={() => handleDelete(index)}
              title="Delete"
            />
          </td>
        )}

        {renderActionButtons(item, index)}
      </tr>
    ));

  return (
    <div>
      <div
        ref={scrollRef}
        // className="overflow-auto border border-secondary-subtle"
        className="overflow-auto "
        style={{ maxHeight: height || "auto", scrollbarWidth: "thin" }}
      >
        <table className="table table-responsive table-sm table-hover align-middle w-100">
          <thead className="tab-head">
            <tr className="table-secondary" style={{ height: "30px" }}>
              <th scope="col" style={{ width: "40px" }}>
                Row
              </th>
              {Col.map((col, index) => (
                <th
                  scope="col"
                  style={{ minWidth: col?.width || "100px" }}
                  key={index}
                >
                  <span>{col.headername}</span>
                  {!col?.isShortingOff && (
                    <button
                      className="btn btn-link p-1 text-white"
                      onClick={() => onSorting(col.fieldname, col.type)}
                      aria-label={`Sort by ${col.headername}`}
                    >
                      <i className="bi bi-arrow-down-up" />
                    </button>
                  )}
                </th>
              ))}
              {isEdit && (
                <>
                  <th scope="col" style={{ minWidth: "55px" }}>
                    Edit
                  </th>
                  <th scope="col" style={{ minWidth: "55px" }}>
                    Save
                  </th>
                </>
              )}
              {isView && (
                <th scope="col" style={{ minWidth: "55px" }}>
                  {viewPref} View
                </th>
              )}
              {isPrint && (
                <th scope="col" style={{ minWidth: "70px" }}>
                  Print
                </th>
              )}
              {isCheck && (
                <th scope="col" style={{ minWidth: "60px" }}>
                  Check Button
                </th>
              )}
              {isDelete && (
                <th scope="col" style={{ minWidth: "70px" }}>
                  Delete
                </th>
              )}
              {actions.map((action, i) => (
                <th
                  key={i}
                  scope="col"
                  style={{ minWidth: action.width || "70px" }}
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tab-body">
            {isLoading
              ? renderLoadingSkeleton()
              : tab.length === 0
              ? renderNoDataRow()
              : renderDataRows()}

            {isFooter &&
              (FooterBody || (
                <tr className="position-sticky bottom-0" style={{ zIndex: 2 }}>
                  <td colSpan={Col.length}>Grand Total:</td>
                  <td>{grandtotal === 0 ? "-" : grandtotal}</td>
                  {actions.length > 0 && <td colSpan={actions.length} />}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showScrollButtons && (
        <div
          className="z-2 position-sticky d-flex flex-column justify-content-between float-end py-5"
          style={{
            right: 0,
            transform: "translateY(-100%)",
            zIndex: 6,
            width: "fit-content",
            height: height || "55vh",
          }}
        >
          <button
            className="btn btn-link p-1 shadow-sm fw-bold fs-3"
            style={{
              textDecoration: "none",
              color: "grey",
              transition: "all 0.3s ease",
            }}
            onClick={() => handleScroll("up")}
            aria-label="Scroll up"
          >
            <i className="bi bi-arrow-up-circle"></i>
          </button>
          <button
            className="btn btn-link p-1 shadow-sm fw-bold fs-3"
            style={{
              buttom: "20px",
              textDecoration: "none",
              color: "grey",
              transition: "all 0.3s ease",
            }}
            onClick={() => handleScroll("down")}
            aria-label="Scroll down"
          >
            <i className="bi bi-arrow-down-circle"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
