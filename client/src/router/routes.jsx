import Home from "../pages/Home.jsx";
import PostFood from "../pages/PostFood.jsx";
import Collector from "../pages/Collector.jsx";
import ProofUpload from "../pages/ProofUpload.jsx";
import HowItWorks from "../pages/HowItWorks.jsx";
import Admin from "../pages/Admin.jsx";
import Privacy from "../pages/Privacy.jsx";
import FAQ from "../pages/FAQ.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import AIModels from "../pages/AIModels.jsx";
import NotFound from "../pages/NotFound.jsx";

export const appRoutes = [
  { path: "/", label: "Home", element: <Home />, showInNav: true },
  { path: "/post", label: "Post Food", element: <PostFood />, showInNav: true },
  { path: "/collector", label: "Collector", element: <Collector />, showInNav: true },
  { path: "/proof", label: "Proof Upload", element: <ProofUpload />, showInNav: true },
  { path: "/how-it-works", label: "How It Works", element: <HowItWorks />, showInNav: true },
  { path: "/ai-models", label: "AI Models", element: <AIModels />, showInNav: true },
  { path: "/admin", label: "Admin Panel", element: <Admin />, showInNav: true },
  { path: "/privacy", label: "Privacy", element: <Privacy />, showInNav: true },
  { path: "/faq", label: "FAQ & Support", element: <FAQ />, showInNav: true },
  { path: "/login", label: "Login", element: <Login />, showInNav: false },
  { path: "/register", label: "Register", element: <Register />, showInNav: false },
  { path: "*", element: <NotFound /> }
];
