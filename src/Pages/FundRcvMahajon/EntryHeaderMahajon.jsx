import { useState, useEffect, useMemo } from "react";
import useFetchLotsForMahajon from "../../store/ShowStore/useFetchLotsForMahajon";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import InputBox from "../../Component/InputBox";
import BongCalender from "../../Component/BongCalender";
import SearchableDropDown from "../../Component/SearchableDropDown";
import MultipleSelection from "../../Component/MultipleSelection";

function EntryHeaderMahajon({
  trancode,
  entityType,
  handleHeaderChange,
  headerData,
  handleShow,
  dateInputRef,
  toast,
  view,
  handleClose1,
  handleSave1,
  refreshKey,
  ItemDetails = [],
  setSelectedLots,
  selectedLots,
}) {
  const [currentLotNo, setCurrentLotNo] = useState(null); // Track current LotNo for API calls

  // API Hooks
  const { LotsForMahajon, fetchLotsForMahajon } = useFetchLotsForMahajon();
  const { fetchMahajonData, MahajonList } = useFetchMahajon();
  const { CompanyID } = useFetchAuth();

  // Effects
  useEffect(() => {
    fetchLotsForMahajon({ TranCode: trancode, Cust_Type: entityType });
  }, [trancode, entityType, refreshKey]);

  useEffect(() => {
    fetchMahajonData({ TranCode: trancode, Cust_Type: entityType, CompanyID });
  }, [trancode, entityType, CompanyID]);

  // Memoized data transformations
  const Lots = useMemo(() => {
    if (!LotsForMahajon) return [];
    return LotsForMahajon.map((item) => ({
      label: item?.LotNo,
      value: item?.LotNo,
    }));
  }, [LotsForMahajon]);

  // Filter out already selected lots and lots in ItemDetails
  const availableLots = useMemo(() => {
    const selectedValues = selectedLots?.map((item) => item.value);
    const existingLotNos = ItemDetails?.map((item) => item?.LotNo);
    const allExcluded = [...selectedValues, ...existingLotNos];
    return Lots.filter((lot) => !allExcluded.includes(lot.value));
  }, [Lots, selectedLots, ItemDetails]);

  const Mahajon = useMemo(() => {
    return (
      MahajonList?.map((item) => ({
        label: item?.Name,
        value: item?.ID,
      })) || []
    );
  }, [MahajonList]);

  // Handle multiple selection changes
  const handleMultiSelection = (selected) => {
    setSelectedLots(selected);

    // Get the most recently selected lot (last in array)
    const latestSelected =
      selected.length > 0 ? selected[selected.length - 1].value : null;
    setCurrentLotNo(latestSelected);

    // Convert to simple array of values for parent component
    const selectedValues = selected.map((item) => item.value);

    // Call parent handler with proper event structure
    handleHeaderChange({
      target: {
        name: "LotNo",
        value: latestSelected, // Send single value for API calls
      },
    });

    // Also send the array of selected lots if needed elsewhere
    handleHeaderChange({
      target: {
        name: "LotsNo", // New field name for array of lots
        value: selectedValues,
      },
    });
  };

  // Handle removal of a selected lot
  const handleRemoveLot = (removedLot) => {
    const updatedLots = selectedLots.filter(
      (lot) => lot.value !== removedLot.value
    );
    setSelectedLots(updatedLots);

    // If we removed the current lot, update currentLotNo to the last remaining or null
    if (removedLot.value === currentLotNo) {
      setCurrentLotNo(
        updatedLots.length > 0
          ? updatedLots[updatedLots.length - 1].value
          : null
      );

      // Update parent with new current lot
      handleHeaderChange({
        target: {
          name: "LotNo",
          value:
            updatedLots.length > 0
              ? updatedLots[updatedLots.length - 1].value
              : null,
        },
      });
    }

    // Update the LotsNo array in parent
    handleHeaderChange({
      target: {
        name: "LotsNo",
        value: updatedLots.map((lot) => lot.value),
      },
    });
  };

  const validateDate = (date) => {
    if (!date) return;
    const regex = /^(?:14|15)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[0-2])$/;
    if (!regex.test(date)) {
      toast.error(
        "Invalid Date Format. It should be YYYY-MM-DD. Also make sure day and month number contain 0 if less than 10."
      );
    }
  };

  return (
    <div className="table-box" style={{ width: "98%", overflow: "auto" }}>
      <table style={{ width: "100%", overflow: "auto" }}>
        <thead className="tab-head">
          <tr>
            <th
              style={{
                padding: "3px 10px",
                borderBottom: "1px solid lightgrey",
              }}
            >
              <i className="bi bi-person-circle"></i>
            </th>
            <th>LotNo*</th>
            <th>Mahajon*</th>
            <th>Date*</th>
          </tr>
        </thead>

        <tbody className="tab-body">
          <tr>
            <td>
              <i className="bi bi-caret-right-fill"></i>
            </td>
            <td>
              <MultipleSelection
                options={availableLots}
                handleChange={handleMultiSelection}
                selectedVal={selectedLots}
                onRemove={handleRemoveLot} // Pass the removal handler
                placeholder="--Select Lots--"
                defaultval={-1}
                style={{ width: "100%" }}
              />
            </td>
            <td>
              <SearchableDropDown
                options={Mahajon}
                handleChange={handleHeaderChange}
                selectedVal={headerData?.MahajonID || ""}
                label="MahajonID"
                placeholder="--Select Mahajon--"
                defaultval={-1}
                width="100%"
              />
            </td>
            <td>
              <InputBox
                ref={dateInputRef}
                type="text"
                placeholder="yyyy-mm-dd"
                label="Date"
                Name="Date"
                InputStyle={{ padding: "5px 8px" }}
                value={headerData?.Date}
                onChange={handleHeaderChange}
                Icon={<i className="bi bi-calendar"></i>}
                SearchButton={true}
                SearchIcon={<i className="bi bi-calendar"></i>}
                SearchHandler={handleShow}
                maxlen={100}
                onFocusChange={() => validateDate(headerData?.Date)}
              />
              <BongCalender
                view={view}
                handleclose={handleClose1}
                handleSave={handleSave1}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EntryHeaderMahajon;
