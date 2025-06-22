import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../../../styles/components/_socket-panel.css';

Chart.register(...registerables);

const SocketGraph = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const labels = data.map(d => new Date(d.timestamp));

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: data.map(d => d.temperature),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              tension: 0.3,
              yAxisID: 'y',
              pointRadius: 3,
              pointHoverRadius: 5
            },
            {
              label: 'Humidity (%)',
              data: data.map(d => d.humidity),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.3,
              yAxisID: 'y',
              pointRadius: 3,
              pointHoverRadius: 5
            },
            {
              label: 'WiFi RSSI (dBm)',
              data: data.map(d => d.wifi_rssi),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.3,
              yAxisID: 'y1',
              pointRadius: 3,
              pointHoverRadius: 5,
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.dataset.label.includes('RSSI')) {
                    label += context.raw + ' dBm';
                  } else if (context.dataset.label.includes('Temperature')) {
                    label += context.raw + ' °C';
                  } else {
                    label += context.raw + ' %';
                  }
                  return label;
                }
              }
            },
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                padding: 20
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'PPpp',
                unit: 'minute'
              },
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperature (°C) / Humidity (%)'
              },
              min: Math.min(
                ...data.map(d => d.temperature),
                ...data.map(d => d.humidity)
              ) - 5,
              max: Math.max(
                ...data.map(d => d.temperature),
                ...data.map(d => d.humidity)
              ) + 5
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'WiFi RSSI (dBm)'
              },
              min: Math.min(...data.map(d => d.wifi_rssi)) - 5,
              max: Math.max(...data.map(d => d.wifi_rssi)) + 5,
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="socket-graph-wrapper">
      <canvas ref={chartRef} />
    </div>
  );
};

export default SocketGraph;