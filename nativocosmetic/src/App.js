import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.js";
import PaymentPage from "./pages/PaymentPage.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pago" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
