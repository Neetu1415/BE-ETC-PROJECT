// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/navigation/Nav";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivatePage from "./pages/ActivatePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordPageConfirm from "./pages/ResetPasswordPageConfirm";
import NotFoundPage from "./pages/NotFoundPage";
import CustomerRoutes from "./routes/CustomerRoutes";
import StadiumAdminRoutes from "./routes/StadiumAdminRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import "./App.css";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from "./features/auth/authSlice";
import PhotoGallery from './components/PhotoGallery';
import StadiumGalleryDetail from './components/StadiumGalleryDetail';



function App() {
  const dispatch = useDispatch();
  const { user, authLoaded } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.access && !authLoaded) {
      dispatch(getUserInfo());
    }
  }, [dispatch, authLoaded]);


  return (
    <Router>
      <Nav />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/photo-gallery" element={<PhotoGallery />} />
          <Route path="/photo-gallery/:id" element={<StadiumGalleryDetail />} />



          {/* Role-based Routes */}
          <Route path="/customer/*" element={<CustomerRoutes />} />
          <Route path="/stadium/*" element={<StadiumAdminRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
