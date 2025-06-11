
        // Configuración inicial
        const roleWeights = {
            students: 25,
            teachers: 25,
            admin: 50
        };

        let currentProgress = {
            students: 90,
            teachers: 0,
            admin: 0
        };

        // Configuración de gráficos
        const chartConfig = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        };

        // Gráfico de progreso general (Doughnut)
        const generalProgressCtx = document.getElementById('generalProgressChart').getContext('2d');
        const generalProgressChart = new Chart(generalProgressCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Pendiente'],
                datasets: [{
                    data: [22.5, 77.5],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(225, 229, 233, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(225, 229, 233, 1)'
                    ],
                    borderWidth: 2,
                    cutout: '60%'
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de distribución por roles (Pie)
        const roleDistributionCtx = document.getElementById('roleDistributionChart').getContext('2d');
        const roleDistributionChart = new Chart(roleDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['👨‍🎓 Estudiantes', '👨‍🏫 Docentes', '👨‍💼 Administrativo'],
                datasets: [{
                    data: [25, 25, 50],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '% del proyecto';
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de progreso detallado (Bar)
        const detailedProgressCtx = document.getElementById('detailedProgressChart').getContext('2d');
        const detailedProgressChart = new Chart(detailedProgressCtx, {
            type: 'bar',
            data: {
                labels: ['👨‍🎓 Estudiantes', '👨‍🏫 Docentes', '👨‍💼 Administrativo'],
                datasets: [{
                    label: 'Progreso (%)',
                    data: [90, 0, 0],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                ...chartConfig,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    ...chartConfig.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Progreso: ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });

        // Función para calcular el progreso total
        function calculateTotalProgress() {
            return (
                (currentProgress.students * roleWeights.students / 100) +
                (currentProgress.teachers * roleWeights.teachers / 100) +
                (currentProgress.admin * roleWeights.admin / 100)
            );
        }

        // Función para actualizar estadísticas
        function updateStats() {
            const totalProgress = calculateTotalProgress();
            const completedRoles = [currentProgress.students, currentProgress.teachers, currentProgress.admin]
                .filter(progress => progress === 100).length;
            const remainingWork = 100 - totalProgress;
            
            document.getElementById('totalProgress').textContent = totalProgress.toFixed(1) + '%';
            document.getElementById('totalProgressBar').style.width = totalProgress + '%';
            document.getElementById('completedRoles').textContent = completedRoles + '/3';
            document.getElementById('remainingWork').textContent = remainingWork.toFixed(1) + '%';
            
            // Determinar siguiente fase
            let nextPhase = 'Pruebas';
            if (totalProgress === 100) {
                nextPhase = 'Despliegue';
            } else if (totalProgress > 75) {
                nextPhase = 'Pruebas Finales';
            }
            document.getElementById('nextPhase').textContent = nextPhase;
        }

        // Función para actualizar todos los gráficos
        function updateCharts() {
            // Obtener valores de los inputs
            currentProgress.students = parseInt(document.getElementById('studentProgress').value);
            currentProgress.teachers = parseInt(document.getElementById('teacherProgress').value);
            currentProgress.admin = parseInt(document.getElementById('adminProgress').value);
            
            const totalProgress = calculateTotalProgress();
            const remainingProgress = 100 - totalProgress;
            
            // Actualizar gráfico de progreso general
            generalProgressChart.data.datasets[0].data = [totalProgress, remainingProgress];
            generalProgressChart.update('active');
            
            // Actualizar gráfico de progreso detallado
            detailedProgressChart.data.datasets[0].data = [
                currentProgress.students,
                currentProgress.teachers,
                currentProgress.admin
            ];
            detailedProgressChart.update('active');
            
            // Actualizar estadísticas
            updateStats();
        }

        // Inicializar estadísticas
        updateStats();

        // Función para alternar modo administrador
        function toggleAdminMode() {
            const controlsPanel = document.getElementById('controlsPanel');
            const adminAccess = document.getElementById('adminAccess');
            
            if (controlsPanel.style.display === 'none') {
                controlsPanel.style.display = 'block';
                adminAccess.style.display = 'none';
            } else {
                controlsPanel.style.display = 'none';
                adminAccess.style.display = 'block';
            }
        }

        // Los gráficos mantienen su altura automática definida por CSS
  