import { RouterProvider } from "react-router-dom";
import router from "./Router.jsx";
import { AuthProvider } from "./ContextAPI/AuthProvider.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
