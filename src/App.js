import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import ResetPage from "./Pages/Auth/Resetpass";
import LoginPage from "./Pages/Auth/LoginPage";
import AuthNavigator from "./Layout/AuthNavigator";
import Pagenotfound from "./Pages/PageNotFound";

import CustListEdit from "./Pages/Customer";
import "./App.css";
import ItemListEdit from "./Pages/Item";

import Purity from "./Pages/Purity";

import Setup from "./Pages/Setup";
import UserListEdit from "./Pages/User";
import MetalReturn from "../src/Pages/MetalReturn";
import CompanyListEdit from "./Pages/Company";
import GroupCostListEdit from "./Pages/GroupCost";
import CostCenterListEdit from "./Pages/CostCenter";
import GroupWareHouseListEdit from "./Pages/GroupWareHouse";
import WareHouseListEdit from "./Pages/WareHouse";
import GoldRateListEdit from "./Pages/GoldRate";
import WSListEdit from "./Pages/WholeSeller";
import FineListEdit from "./Pages/Fine";
import OpenEntryForm from "./Pages/OpenEntry/OpenEntryForm";
import OpeningEntryViewReport from "./Pages/OpenEntry/OpeningEntryViewReport";
import AdjustEntry from "./Pages/Adjust";
import SearchDafa from "./Pages/SearchDafa";
import AdjustEntryHeaderTableView from "./Pages/Adjust/AdjustEntryHeaderTableView";
import MetalReturnView from "./Pages/MetalReturn/MetalReturnView";
import LedgerView from "./Pages/Ledger/LedgerView";
import Calculator from "./Pages/Calculator";
import TimingTable from "./Pages/Timing";
import CreditSetUp from "./Pages/CreditSetUp";
import PaymentToWholeSaler from "./Pages/PaymentToWholeSaler";
import DueRecWholesaler from "./Pages/DueRecWholesaler";
import Duerecwhview from "./Pages/DueRecWholesaler/Duerecwhview";
import MahajonListEdit from "./Pages/Mahajon";
import FundRcvMahajon from "./Pages/FundRcvMahajon";
import FundFrmMahajonHeaderView from "./Pages/FundRcvMahajon/FundFrmMahajonHeaderView";
import SearchHeaderView from "../src/Pages/SearchDafa/SearchHeaderview";
import Report from "./Pages/Report";
const App = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />, // Use JSX component correctly
    children: [
      {
        path: "",
        element: <LoginPage />, // Use JSX component correctly
      },
      {
        path: "resetpass",
        element: <ResetPage />, // Use JSX component correctly
      },
    ],
  },
  {
    path: "auth",
    element: <AuthNavigator />,
    errorElement: <Pagenotfound />,
    children: [
      //opening entry
      {
        path: "openentry",
        children: [
          {
            path: "form",
            element: <OpenEntryForm />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "view",
            element: <OpeningEntryViewReport />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      //search all dafa
      {
        path: "search-dafa",
        children: [
          {
            path: "",
            element: <SearchDafa/>,
            errorElement: <Pagenotfound />,
          },
          {
            path: "view",
            element: <SearchHeaderView/>,
            errorElement: <Pagenotfound />,
          },
         
        ],
      },
      //adjust
      {
        path: "adjust",
        errorElement: <Pagenotfound />,
        children: [
          {
            path: "entry-point",
            element: <AdjustEntry />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "view",
            element: <AdjustEntryHeaderTableView />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      //metal return and others
      {
        path: "metal-return",
        errorElement: <Pagenotfound />,
        element: <MetalReturn />,
      },
      //ledger
      {
        path: "ledger-view",
        errorElement: <Pagenotfound />,
        element: <LedgerView />,
      },
      //pay
      {
        path: "pay-wholesaler",
        errorElement: <Pagenotfound />,
        element: <PaymentToWholeSaler />,
      },
      //metal return
      {
        path: "metal-return-view",
        errorElement: <Pagenotfound />,
        element: <MetalReturnView />,
      },
      //due
      {
        path: "duercv-wholesaler",
        errorElement: <Pagenotfound />,
        element: <DueRecWholesaler />,
      },
      {
        path: "duercv-view",
        errorElement: <Pagenotfound />,
        element: <Duerecwhview />,
      },
      //Mahajon
      {
        path: "mahajon",
        errorElement: <Pagenotfound />,
        children: [
          {
            path: "form",
            errorElement: <Pagenotfound />,
            element: <FundRcvMahajon />,
          },
          {
            path: "view",
            errorElement: <Pagenotfound />,
            element: <FundFrmMahajonHeaderView />,
          },
        ],
      },
      //master
      {
        path: "manager",
        errorElement: <Pagenotfound />,
        children: [
          {
            path: "purity",
            element: <Purity />,
          },
          {
            path: "customer",
            element: <CustListEdit />,
          },
          {
            path: "wholeseller",
            element: <WSListEdit />,
          },
          {
            path: "mahajon",
            element: <MahajonListEdit />,
          },

          {
            path: "item",
            element: <ItemListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "company",
            element: <CompanyListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "groupcost",
            element: <GroupCostListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "costcenter",
            element: <CostCenterListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "groupwarehouse",
            element: <GroupWareHouseListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "warehouse",
            element: <WareHouseListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "goldrate",
            element: <GoldRateListEdit />,
            errorElement: <Pagenotfound />,
          },

          {
            path: "user",
            element: <UserListEdit />,
            errorElement: <Pagenotfound />,
          },
          {
            path: "fine",
            element: <FineListEdit />,
            errorElement: <Pagenotfound />,
          },
        ],
      },
      //admin settings
      {
        path: "admin",
        errorElement: <Pagenotfound />,
        children: [
          {
            path: "calculator",
            errorElement: <Pagenotfound />,
            element: <Calculator />,
          },
          {
            path: "timing",
            errorElement: <Pagenotfound />,
            element: <TimingTable />,
          },
          {
            path: "credit-setup",
            errorElement: <Pagenotfound />,
            element: <CreditSetUp />,
          },
        ],
      },
      //setup
      {
        path: "setup",
        errorElement: <Pagenotfound />,
        element: <Setup />,
      },
      //Report
      {
        path: "report",
        errorElement: <Pagenotfound />,
        element: <Report/>,
      }
    ],
  },
]);

export default App;
