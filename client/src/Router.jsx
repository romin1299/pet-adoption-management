import { createBrowserRouter } from "react-router-dom";
import MainDashboard from "./Pages/MainDashboard/index.jsx";
import LoginPage from "./Pages/LoginPage/index.jsx";
import Root from "./Root.jsx";
import PetRegistrationAdminDashboard from "./Pages/PetRegistrationAdminDashboard/index.jsx";
import AllAdoptedAndApprovalDashboard from "./Pages/AllAdoptedAndApprovalDashboard/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <MainDashboard />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/admin/pet-registration",
        element: <PetRegistrationAdminDashboard />,
      },
      {
        path: "/adoptions",
        element: <AllAdoptedAndApprovalDashboard />,
      },
    ],
  },
]);

export default router;
