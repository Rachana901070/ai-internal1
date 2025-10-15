import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./theme.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { appRoutes } from "./router/routes.jsx";

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element}/>
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
