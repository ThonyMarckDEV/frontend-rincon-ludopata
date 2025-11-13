import { useState, useEffect, useMemo, useCallback } from 'react';

// Clave para el localStorage
const CAPITAL_KEY = 'bankroll_capital';
const HISTORIAL_KEY = 'bankroll_historial';

export const useBankRollManager = () => {
    // --- ESTADO ---
    const [capitalInicial, setCapitalInicial] = useState(0);
    const [historial, setHistorial] = useState([]);
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');

    // --- EFECTOS ---
    // Cargar datos del localStorage al iniciar
    useEffect(() => {
        try {
            const capitalGuardado = localStorage.getItem(CAPITAL_KEY);
            const historialGuardado = localStorage.getItem(HISTORIAL_KEY);

            if (capitalGuardado) {
                setCapitalInicial(parseFloat(capitalGuardado));
            }
            if (historialGuardado) {
                setHistorial(JSON.parse(historialGuardado));
            }
        } catch (err) {
            console.error("Error al cargar datos del localStorage:", err);
            setError("No se pudo cargar el historial.");
        }
    }, []);

    // Guardar historial en localStorage cada vez que cambia
    useEffect(() => {
        try {
            localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
        } catch (err) {
            console.error("Error al guardar historial en localStorage:", err);
            setError("No se pudo guardar el último movimiento.");
        }
    }, [historial]);

    // Guardar capital en localStorage cada vez que cambia
    useEffect(() => {
        try {
            localStorage.setItem(CAPITAL_KEY, capitalInicial.toString());
        } catch (err) {
            console.error("Error al guardar capital en localStorage:", err);
            setError("No se pudo guardar el capital.");
        }
    }, [capitalInicial]);


    // --- ACCIONES ---

    // Establecer el capital inicial (solo si no hay historial)
    const handleSetCapital = (e) => {
        e.preventDefault();
        const nuevoCapital = parseFloat(monto);
        if (isNaN(nuevoCapital) || nuevoCapital <= 0) {
            setError("Ingresa un capital inicial válido.");
            return;
        }
        if (historial.length > 0) {
            setError("No puedes cambiar el capital inicial si ya tienes movimientos.");
            return;
        }
        setCapitalInicial(nuevoCapital);
        setMonto('');
        setError('');
    };

    // Añadir una transacción (ganancia o pérdida)
    const agregarTransaccion = (tipo) => {
        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            setError("Ingresa un monto válido.");
            return;
        }

        const transaccion = {
            id: crypto.randomUUID(),
            tipo: tipo, // 'ganancia' o 'perdida'
            monto: tipo === 'ganancia' ? montoNum : -montoNum,
            descripcion: descripcion || (tipo === 'ganancia' ? 'Ganancia' : 'Pérdida'),
            fecha: new Date().toISOString(),
        };

        setHistorial(prevHistorial => [transaccion, ...prevHistorial]);
        setMonto('');
        setDescripcion('');
        setError('');
    };

    // Limpiar todo el registro
    const limpiarRegistros = useCallback(() => {
        if (window.confirm("¿Estás seguro de que quieres borrar todo el historial y reiniciar tu capital? Esta acción no se puede deshacer.")) {
            setCapitalInicial(0);
            setHistorial([]);
            setMonto('');
            setDescripcion('');
            setError('');
            // Limpia el localStorage explícitamente
            localStorage.removeItem(CAPITAL_KEY);
            localStorage.removeItem(HISTORIAL_KEY);
        }
    }, []);

    // --- CÁLCULOS (MEMORIZADOS) ---
    // Recalcula solo si el historial o el capital cambian
    const stats = useMemo(() => {
        const totalGanado = historial
            .filter(t => t.tipo === 'ganancia')
            .reduce((sum, t) => sum + t.monto, 0);
        
        const totalPerdido = historial
            .filter(t => t.tipo === 'perdida')
            .reduce((sum, t) => sum + t.monto, 0); // (los montos ya son negativos)

        const beneficioNeto = totalGanado + totalPerdido;
        const capitalActual = capitalInicial + beneficioNeto;
        const roi = (capitalInicial > 0) ? (beneficioNeto / capitalInicial) * 100 : 0;
        const totalMovimientos = historial.length;
        const movimientosGanadores = historial.filter(t => t.tipo === 'ganancia').length;
        const movimientosPerdedores = historial.filter(t => t.tipo === 'perdida').length;

        return {
            capitalInicial: capitalInicial.toFixed(2),
            capitalActual: capitalActual.toFixed(2),
            beneficioNeto: beneficioNeto.toFixed(2),
            roi: roi.toFixed(2),
            totalGanado: totalGanado.toFixed(2),
            totalPerdido: (totalPerdido * -1).toFixed(2), // Mostrar como número positivo
            totalMovimientos,
            movimientosGanadores,
            movimientosPerdedores,
        };

    }, [historial, capitalInicial]);

    // --- RETORNO DEL HOOK ---
    return {
        monto,
        setMonto,
        descripcion,
        setDescripcion,
        error,
        stats,
        historial,
        handleSetCapital,
        agregarTransaccion,
        limpiarRegistros,
        tieneCapitalInicial: capitalInicial > 0,
    };
};