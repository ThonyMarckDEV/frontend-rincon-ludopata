import { useState } from 'react';

export const useCalculadora = () => {
    // La "cantidad recomendable" está aquí como valor inicial (100)
    const [montoTotal, setMontoTotal] = useState('100');
    const [cuota1, setCuota1] = useState('2.5');
    const [cuota2, setCuota2] = useState('1.8');

    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');

    const handleCalcular = () => {
        setResultado(null);
        setError('');

        const c1 = parseFloat(cuota1);
        const c2 = parseFloat(cuota2);
        const total = parseFloat(montoTotal);

        if (isNaN(c1) || isNaN(c2) || isNaN(total) || c1 <= 0 || c2 <= 0 || total <= 0) {
            setError('Por favor, ingresa números positivos y válidos en todos los campos.');
            return;
        }

        const margen = (1 / c1) + (1 / c2);

        if (margen >= 1) {
            setError(`No hay ganancia segura. Con estas cuotas, pierdes dinero (Margen: ${(margen * 100).toFixed(2)}%).`);
            return;
        }

        const apuesta1 = (total * c2) / (c1 + c2);
        const apuesta2 = (total * c1) / (c1 + c2);
        
        const gananciaTotal = apuesta1 * c1;
        const beneficioNeto = gananciaTotal - total;
        
        // --- NUEVO CÁLCULO ---
        // (Beneficio / Total Invertido) * 100
        const beneficioPorcentaje = (beneficioNeto / total) * 100;

        setResultado({
            apuesta1: apuesta1.toFixed(2),
            apuesta2: apuesta2.toFixed(2),
            gananciaTotal: gananciaTotal.toFixed(2),
            beneficioNeto: beneficioNeto.toFixed(2),
            beneficioPorcentaje: beneficioPorcentaje.toFixed(2) // <-- AÑADIDO
        });
    };

    return {
        cuota1,
        setCuota1,
        cuota2,
        setCuota2,
        montoTotal,
        setMontoTotal,
        resultado,
        error,
        handleCalcular
    };
};