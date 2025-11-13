import { useState } from 'react';

export const useCalculadora = () => {
    // La "cantidad" ahora empieza vacía, pidiéndola al usuario
    const [montoTotal, setMontoTotal] = useState('');
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

        // --- INICIO DE CAMBIOS POR REDONDEO ---

        // 1. Calcular apuestas con decimales
        const apuesta1_calc = (total * c2) / (c1 + c2);
        const apuesta2_calc = (total * c1) / (c1 + c2);
        
        // 2. Redondear apuestas al entero más cercano
        const apuesta1_redondeada = Math.round(apuesta1_calc);
        const apuesta2_redondeada = Math.round(apuesta2_calc);

        // 3. Calcular el total real que se va a apostar (puede ser 99, 100 o 101 si el total era 100)
        const totalApostadoReal = apuesta1_redondeada + apuesta2_redondeada;

        // 4. Calcular las dos posibles ganancias (ahora serán ligeramente diferentes)
        const gananciaPayout1 = apuesta1_redondeada * c1;
        const gananciaPayout2 = apuesta2_redondeada * c2;

        // 5. La ganancia "segura" es la *menor* de las dos
        const gananciaMinimaGarantizada = Math.min(gananciaPayout1, gananciaPayout2);

        // 6. Calcular beneficio neto y porcentaje basado en la ganancia MÍNIMA y el total REAL
        const beneficioNeto = gananciaMinimaGarantizada - totalApostadoReal;
        const beneficioPorcentaje = (beneficioNeto / totalApostadoReal) * 100;


        setResultado({
            apuesta1: apuesta1_redondeada.toFixed(0), // Mostrar sin decimales
            apuesta2: apuesta2_redondeada.toFixed(0), // Mostrar sin decimales
            totalApostado: totalApostadoReal.toFixed(0), // Informar al usuario el total real
            gananciaPayout1: gananciaPayout1.toFixed(2), // Ser transparente
            gananciaPayout2: gananciaPayout2.toFixed(2), // Ser transparente
            gananciaMinima: gananciaMinimaGarantizada.toFixed(2), // Esta es la ganancia real
            beneficioNeto: beneficioNeto.toFixed(2),
            beneficioPorcentaje: beneficioPorcentaje.toFixed(2)
        });
        // --- FIN DE CAMBIOS ---
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