document.addEventListener('DOMContentLoaded', function() {
    fetch('http://192.168.101.4:3000/asesoria_energetica')
        .then(response => response.json())
        .then(data => {
            let TRAMITADOCount = 0;
            let noTramitadoCount = 0;

            data.forEach(order => {
                if (order.ESTADO === "TRAMITADO") {
                    TRAMITADOCount++;
                } else if (order.ESTADO.trim() === "") { // Considerar también string vacío
                    noTramitadoCount++;
                }
            });

            const ctx = document.getElementById('ordersChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar', // Cambiado a gráfico de barras
                data: {
                    labels: ['TRAMITADO', 'No Tramitado'],
                    datasets: [{
                        label: 'Estado de Pedidos',
                        data: [TRAMITADOCount, noTramitadoCount],
                        backgroundColor: ['#4caf50', '#f44336'], // Colores actualizados
                        borderColor: ['#388e3c', '#d32f2f'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Estado de los Pedidos'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});
