import { useState, useEffect, useCallback } from 'react';

// --- Constante para la clave del localStorage ---
const STORAGE_KEY = 'ruletaHistorial';

export const useRuletaCalculadora = () => {
    // Estado local, ya no necesita 'db', 'userId'
    const [historial, setHistorial] = useState([]);
    const [stats, setStats] = useState({ rojo: 0, azul: 0, amarillo: 0, total: 0 });
    const [error, setError] = useState(null);

    // 1. Helper para calcular estadísticas (sin cambios)
    const calcularStats = (historialActual) => {
        let rojo = 0;
        let azul = 0;
        let amarillo = 0;
        
        for (const giro of historialActual) {
            if (giro === 'rojo') rojo++;
            else if (giro === 'azul') azul++;
            else if (giro === 'amarillo') amarillo++;
        }
        
        setStats({ rojo, azul, amarillo, total: historialActual.length });
    };

    // 2. Cargar historial desde localStorage al iniciar
    useEffect(() => {
        try {
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            if (datosGuardados) {
                const historialCargado = JSON.parse(datosGuardados);
                setHistorial(historialCargado);
                calcularStats(historialCargado);
            }
        } catch (e) {
            console.error("Error al cargar historial desde localStorage:", e);
            setError("Error al cargar el historial.");
        }
    }, []); // Se ejecuta solo una vez al montar

    // 3. Función para agregar un nuevo giro
    const agregarGiro = useCallback((color) => {
        try {
            // Agrega el nuevo color al inicio y limita el historial a 100
            const nuevoHistorial = [color, ...historial].slice(0, 100); 
            
            // Actualiza el estado local
            setHistorial(nuevoHistorial);
            calcularStats(nuevoHistorial);

            // Guarda en localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoHistorial));
            
            if (error) setError(null); // Limpia errores previos si tuvo éxito
        } catch (e) {
            console.error("Error al guardar el giro en localStorage:", e);
            setError("Error al guardar el giro.");
        }
    }, [historial, error]); // Depende del historial actual

    // 4. Función para limpiar el historial
    const limpiarHistorial = useCallback(() => {
        try {
            // Limpia el estado local
            setHistorial([]);
            calcularStats([]);
            
            // Limpia localStorage
            localStorage.removeItem(STORAGE_KEY);

            if (error) setError(null);
        } catch (e) {
            console.error("Error al limpiar localStorage:", e);
            setError("Error al limpiar el historial.");
        }
    }, [error]);

    // 5. Devuelve el estado y las funciones
    return { stats, historial, error, agregarGiro, limpiarHistorial };
};