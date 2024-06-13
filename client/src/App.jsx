import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useContext, useEffect } from 'react';
import { AuthContext } from './utils/AuthContext';
import Homepage from './pages/Homepage';
import LoginForm from './components/LoginForm';
import RegistrationPage from './components/RegistrationForm';
import { Excursions } from './components/Excurcions';
import CreateExcursion from './components/CreateExcursion';
import ExcursionRegistration from './components/EscursionRegistration';
import ExcursionDetails from './components/ExcursionDetails';
import AddReviewForm from './components/AddReviewForm';
import MyExcursions from './pages/MyExcursionsPage';
import MyExcursionsPage from './pages/MyExcursionsPage';
import ManageExcursions from './pages/ManageExcursions';
import EditExcursion from './components/EditExcursion';

function App() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated;
  }, [isAuthenticated, navigate]);


  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/excursions" element={<Excursions />} />
      <Route path="/excursions/:id" element={<ExcursionDetails />} />
      {isAuthenticated ? (
          <>
            <Route path="/create" element={isAdmin ? <CreateExcursion /> : <Navigate to="/" />} />
            <Route path="/registrations/admin/excursions" element={isAdmin ? <ManageExcursions /> : <Navigate to="/" />} />
            <Route path="/excursions/:id/edit" element={isAdmin ? <EditExcursion /> : <Navigate to="/" />} />
            <Route path="/excursions/:id/register" element={<ExcursionRegistration />} />
            <Route path="/users/my-excursions/:userId" element={<MyExcursionsPage />} />
            <Route path="/excursions/:id/addreview" element={<AddReviewForm />} />
           
          </>
        ) : (
          <>
           <Route path="/login" element={<LoginForm />} />
           <Route path="/registration" element={<RegistrationPage />} />
          </>
        )}

      </Routes>
      <Footer />
    </>
  )
}

export default App
