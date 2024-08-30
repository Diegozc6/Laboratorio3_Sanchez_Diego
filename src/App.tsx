import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Productos from './components/Productos';
import Categorias from './components/Categorias';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/productos" element={<Productos />} />
                <Route path="/categorias" element={<Categorias />} />
            </Routes>
        </Router>
    );
};

export default App;
