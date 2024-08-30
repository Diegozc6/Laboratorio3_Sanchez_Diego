import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

interface Categoria {
    id: number;
    nombre: string;
}

const Categorias: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get<Categoria[]>('http://localhost:3001/categorias');
            setCategorias(response.data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías', life: 3000 });
        }
    };

    const saveCategoria = async () => {
        if (newCategory.trim() !== '') {
            try {
                if (selectedCategoria) {
                    await axios.put(`http://localhost:3001/categorias/${selectedCategoria.id}`, { nombre: newCategory });
                } else {
                    await axios.post('http://localhost:3001/categorias', { nombre: newCategory });
                }
                fetchCategorias();
                setDisplayDialog(false);
                setNewCategory(''); // Resetea el campo después de guardar
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la categoría', life: 3000 });
            }
        }
    };

    const deleteCategoria = async (categoriaId: number) => {
        try {
            await axios.delete(`http://localhost:3001/categorias/${categoriaId}`);
            fetchCategorias();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría', life: 3000 });
        }
    };

    const onSelectionChange = (e: any) => {
        setSelectedCategoria(e.value);
        setNewCategory(e.value?.nombre || '');
        setDisplayDialog(true);
    };

    return (
        <div>
            <Toast ref={toast} />
            <Button label="Agregar Categoría" icon="pi pi-plus" onClick={() => {
                setSelectedCategoria(null);
                setNewCategory('');
                setDisplayDialog(true);
            }} />
            <DataTable value={categorias} selectionMode="single" onSelectionChange={onSelectionChange}>
                <Column field="nombre" header="Nombre"></Column>
                <Column header="Acciones" body={(rowData: Categoria) => (
                    <Button label="Eliminar" icon="pi pi-times" className="p-button-danger" onClick={() => deleteCategoria(rowData.id)} />
                )}></Column>
            </DataTable>

            <Dialog header="Categoría" visible={displayDialog} onHide={() => setDisplayDialog(false)}>
                <InputText value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nombre de la categoría" />
                <Button label="Guardar" onClick={saveCategoria} />
            </Dialog>
        </div>
    );
};

export default Categorias;
