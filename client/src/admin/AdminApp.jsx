import { Route, Routes } from 'react-router-dom';
import './admin.css';
import { AuthProvider } from './AuthContext';
import AdminLayout from './AdminLayout';
import Login from './Login';
import Dashboard from './Dashboard';
import SettingsEditor from './SettingsEditor';
import ResourceManager from './ResourceManager';
import Messages from './Messages';
import ChangePassword from './ChangePassword';
import NotFound from '../pages/NotFound';

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="r/:resource" element={<ResourceManager />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
