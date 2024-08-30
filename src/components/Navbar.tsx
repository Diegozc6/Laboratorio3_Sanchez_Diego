import React from 'react';
import { Menubar } from 'primereact/menubar';

const Navbar: React.FC = () => {
    const items = [
        { label: 'Productos', icon: 'pi pi-fw pi-box', command: () => window.location.href = "/productos" },
        { label: 'Categorías', icon: 'pi pi-fw pi-tags', command: () => window.location.href = "/categorias" }
    ];

    return (
        <Menubar model={items} />
    );
};

export default Navbar;
