
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/registration";
import AboutUs from "./pages/aboutus";
import Navbar from "./components/Navbar";
import ContactUs from "./pages/contactus";
import AddObservation from "./pages/addobservation";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/addobservation" element={<AddObservation />} />
      </Routes>
    </>
  );
}

export default App;
