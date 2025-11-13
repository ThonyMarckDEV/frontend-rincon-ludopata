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
    // (Los useEffects de carga y guardado permanecen iguales)
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

    useEffect(() => {
        try {
            localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
        } catch (err) {
            console.error("Error al guardar historial en localStorage:", err);
            setError("No se pudo guardar el último movimiento.");
        }
    }, [historial]);

    useEffect(() => {
        try {
            localStorage.setItem(CAPITAL_KEY, capitalInicial.toString());
        } catch (err) {
            console.error("Error al guardar capital en localStorage:", err);
            setError("No se pudo guardar el capital.");
        }
    }, [capitalInicial]);


    // --- CÁLCULOS (MEMORIZADOS) ---
    // ¡¡MOVEMOS ESTO ANTES DE LAS ACCIONES!!
    const stats = useMemo(() => {
        const totalGanado = historial
            .filter(t => t.tipo === 'ganancia')
            .reduce((sum, t) => sum + t.monto, 0);
        
        const totalPerdido = historial
            .filter(t => t.tipo === 'perdida')
            .reduce((sum, t) => sum + t.monto, 0); // (los montos ya son negativos)

        const beneficioNeto = totalGanado + totalPerdido;
        const capitalActual = capitalInicial + beneficioNeto; // <-- Valor numérico clave
        const roi = (capitalInicial > 0) ? (beneficioNeto / capitalInicial) * 100 : 0;
        const totalMovimientos = historial.length;
        const movimientosGanadores = historial.filter(t => t.tipo === 'ganancia').length;
        const movimientosPerdedores = historial.filter(t => t.tipo === 'perdida').length;

        return {
            capitalInicial: capitalInicial.toFixed(2),
            capitalActual: capitalActual.toFixed(2), // Formateado para mostrar
            rawCapitalActual: capitalActual, // <-- **NUEVO**: Valor numérico para cálculos
            beneficioNeto: beneficioNeto.toFixed(2),
            roi: roi.toFixed(2),
            totalGanado: totalGanado.toFixed(2),
            totalPerdido: (totalPerdido * -1).toFixed(2), // Mostrar como número positivo
            totalMovimientos,
            movimientosGanadores,
            movimientosPerdedores,
        };

    }, [historial, capitalInicial]);


    // --- ACCIONES ---

    // Establecer el capital inicial (sin cambios)
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

    // **CORREGIDO**: Añadir transacción basada en el NUEVO SALDO
    const agregarTransaccion = () => {
        const nuevoSaldo = parseFloat(monto); // El 'monto' ahora es el nuevo saldo total
        if (isNaN(nuevoSaldo) || nuevoSaldo < 0) { // Permitimos 0
            setError("Ingresa un nuevo saldo válido (positivo).");
            return;
        }

        // Obtenemos el capital actual (numérico) de stats
        const capitalAnterior = stats.rawCapitalActual;

        // Calculamos la diferencia
        // Ej: nuevoSaldo (1007) - capitalAnterior (1000) = 7 (Ganancia)
        // Ej: nuevoSaldo (950) - capitalAnterior (1000) = -50 (Pérdida)
        const diferencia = nuevoSaldo - capitalAnterior;

        if (diferencia === 0) {
            setError("El nuevo saldo es igual al capital actual. No se registra movimiento.");
            return;
        }

        const tipo = diferencia > 0 ? 'ganancia' : 'perdida';
        const desc = descripcion || (tipo === 'ganancia' ? 'Ajuste Positivo' : 'Ajuste Negativo');

        const transaccion = {
            id: crypto.randomUUID(),
            tipo: tipo,
            monto: diferencia, // <-- Guardamos la diferencia (positiva o negativa)
            descripcion: desc,
            fecha: new Date().toISOString(),
        };

        setHistorial(prevHistorial => [transaccion, ...prevHistorial]);
        setMonto('');
        setDescripcion('');
        setError('');
    };

    // Limpiar todo el registro (sin cambios)
    const limpiarRegistros = useCallback(() => {
        if (window.confirm("¿Estás seguro de que quieres borrar todo el historial y reiniciar tu capital? Esta acción no se puede deshacer.")) {
            setCapitalInicial(0);
            setHistorial([]);
            setMonto('');
            setDescripcion('');
            setError('');
            localStorage.removeItem(CAPITAL_KEY);
            localStorage.removeItem(HISTORIAL_KEY);
        }
    }, []);


    // --- RETORNO DEL HOOK ---
    return {
        monto,
        setMonto,
        descripcion,
        setDescripcion,
        error,
        stats, // 'stats' ya incluye 'rawCapitalActual'
        historial,
        handleSetCapital,
        agregarTransaccion, // Devuelve la nueva función
        limpiarRegistros,
        tieneCapitalInicial: capitalInicial > 0,
    };
};