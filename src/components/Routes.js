import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Sites from '../pages/Sites';
import Machines from '../pages/Machines';
import Report from '../pages/Report';
import Settings from '../pages/Settings';
import Logout from '../pages/Logout';
import CreateReport from '../pages/CreateReport';
import PrivateRoute from './PrivateRoute';



function MyRoutes({ setToken }) {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/sites" element={<PrivateRoute><Sites /></PrivateRoute>} />
      <Route path="/machines" element={<PrivateRoute><Machines /></PrivateRoute>} />
      <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
      <Route path="/report/createreport" element={<PrivateRoute><CreateReport /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/logout" element={<PrivateRoute><Logout setToken={setToken} /></PrivateRoute>} /> 
      <Route path="*" element={<Navigate to="/" />} /> 
    </Routes>
  );
}

export default MyRoutes;