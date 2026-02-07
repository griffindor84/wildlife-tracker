
import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Navbar from './components/Navbar';
import Aboutus from './pages/Aboutus';

function App() {
  

  return (
    <>
    <Navbar />
   <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registration" element={<Registration />} /> 
    <Route path="/aboutus" element={<Aboutus />} /> 
   </Routes>
     </>
  )
}

export default App
