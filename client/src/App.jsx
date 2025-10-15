import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./theme.css";
import Home from "./pages/Home.jsx";
import PostFood from "./pages/PostFood.jsx";
import Collector from "./pages/Collector.jsx";
import ProofUpload from "./pages/ProofUpload.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Admin from "./pages/Admin.jsx";
import Privacy from "./pages/Privacy.jsx";
import FAQ from "./pages/FAQ.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AIModels from "./pages/AIModels.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/post" element={<PostFood/>}/>
          <Route path="/collector" element={<Collector/>}/>
          <Route path="/proof" element={<ProofUpload/>}/>
          <Route path="/how-it-works" element={<HowItWorks/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/faq" element={<FAQ/>}/>
          <Route path="/ai-models" element={<AIModels/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
