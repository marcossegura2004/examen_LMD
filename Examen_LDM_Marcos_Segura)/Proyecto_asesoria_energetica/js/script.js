document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    fetchResults();
});

function fetchResults() {
    const cif = document.getElementById('cif').value.trim().toLowerCase();
    const nombre = document.getElementById('nombre').value.trim().toLowerCase();
    const comercializadora = document.getElementById('comercializadora').value.trim().toLowerCase();
    const estado = document.getElementById('estado').value.trim().toLowerCase();

    const url = new URL('http://192.168.101.4:3000/asesoria_energetica');
    const params = {};

    if (cif) params.cif = cif;
    if (nombre) params.nombre = nombre;
    if (comercializadora) params.comercializadora = comercializadora;
    if (estado) params.estado = estado;

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifica la estructura de los datos aquí

            const resultsTableBody = document.getElementById('resultsTableBody');
            resultsTableBody.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(contract => {
                    // Convertir los datos del contrato a minúsculas para la comparación
                    const contractCif = contract.CIF.toLowerCase();
                    const contractNombre = contract.NOMBRE.toLowerCase();
                    const contractComercializadora = contract.COMERCIALIZADORA.toLowerCase();
                    const contractEstado = contract.ESTADO.toLowerCase();

                    // Filtrar solo los contratos que coinciden con los parámetros de búsqueda
                    const matchesCif = !cif || contractCif.includes(cif);
                    const matchesNombre = !nombre || contractNombre.includes(nombre);
                    const matchesComercializadora = !comercializadora || contractComercializadora.includes(comercializadora);
                    const matchesEstado = !estado || contractEstado.includes(estado);

                    if (matchesCif && matchesNombre && matchesComercializadora && matchesEstado) {
                        const row = document.createElement('tr');

                        const id = contract.CIF ?? 'N/A';
                        const nombre = contract.NOMBRE ?? 'N/A';
                        const cups = contract.CUPS ?? 'N/A';
                        const tarifa = contract.TARIFA ?? 'N/A';
                        const comercializadora = contract.COMERCIALIZADORA ?? 'N/A';
                        const comercial = contract.COMERCIAL ?? 'N/A';
                        const estado = contract.ESTADO ?? 'N/A';
                        const acciones = contract.ACCIONES ?? 'N/A';
                        const fecha = contract.FECHA ?? 'N/A';
                        const pagado = contract.PAGADO ?? 'N/A';
                        const o50 = contract['O 50%'] ?? 'N/A';
                        const documentosAdjuntos = contract['DOCUMENTOS ADJUNTOS'] ?? 'N/A';
                        const fechaAcabarContrato = contract['FECHA DE ACABAR CONTRATO'] ?? 'N/A';

                        // Crear todas las celdas para mostrar toda la información
                        row.innerHTML = `
                            <td>${id}</td>
                            <td>${nombre}</td>
                            <td>${cups}</td>
                            <td>${tarifa}</td>
                            <td>${comercializadora}</td>
                            <td>${comercial}</td>
                           
                        `;
                        resultsTableBody.appendChild(row);
                    }
                });
            } else {
                console.error('Respuesta inesperada:', data);
            }
        })
        .catch(error => console.error('Error al realizar la consulta:', error));
}
