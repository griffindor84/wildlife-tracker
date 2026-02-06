
import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Navbar from './components/Navbar';
import Reports from './pages/reports';
import Species from './pages/species';
import Observations from './pages/observations';

function App() {
  

  return (
    <>
    <Navbar />
   <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registration" element={<Registration />} /> 
    <Route path="/reports" element={<Reports />} />
    <Route path="/species" element={<Species />} />
    <Route path="/observations" element={<Observations />} />
   </Routes>
     </>
  )
}

export default App
