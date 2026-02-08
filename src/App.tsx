
import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Navbar from './components/Navbar';
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import Wildlife from "./admin/Wildlife";
import Reports from "./admin/Reports";
import Settings from "./admin/Settings";

function App() {


  return (
    <>
    
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/wildlife" element={<Wildlife />} />
         <Route path="/admin/reports" element={<Reports />} />
           <Route path="/admin/settings" element={<Settings />} />

      </Routes>
    </>
  )
}

export default App
