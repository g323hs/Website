function createCharts() {
    let datapoints = [];
    const labels = [""];

    for (let i = 0; i < datapoints.length; ++i) {
        labels.push(i.toString());
    }

    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = "#999999";
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    // Position chart
    // Initial Position data
    var initialPosData = {
        labels: labels,
        datasets: []
    };

    var PositionConfig = {
        type: 'line',
        data: initialPosData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: false,
                title: {
                    display: true,
                    text: 'Position'
                }
            },
            scales: {
                xAxes: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                }
            },
            events: [],
            animation: {
                duration: 0
            }
        },
        plugins: [plugin],
    };

    PositionChart = new Chart(document.getElementById('position'), PositionConfig);

    // Momentum chart
    // Initial Momentum data
    var initialMomData = {
        labels: labels,
        datasets: []
    };

    var MomentumConfig = {
        type: 'line',
        data: initialMomData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: false,
                title: {
                    display: true,
                    text: 'Momentum'
                }
            },
            scales: {
                xAxes: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                }
            },
            events: [],
            animation: {
                duration: 0
            }
        },
        plugins: [plugin],
    };

    MomentumChart = new Chart(document.getElementById('momentum'), MomentumConfig);
}

createCharts();