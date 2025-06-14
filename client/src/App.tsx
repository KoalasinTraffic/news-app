import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { AuthForm, Chart, ProtectedRoute } from './components';
import { AuthProvider } from './contexts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthForm isLogin={true} />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Chart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
