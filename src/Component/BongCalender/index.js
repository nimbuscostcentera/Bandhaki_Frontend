import React, { useEffect, useState, useMemo } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import SelectOption from "../SelectOption";
import useFetchBanglaCalender from "../../store/ShowStore/useFetchBanglaCalender";
import useFetchBanglaMonth from "../../store/ShowStore/useFetchBanglaMonth";
import useFetchTotalDaysInMonth from "../../store/ShowStore/useFetchTotalDaysInMonth";
import InputBox from "../InputBox";
import moment from "moment";
import "../Table/table.css";
function BongCalender({ view, handleclose, handleSave }) {
  const [Bong, setBong] = useState({
    BongMonth: "",
    BongDay: 0,
    BongYear: 0,
    MonthNumber: 0,
    TotalDays: 0,
    fday: "",
    fweekday: "",
    CalenderTable: [],
    BengaliDate: "",
    EnglishDate: "",
  });
  const OnChangeHandler = (e) => {
    let value = e.target.value;
    let key = e.target.name;
    setBong((prev) => ({ ...prev, [key]: value }));
  };
  const { isBanglaCalenderLoading, BanglaCalenderList, fetchBanglaCalender } =
    useFetchBanglaCalender();
  const {
    fetchBanglaMonth,
    BanglaMonthError,
    isBanglaMonthLoading,
    BanglaMonthList,
  } = useFetchBanglaMonth();

  const { fetchDaysInMonth, DaysInMonthList, isDaysInMonthLoading } =
    useFetchTotalDaysInMonth();

  const bongMonthList = useMemo(() => {
    let array = [{ Name: "---Select Bengali Month---" }];
    BanglaMonthList.forEach((element) => {
      array.push({ Name: element?.BengaliMonth, Value: element?.Month });
    });
    return array;
  }, [isBanglaMonthLoading]);

  const bongYear = useMemo(() => {
    let array = [{ Name: "---Select Bengali Month---" }];
    BanglaCalenderList.forEach((element) => {
      array.push({ Name: element?.BengaliYear, Value: element?.Year });
    });
    return array;
  }, [isBanglaCalenderLoading]);

  useEffect(() => {
    if (view) {
      fetchBanglaCalender();
      fetchBanglaMonth();
    }
  }, [view]);
//day in month data fetch from api and store in state
  useEffect(() => {
    if (Bong?.BongMonth && Bong?.BongYear) {
      fetchDaysInMonth(Bong?.BongYear);
      let obj = BanglaCalenderList?.find(
        (item) => item?.Year == Bong?.BongYear
      );
      let obj1 = BanglaMonthList?.find(
        (item) => item?.Month == Bong?.BongMonth
      );
      setBong((prev) => ({
        ...prev,
        fday: obj?.FirstDay,
        fweekday: obj?.Weekday,
        MonthNumber: obj1?.ID,
      }));
    }
  }, [Bong?.BongMonth, Bong?.BongYear]);
//total days in month
  useEffect(() => {
    if (Array.isArray(DaysInMonthList)) {
      let obj = DaysInMonthList[0];

      setBong((prev) => ({ ...prev, TotalDays: obj?.[`${Bong?.BongMonth}`] }));
    }
  }, [isDaysInMonthLoading]);
//calender calculation
  useEffect(() => {
    let obj = DaysInMonthList[0] || {};
    let { ID = 0, updatedAt, createdAt, Year, TotalDays, ...finalObj } = obj;
    let arr = Object.keys(finalObj);

    let days = 0;
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      days += finalObj[arr[i]];
      if (arr[i] == Bong?.BongMonth) {
        break;
      }
    }
    let startdate = moment(Bong?.fday);
    let englishdate = startdate.add(
      days - Bong?.TotalDays + Bong?.BongDay - 1,
      "days"
    );
    let daysofPrevmonth = days - Bong?.TotalDays;
    let fwm = daysofPrevmonth % 7;
    let fwday =
      Bong?.fweekday + fwm >= 7
        ? Bong?.fweekday + (fwm % 7)
        : Bong?.fweekday + fwm;
    let calender = [];
    let k = fwday;
    let obj1 = {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
    };
    for (let i = 1; i <= Bong?.TotalDays; i++) {
      if (k <= 7) {
        obj1[k] = i;
      } else {
        k = 1;
        calender.push(obj1);
        obj1 = {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
          7: null,
        };
        obj1[k] = i;
      }
      if (i == Bong?.TotalDays) {
        calender.push(obj1);
      }
      k++;
    }
    // console.log(calender);
    setBong((prev) => ({
      ...prev,
      EnglishDate: englishdate.format("YYYY-MM-DD"),
      CalenderTable: calender,
    }));
  }, [
    Bong?.TotalDays,
    Bong?.fday,
    Bong?.fweekday,
    Bong?.MonthNumber,
    Bong?.BongYear,
    Bong?.BongDay,
  ]);
//set bengali date
  useEffect(() => {
    if (Bong?.BongDay && Bong?.BongMonth && Bong?.BongYear) {
      let bdate = `${Bong?.BongYear}-${(Bong?.MonthNumber).toString().padStart(
        2,
        "0"
      )}-${(Bong?.BongDay).toString().padStart(2, "0")}`;

      setBong((prev) => ({ ...prev, BengaliDate: bdate }));
    }
  }, [Bong?.BongDay, Bong?.BongMonth, Bong?.BongYear]);

  let ColCal = [
    {
      headername: "রবি",
      fieldname: "1",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "সোম",
      fieldname: "2",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "মঙ্গল",
      fieldname: "3",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "বুধ",
      fieldname: "4",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "বৃহস্পতি",
      fieldname: "5",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "শুক্র",
      fieldname: "6",
      type: "String",
      isShortingOff: true,
    },
    {
      headername: "শনি",
      fieldname: "7",
      type: "String",
      isShortingOff: true,
    },
  ];

  // console.log(Bong);
  return (
    <Modal show={view} onHide={handleclose}>
      <Modal.Header closeButton>
        <Modal.Title>Bong Calender</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <label>
              Bengali Date
              <InputBox
                Icon={<i class="bi bi-calendar-check"></i>}
                InputStyle={{ width: "192px" }}
                Name={"BengaliDate"}
                error={false}
                errorMsg={""}
                isdisable={true}
                label={"Bengali Date"}
                placeholder={"Bengali Date"}
                type={"text"}
                value={Bong?.BengaliDate}
              />
            </label>
          </Col>
          <Col>
            <label>
              English Date
              <InputBox
                Icon={<i class="bi bi-calendar-check"></i>}
                InputStyle={{ width: "192px" }}
                Name={"EnglishDate"}
                error={false}
                errorMsg={""}
                isdisable={true}
                label={"English Date"}
                placeholder={"English Date"}
                type={"date"}
                value={Bong?.EnglishDate}
              />
            </label>
          </Col>
        </Row>{" "}
        <hr />
        <Row>
          <Col>
            <SelectOption
              OnSelect={OnChangeHandler}
              PlaceHolder={"---Select Year---"}
              SName={"BongYear"}
              SelectStyle={{
                padding: "5px 10px",
              }}
              Value={Bong?.BongYear}
              Soptions={bongYear}
            />
          </Col>
          <Col>
            <SelectOption
              OnSelect={OnChangeHandler}
              PlaceHolder={"---Select Month---"}
              SName={"BongMonth"}
              SelectStyle={{
                padding: "5px 10px",
              }}
              Value={Bong?.BongMonth}
              Soptions={bongMonthList}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <table>
            <thead style={{ backgroundColor: "#2f2d66", color: "white" }} >
              <tr>
                {ColCal?.map((item,colindex) => {
                  return (
                    <td style={{ textAlign: "center" }} key={colindex}>
                      {item?.headername}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody className="tab-body">
              {Bong?.CalenderTable?.map((item,rowindex) => {
                return (
                  <tr key={rowindex}>
                    {ColCal.map((col, colindex) => {
                      return (
                        <td
                          key={rowindex + colindex}
                          style={{
                            backgroundColor:
                              item[col?.fieldname] === Bong?.BongDay
                                ? "lightgreen"
                                : "white",
                          }}
                          onClick={() => {
                            setBong((prev) => ({
                              ...prev,
                              BongDay: item[col?.fieldname],
                            }));
                          }}
                        >
                          {item[col?.fieldname]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={() => {
            handleSave(Bong?.BengaliDate, Bong?.EnglishDate);
            handleclose();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BongCalender;
