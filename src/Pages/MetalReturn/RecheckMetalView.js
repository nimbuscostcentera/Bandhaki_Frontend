import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchRecheckMetal from "../../store/ShowStore/useRecheckMetal";
import Table from "../../Component/Table";
function RecheckMetalDetail({ srl, lotno, entityType }) {
  const [data, setData] = useState([]);
  //------------------------------------API Call-----------------------------------
  const {
    errorRecheckMetal,
    isLoadingRecheckMetal,
    RecheckMetalList,
    ClearRecheckMetal,
    fetchRecheckMetal,
  } = useFetchRecheckMetal();
  //----------------------------------useEffect------------------------------------

  useEffect(() => {
    fetchRecheckMetal({ LotNo: lotno, Srl: srl, Cust_Type: entityType });
  }, []);
  useEffect(() => {
    if (RecheckMetalList)
      setData([{...RecheckMetalList}]);
  }, [isLoadingRecheckMetal]);
  
  //----------------------------check---------------
  const col = [
    {
      headername: "Tot. Prn. Rcv.",
      fieldname: "TotalPrnRcv",
      type: "String",
    },
    {
      headername: "Tot. Prn. Paid",
      fieldname: "TotalPaidPrn",
      type: "String",
    },
    {
      headername: "Tot. Int. Generate.",
      fieldname: "TotalActualInt",
      type: "String",
    },
    {
      headername: "Tot. Int. Paid",
      fieldname: "TotalIntPaid",
      type: "String",
    },
  ];
  console.log(data,RecheckMetalList, col,"show");
  return <Table tab={data} Col={col} />;
}

export default RecheckMetalDetail;
