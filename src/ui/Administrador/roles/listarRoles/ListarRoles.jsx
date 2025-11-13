// src/ui/Administrador/roles/listarRoles/ListarRoles.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getRoles } from 'services/rolService'; // 💡 IMPORTAR el nuevo servicio
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';

const ListarRoles = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [roles, setRoles] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0 
    });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchRoles = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            // 💡 Usar el nuevo servicio
            const data = await getRoles(page); 

            setRoles(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setError('No se pudieron cargar los roles. Por favor, intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
            if (isInitialLoad) setIsInitialLoad(false); 
        }
    }, [isInitialLoad]); // 💡 Dependencia simplificada


    useEffect(() => {
        fetchRoles(currentPage);
    }, [currentPage, fetchRoles]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 💡 Se eliminaron las funciones handleToggleEstado y executeToggleEstado

    if (isInitialLoad && loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Roles</h1>
            
            {/* 💡 Se eliminaron AlertMessage y ConfirmModal */}
            
            <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Nombre</th>
                            <th className="px-5 py-3">Descripción</th>
                            {/* 💡 Columnas de Estado y Acciones eliminadas */}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? (
                            roles.map((rol) => (
                            <tr key={rol.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">{rol.id}</td>
                                <td className="px-5 py-4 text-sm">{rol.nombre}</td>
                                <td className="px-5 py-4 text-sm">{rol.descripcion}</td>
                                {/* 💡 Celdas de Estado y Acciones eliminadas */}
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-8 text-gray-500">
                                    No se encontraron roles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ListarRoles;