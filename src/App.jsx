import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TopStrip from './components/layout/TopStrip';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

// Pages that should NOT show the Footer
const AUTH_PATHS = ['/login', '/register'];

const Layout = () => {
    const { pathname } = useLocation();
    const isAuthPage = AUTH_PATHS.includes(pathname);

    return (
        <div className="app">
            <TopStrip />
            <Navbar />
            <AppRoutes />
            {!isAuthPage && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
