import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import * as Pages from './pages';
import SessionProvider from './providers/SessionProvider';
import { ROUTES } from './config';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {
            ROUTES.map((route, index) => {
              const Component = Pages[route.element];
              return (
                <Route key={index} path={route.path} element={<Component />} />
              );
            })
          }
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;