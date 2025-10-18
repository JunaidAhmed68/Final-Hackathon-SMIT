// // ...existing code...
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/UploadReport.jsx";
// import About from "./pages/About.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import ResetPassword from "./pages/ResetPassword.jsx";
// import App from "./App.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// function App_Routes() {
//   return (
//     <Routes>
//       <Route path="/" element={<App />}>
//         <Route
//           index
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="about"
//           element={
//             <ProtectedRoute>
//               <About />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="login" element={<Login />} />
//         <Route path="signup" element={<Signup />} />
//         <Route path="forgotpassword" element={<ForgotPassword />} />
//         <Route path="reset-password/:token" element={<ResetPassword />} />
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App_Routes;
// // ...existing code...


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import AddManualVitals from './pages/AddManualVitals';
import ViewReport from './pages/ViewReport';
import TimelineView from './pages/TimelineView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="upload-report" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
        <Route path="add-vitals" element={<ProtectedRoute><AddManualVitals /></ProtectedRoute>} />
        <Route path="view-report/:id" element={<ProtectedRoute><ViewReport /></ProtectedRoute>} />
        <Route path="timeline" element={<ProtectedRoute><TimelineView /></ProtectedRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;