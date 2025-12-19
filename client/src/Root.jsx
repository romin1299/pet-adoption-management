import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./Components/Navbar/index.jsx";
import Loading from "./Components/Loading/index.jsx";

const Root = () => {
  return (
    <div className="application-root-container">
      <div className="navbar">
        <Suspense fallback={<Loading />}>
          <Navbar />
        </Suspense>
      </div>
      <div className="main-body">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Root;
