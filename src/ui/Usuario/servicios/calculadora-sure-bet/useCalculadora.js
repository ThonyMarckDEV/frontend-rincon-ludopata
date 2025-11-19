import { useState, useCallback } from 'react';

// --- 1. Lógica Central (useCalculadora) ---
const useCalculadora = () => {
    // La "cantidad" ahora empieza vacía, pidiéndola al usuario
    const [montoTotal, setMontoTotal] = useState('');
    const [cuota1, setCuota1] = useState('2.5'); // Cuota 1 (Local)
    const [cuota2, setCuota2] = useState('1.8'); // Cuota 2 (Visitante o Empate según toggle)
    
    // NUEVO: Cuota 3 y Toggle para apuestas a 3 vias (Ej: Fútbol/Empate)
    const [cuota3, setCuota3] = useState('3.0'); // Cuota 3 (Visitante cuando activado)
    const [isThreeWayBet, setIsThreeWayBet] = useState(false); // Estado para activar 3 vias

    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');

    const handleCalcular = useCallback(() => {
        setResultado(null);
        setError('');

        const c1 = parseFloat(cuota1);
        const c2 = parseFloat(cuota2);
        const total = parseFloat(montoTotal);

        if (isNaN(c1) || isNaN(c2) || isNaN(total) || c1 <= 0 || c2 <= 0 || total <= 0) {
            setError('Por favor, ingresa números positivos y válidos en Cuota 1, Cuota 2 y Monto Total.');
            return;
        }

        let c3 = 0;
        if (isThreeWayBet) {
            c3 = parseFloat(cuota3);
            if (isNaN(c3) || c3 <= 0) {
                setError('Para la opción de 3 vias, por favor ingresa una Cuota 3 (Visitante) válida y positiva.');
                return;
            }
        }

        // 1. Calcular Margen de Surebet (o probabilidad implícita total)
        let margen = (1 / c1) + (1 / c2);
        if (isThreeWayBet) {
            margen += (1 / c3);
        }

        if (margen >= 1) {
            setError(`No hay ganancia segura. Con estas cuotas, pierdes dinero (Margen: ${(margen * 100).toFixed(2)}%).`);
            return;
        }

        // 2. Calcular el Target Payout (el pago que queremos recibir por cada apuesta)
        // Payout = TotalBet / Margin. Como el TotalBet es el 'total' ingresado:
        // Calculamos las apuestas basándonos en la proporción de la probabilidad implícita.

        // Suma de las probabilidades implícitas
        const sumProbabilidades = (1 / c1) + (1 / c2) + (isThreeWayBet ? (1 / c3) : 0);
        
        // Apuesta = MontoTotal * (Probabilidad Implícita / Suma de Probabilidades)
        const apuesta1_calc = total * (1 / c1) / sumProbabilidades;
        const apuesta2_calc = total * (1 / c2) / sumProbabilidades;
        let apuesta3_calc = 0;
        if (isThreeWayBet) {
            apuesta3_calc = total * (1 / c3) / sumProbabilidades;
        }
        
        // 3. Redondear apuestas al entero más cercano
        const apuesta1_redondeada = Math.round(apuesta1_calc);
        const apuesta2_redondeada = Math.round(apuesta2_calc);
        const apuesta3_redondeada = isThreeWayBet ? Math.round(apuesta3_calc) : 0;

        // 4. Calcular el total real que se va a apostar (después del redondeo)
        const totalApostadoReal = apuesta1_redondeada + apuesta2_redondeada + apuesta3_redondeada;

        // 5. Calcular las posibles ganancias (payouts)
        const gananciaPayout1 = apuesta1_redondeada * c1;
        const gananciaPayout2 = apuesta2_redondeada * c2;
        const gananciaPayout3 = isThreeWayBet ? (apuesta3_redondeada * c3) : 0; 

        // 6. La ganancia "segura" es la *menor* de todas
        const potentialPayouts = [gananciaPayout1, gananciaPayout2];
        if (isThreeWayBet) {
            potentialPayouts.push(gananciaPayout3);
        }
        const gananciaMinimaGarantizada = Math.min(...potentialPayouts);

        // 7. Calcular beneficio neto y porcentaje
        const beneficioNeto = gananciaMinimaGarantizada - totalApostadoReal;
        const beneficioPorcentaje = (beneficioNeto / totalApostadoReal) * 100;

        // 8. Guardar resultado
        setResultado({
            apuesta1: apuesta1_redondeada.toFixed(0),
            apuesta2: apuesta2_redondeada.toFixed(0),
            apuesta3: isThreeWayBet ? apuesta3_redondeada.toFixed(0) : null,
            totalApostado: totalApostadoReal.toFixed(0),
            gananciaPayout1: gananciaPayout1.toFixed(2),
            gananciaPayout2: gananciaPayout2.toFixed(2),
            gananciaPayout3: isThreeWayBet ? gananciaPayout3.toFixed(2) : null,
            gananciaMinima: gananciaMinimaGarantizada.toFixed(2),
            beneficioNeto: beneficioNeto.toFixed(2),
            beneficioPorcentaje: beneficioPorcentaje.toFixed(2)
        });
    }, [cuota1, cuota2, cuota3, montoTotal, isThreeWayBet]);

    return {
        cuota1, setCuota1,
        cuota2, setCuota2,
        cuota3, setCuota3, // Nuevo estado
        isThreeWayBet, setIsThreeWayBet, // Nuevo estado
        montoTotal, setMontoTotal,
        resultado, error,
        handleCalcular
    };
};

export default useCalculadora;