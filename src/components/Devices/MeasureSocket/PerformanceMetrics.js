import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../../../styles/pages/_device-socket.css'

const PerformanceMetrics = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="no-data-container">
        <div className="no-data-message">
        </div>
      </div>
    );
  }

  const calculateAverages = () => {
    const validData = data.filter(item => 
      !isNaN(item.encryption_time_us) && 
      !isNaN(item.encryption_energy_uj) &&
      !isNaN(item.cycles_per_byte) &&
      !isNaN(item.total_cycles)
    );

    if (validData.length === 0) {
      return {
        avgTime: NaN,
        avgEnergy: NaN,
        avgCyclesPerByte: NaN,
        avgTotalCycles: NaN
      };
    }

    const sum = validData.reduce((acc, curr) => {
      return {
        time: acc.time + curr.encryption_time_us,
        energy: acc.energy + curr.encryption_energy_uj,
        cyclesPerByte: acc.cyclesPerByte + curr.cycles_per_byte,
        totalCycles: acc.totalCycles + curr.total_cycles,
        count: acc.count + 1
      };
    }, { time: 0, energy: 0, cyclesPerByte: 0, totalCycles: 0, count: 0 });

    return {
      avgTime: sum.time / sum.count,
      avgEnergy: sum.energy / sum.count,
      avgCyclesPerByte: sum.cyclesPerByte / sum.count,
      avgTotalCycles: sum.totalCycles / sum.count
    };
  };

  const averages = calculateAverages();

  const chartData = data.map((item, index) => ({
    name: `Lần ${index + 1}`,
    time: item.encryption_time_us,
    energy: item.encryption_energy_uj,
    cyclesPerByte: item.cycles_per_byte,
    totalCycles: item.total_cycles,
    timestamp: new Date(item.timestamp).toLocaleTimeString()
  }));

  const formatValue = (value) => {
    return isNaN(value) ? 'N/A' : value.toFixed(2);
  };

  return (
    <div className="performance-metrics-container">
      <div className="performance-summary">
        <h3>Thống kê hiệu suất</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Thời gian mã hóa trung bình</h4>
            <p>{formatValue(averages.avgTime)} µs</p>
          </div>
          <div className="summary-card">
            <h4>Năng lượng mã hóa trung bình</h4>
            <p>{formatValue(averages.avgEnergy)} µJ</p>
          </div>
          <div className="summary-card">
            <h4>Chu kỳ/byte trung bình</h4>
            <p>{formatValue(averages.avgCyclesPerByte)}</p>
          </div>
          <div className="summary-card">
            <h4>Tổng chu kỳ trung bình</h4>
            <p>{formatValue(averages.avgTotalCycles)}</p>
          </div>
        </div>
      </div>

      <div className="performance-charts">
        <div className="chart-container">
          <h4>Thời gian mã hóa theo thời gian</h4>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                label={{ value: 'µs', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Thời gian mã hóa (µs)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Năng lượng mã hóa theo thời gian</h4>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                label={{ value: 'µJ', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px'
                }}
              />
              <Bar 
                dataKey="energy" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Năng lượng mã hóa (µJ)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Hiệu suất mã hóa</h4>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Chu kỳ/byte', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Tổng chu kỳ', angle: -90, position: 'insideRight', fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px'
                }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="cyclesPerByte" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Chu kỳ/byte" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="totalCycles" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Tổng chu kỳ" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;