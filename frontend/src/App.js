import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import ViewStory from './pages/ViewStory';
import EditStory from './pages/EditStory';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateStory />} />
          <Route path="stories/:storyId" element={<ViewStory />} />
          <Route path="stories/:storyId/edit" element={<EditStory />} />
          
          {/* 404 Route */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;