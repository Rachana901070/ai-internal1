import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./theme.css";
import Home from "./pages/Home.jsx";
import PostFood from "./pages/PostFood.jsx";
import Collector from "./pages/Collector.jsx";
import ProofUpload from "./pages/ProofUpload.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Privacy from "./pages/Privacy.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/post" element={<ProtectedRoute><PostFood/></ProtectedRoute>}/>
          <Route path="/collector" element={<ProtectedRoute><Collector/></ProtectedRoute>}/>
          <Route path="/proof-upload" element={<ProtectedRoute><ProofUpload/></ProtectedRoute>}/>
          <Route path="/how-it-works" element={<HowItWorks/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
