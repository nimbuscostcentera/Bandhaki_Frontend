import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./table.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BongCalender from "../BongCalender";


const ActionButton = ({ icon, color, onClick, disabled, title }) => (
  <button
    className="btn btn-link"
    style={{ padding: "0" }}
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    <i
      className={`bi bi-${icon}`}
      style={{
        color: disabled ? "lightgrey" : color || "#ac4bec",
        fontSize: "22px",
      }}
    ></i>
  </button>
);

const Table = ({
  grandtotal,
  checkedIds,
  isCheck,
  isFooter,
  isPrint,
  isView,
  isDelete,
  isEdit,
  viewPref,
  tab,
  ActionId,
  ActionFunc,
  onSorting,
  Col,
  OnChangeHandler,
  OnSaveHandler,
  EditedData,
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
  // Dynamic action buttons configuration
  actions = [],
}) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const step = container.clientHeight * 0.8; // Scroll 80% of visible height

      container.scrollTo({
        top: direction === "up" ? 0 : container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Add these button styles to your CSS
  const buttonStyles = {
    position: "absolute",
    right: "2px",
    zIndex: 100,
    padding: "10px 16px",
    borderRadius: "50%",
    backgroundColor: "#6c5ce7",
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      transform: "scale(1.1)",
      backgroundColor: "#5b4bc4",
      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
    },
  };
  const renderCellContent = (item, field, index) => {
    // console.log(field?.isUseInputRef,"true or false");
  
    if (field?.isIconicData) {
      return item[field?.fieldname] == 1
        ? field?.iconSuccess(item) // Pass item to the function
        : field?.iconError(item); // Pass item to the function
    } else if (ActionId == index && !field?.isNotEditable) {
      if (field?.isSelection) {
        return field?.isMultiSelection ? (
          <MultipleSelection
            options={field?.options}
            handleChange={HandleMultiSelection}
            selectedVal={
              EditedData[field?.selectionname] || item[field?.selectionname]
            }
            label={field?.labelname}
            placeholder={field?.placeholder}
            defaultval={EditedData[field?.labelname]}
          />
        ) : (
          <SearchableDropDown
            options={field?.options}
            handleChange={(e) => OnChangeHandler(index, e)}
            selectedVal={
              EditedData[field?.selectionname] || item[field?.selectionname]
            }
            label={field?.selectionname}
            placeholder={field?.headername}
            defaultval={item[field?.fieldname]}
          />
        );
      } else {
        return (
          <input
            name={field?.fieldname}
            maxLength={field?.max}
            placeholder={field?.headername}
            value={EditedData[field?.fieldname] || ""}
            ref={field?.isUseInputRef ? useInputRef : null}
            type={field?.type}
            onChange={(e) => OnChangeHandler(index, e)}
            className="input-cell form-input"
            style={{ width: "100%" }}
            readOnly={field?.isReadOnly || false}
          />
        );
      }
    } else if (field?.type === "Img") {
      return (
        <a
          href={`${process.env.REACT_APP_BASEURL_IMAGE}/${
            item[field?.fieldname] || "default-image.jpg"
          }`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <img
            src={`${process.env.REACT_APP_BASEURL_IMAGE}/${
              item[field?.fieldname] || "default-image.jpg"
            }`}
            alt="img"
            style={{
              width: "100%",
              height: "50px",
              cursor: "pointer",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultimage;
            }}
          />
        </a>
      );
    } else {
      return item[field?.fieldname] == 0 ? "-" : item[field?.fieldname];
    } 
  };

  const renderActionButtons = (item, index) => {
    return actions.map((action, i) => {
      if (action.type === "checkbox") {
        return (
          <td key={i}>
            <input
              type="checkbox"
              checked={action.checkedItems?.some(
                (i) => i[action.checkKey] === item[action.checkKey]
              )}
              onChange={(e) => action.onChange(item, e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
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

  return (

      <div
        ref={scrollRef}
        style={{ position: "relative", overflow: "auto", height: "100%" }}
      >
        <table
          className="table table-responsive table-sm table-hover align-middle"
          style={{ width: "100%" }}
        >
          <thead className="tab-head">
            <tr className="table-secondary">
              <th scope="col" style={{ minWidth: "40px" }}>
                Row
              </th>
              {Array.isArray(Col) &&
                Col?.map((col, index) => (
                  <th
                    scope="col"
                    style={{ minWidth: col?.width || "100px" }}
                    key={index}
                  >
                    <span>{col?.headername}</span>
                    {!col?.isShortingOff && (
                      <Button
                        variant="link"
                        style={{ padding: "1px 1px", color: "white" }}
                        onClick={() => onSorting(col?.fieldname, col?.type)}
                      >
                        <i className="bi bi-arrow-down-up"></i>
                      </Button>
                    )}
                  </th>
                ))}
              {isEdit ? (
                <>
                  <th scope="col" style={{ minWidth: "55px" }}>
                    Edit
                  </th>
                  <th scope="col" style={{ minWidth: "55px" }}>
                    {" "}
                    Save{" "}
                  </th>
                </>
              ) : null}
              {isView ? (
                <>
                  <th scope="col" style={{ minWidth: "70px" }}>
                    {viewPref} View
                  </th>
                </>
              ) : null}
              {isPrint ? (
                <>
                  <th scope="col" style={{ minWidth: "70px" }}>
                    Print
                  </th>
                </>
              ) : null}
              {isCheck ? (
                <>
                  <th scope="col" style={{ minWidth: "70px" }}>
                    Check Button
                  </th>
                </>
              ) : null}
              {isDelete ? (
                <>
                  <th scope="col" style={{ minWidth: "70px" }}>
                    Delete
                  </th>
                </>
              ) : null}
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
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton width={30} />
                  </td>
                  {Array.isArray(Col) &&
                    Col?.map((_, colIndex) => (
                      <td key={colIndex}>
                        <Skeleton height={30} />
                      </td>
                    ))}
                  {actions.map((_, i) => (
                    <td key={i}>
                      <Skeleton circle={true} height={26} width={26} />
                    </td>
                  ))}
                </tr>
              ))
            ) : tab?.length === 0 ? (
              <tr>
                <td></td>
                <td
                  colSpan={
                    Col?.length +
                    (isEdit ? 2 : 0) +
                    (isView ? 1 : 0) +
                    (isPrint ? 1 : 0) +
                    (isCheck ? 1 : 0) +
                    (isDelete ? 1 : 0) +
                    actions.length +
                    1 // for the Row column
                  }
                  style={{
                    height: height || "250px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#777",
                    backgroundColor: "#f8f9fa",
                    letterSpacing: "1px",
                  }}
                >
                  <i
                    className="bi bi-exclamation-circle"
                    style={{
                      fontSize: "16px",
                      color: "#999",
                      marginRight: "8px",
                    }}
                  ></i>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#999",
                      marginRight: "8px",
                      fontStyle: "",
                    }}
                  >
                    No Data Found
                  </span>
                </td>
              </tr>
            ) : (
              Array.isArray(tab) &&
              tab.map((item, index) => (
                <tr key={index}>
                  <td>
                    {PageNumber && rowsperpage
                      ? (PageNumber - 1) * rowsperpage + index + 1
                      : index + 1}
                  </td>
                  {Array.isArray(Col) &&
                    Col?.map((field, indexfield) => (
                      <td
                        key={indexfield}
                        style={{
                          maxWidth: field?.width || "100px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => {
                          if (getFocusText) {
                            getFocusText(item[field?.fieldname]);
                          } else {
                            return;
                          }
                        }}
                      >
                        {renderCellContent(item, field, index)}
                      </td>
                    ))}
                  {/* Buttons with Skeleton Loaders */}
                  {isEdit ? (
                    <>
                      <td>
                        <button
                          className="btn btn-link"
                          style={{ padding: "0" }}
                          onClick={() => {
                            ActionFunc(index);
                          }}
                        >
                          <i
                            className="bi bi-pencil-square"
                            style={{ color: "#ac4bec", fontSize: "22px" }}
                          ></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-link"
                          style={{ padding: "0" }}
                          onClick={() => OnSaveHandler(index)}
                          disabled={
                            ActionId == null ||
                            ActionId == undefined ||
                            ActionId == -1
                          }
                        >
                          <i
                            className="bi bi-floppy"
                            style={{
                              color:
                                index === ActionId && ActionId !== null
                                  ? "green"
                                  : "lightgrey",
                              fontSize: "22px",
                            }}
                          ></i>
                        </button>
                      </td>
                    </>
                  ) : null}
                  {isView ? (
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => handleViewClick(index)}
                      >
                        <i
                          className="bi bi-eye text-primary"
                          style={{ color: "#ac4bec", fontSize: "22px" }}
                        ></i>
                      </button>
                    </td>
                  ) : null}
                  {isPrint ? (
                    <td>
                      <button
                        className="btn btn-link"
                        style={{ padding: "0" }}
                        onClick={() => handleprint(index)}
                      >
                        <i
                          className="bi bi-printer text-primary"
                          style={{ color: "#ac4bec", fontSize: "22px" }}
                        ></i>
                      </button>
                    </td>
                  ) : null}
                  {isCheck ? (
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedIds?.some(
                          (i) => i.LotNo === item.LotNo
                        )}
                        onChange={(e) => onCheckChange(item, e.target.checked)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                  ) : null}
                  {isDelete ? (
                    <td>
                      <button
                        className="btn btn-trash"
                        style={{ padding: "0" }}
                        onClick={() => handleDelete(index)}
                      >
                        <i
                          className="bi bi-trash"
                          style={{ color: "#ff0000", fontSize: "22px" }}
                        ></i>
                      </button>
                    </td>
                  ) : null}
                  {renderActionButtons(item, index)}
                </tr>
              ))
            )}
            {isFooter &&
              (FooterBody || (
                <tr style={{ zIndex: 2, position: "sticky", bottom: "0" }}>
                  <td colSpan={Col?.length}>Grand Total:</td>
                  <td>{grandtotal == 0 ? "-" : grandtotal}</td>
                  {actions.length > 0 && <td colSpan={actions.length}></td>}
                </tr>
              ))}
          </tbody>
        </table>
        {showScrollButtons && (
          <>
            <button
              style={{ ...buttonStyles, top: "10px", right: "2px" }}
              onClick={() => handleScroll("up")}
              className="scroll-btn"
            >
              ↑
            </button>
            <button
              style={{ ...buttonStyles, bottom: "10px", right: "2px" }}
              onClick={() => handleScroll("down")}
              className="scroll-btn"
            >
              ↓
            </button>
          </>
        )}
      </div>

  );
};

export default Table;
