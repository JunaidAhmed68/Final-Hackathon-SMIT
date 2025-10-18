// ...existing code...
import { ToastContainer } from "react-toastify";
import Header from "./components/Header.jsx";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Header />}
      <main>
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
}

export default App;
// ...existing code...