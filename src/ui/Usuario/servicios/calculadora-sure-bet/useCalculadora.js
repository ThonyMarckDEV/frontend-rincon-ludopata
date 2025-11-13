import { useState } from 'react';

/**
 * Hook personalizado que maneja toda la lógica
 * para la calculadora de surebets.
 */
export const useCalculadora = () => {
    // --- Estado para los inputs ---
    const [cuota1, setCuota1] = useState('2.5');
    const [cuota2, setCuota2] = useState('1.8');
    const [montoTotal, setMontoTotal] = useState('100');

    // --- Estado para los resultados y errores ---
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');

    /**
     * Función principal que se llama desde el botón
     */
    const handleCalcular = () => {
        // Limpiar resultados anteriores
        setResultado(null);
        setError('');

        // 1. Obtener y parsear los valores del estado
        const c1 = parseFloat(cuota1);
        const c2 = parseFloat(cuota2);
        const total = parseFloat(montoTotal);

        // 2. Validar
        if (isNaN(c1) || isNaN(c2) || isNaN(total) || c1 <= 0 || c2 <= 0 || total <= 0) {
            setError('Por favor, ingresa números positivos y válidos en todos los campos.');
            return;
        }

        // 3. Verificar si existe ganancia segura (Arbitraje)
        const margen = (1 / c1) + (1 / c2);

        if (margen >= 1) {
            setError(`No hay ganancia segura. Con estas cuotas, pierdes dinero (Margen: ${(margen * 100).toFixed(2)}%).`);
            return;
        }

        // 4. Calcular cuánto apostar en cada cuota
        const apuesta1 = (total * c2) / (c1 + c2);
        const apuesta2 = (total * c1) / (c1 + c2);

        // 5. Calcular los resultados
        const gananciaTotal = apuesta1 * c1;
        const beneficioNeto = gananciaTotal - total;

        // 6. Guardar los resultados en el estado
        setResultado({
            apuesta1: apuesta1.toFixed(2),
            apuesta2: apuesta2.toFixed(2),
            gananciaTotal: gananciaTotal.toFixed(2),
            beneficioNeto: beneficioNeto.toFixed(2),
        });
    };

    // 7. Exponer (retornar) todos los valores y funciones
    // que el componente JSX necesitará.
    return {
        cuota1,
        setCuota1,
        cuota2,
        setCuota2,
        montoTotal,
        setMontoTotal,
        resultado,
        error,
        handleCalcular // La función que ejecuta la lógica
    };
};