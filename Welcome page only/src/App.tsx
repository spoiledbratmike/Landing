import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
