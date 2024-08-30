import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    categoriaId: number;
}

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newCategoryId, setNewCategoryId] = useState<number | null>(null);
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get<Producto[]>('http://localhost:3001/productos');
            setProductos(response.data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos', life: 3000 });
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get<Categoria[]>('http://localhost:3001/categorias');
            setCategorias(response.data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías', life: 3000 });
        }
    };

    const saveProducto = async () => {
        if (newProductName.trim() !== '' && newCategoryId !== null) {
            try {
                if (selectedProducto) {
                    await axios.put(`http://localhost:3001/productos/${selectedProducto.id}`, { nombre: newProductName, categoriaId: newCategoryId });
                } else {
                    await axios.post('http://localhost:3001/productos', { nombre: newProductName, categoriaId: newCategoryId });
                }
                fetchProductos();
                setDisplayDialog(false);
                setNewProductName('');
                setNewCategoryId(null);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el producto', life: 3000 });
            }
        }
    };

    const deleteProducto = async (productoId: number) => {
        try {
            await axios.delete(`http://localhost:3001/productos/${productoId}`);
            fetchProductos();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto', life: 3000 });
        }
    };

    const onSelectionChange = (e: any) => {
        const selected = e.value as Producto;
        setSelectedProducto(selected);
        setNewProductName(selected.nombre);
        setNewCategoryId(selected.categoriaId);
        setDisplayDialog(true);
    };

    return (
        <div>
            <Toast ref={toast} />
            <Button label="Agregar Producto" icon="pi pi-plus" onClick={() => {
                setSelectedProducto(null);
                setNewProductName('');
                setNewCategoryId(null);
                setDisplayDialog(true);
            }} />
            <DataTable value={productos} selectionMode="single" onSelectionChange={onSelectionChange}>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="categoriaId" header="Categoría" body={(rowData: Producto) => categorias.find(c => c.id === rowData.categoriaId)?.nombre || ''}></Column>
                <Column header="Acciones" body={(rowData: Producto) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setSelectedProducto(rowData); setNewProductName(rowData.nombre); setNewCategoryId(rowData.categoriaId); setDisplayDialog(true); }} />
                        <Button icon="pi pi-trash" className="ml-2" onClick={() => deleteProducto(rowData.id)} />
                    </>
                )}></Column>
            </DataTable>

            <Dialog header="Producto" visible={displayDialog} onHide={() => setDisplayDialog(false)}>
                <InputText value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Nombre del producto" />
                <Dropdown value={newCategoryId} options={categorias} onChange={(e) => setNewCategoryId(e.value)} optionLabel="nombre" placeholder="Seleccionar Categoría" />
                <Button label="Guardar" onClick={saveProducto} />
            </Dialog>
        </div>
    );
};

export default Productos;
