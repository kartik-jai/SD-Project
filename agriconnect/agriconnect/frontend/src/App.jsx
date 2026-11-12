import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./state.jsx";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Shell from "./pages/Shell.jsx";
import PostListing from "./pages/PostListing.jsx";
import Listings from "./pages/Listings.jsx";
import Prices from "./pages/Prices.jsx";

export default function App() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Auth mode="login" />} />
      <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Auth mode="register" />} />
      <Route path="/app" element={user ? <Shell /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="mine" replace />} />
        <Route path="post" element={<PostListing />} />
        <Route path="mine" element={<Listings scope="mine" />} />
        <Route path="browse" element={<Listings scope="browse" />} />
        <Route path="prices" element={<Prices />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
