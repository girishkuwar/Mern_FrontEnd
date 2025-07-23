import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Scatter,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register all required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);


const ExcelGraphUploader = () => {
  const [columns, setColumns] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('bar');

  const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'scatter'];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setDataRows(jsonData);
      setColumns(Object.keys(jsonData[0]));
    };
    const formData = new FormData();
    formData.append('excel', file);

    // try {
    //   await axios.post('http://localhost:5000/api/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}` // if using auth
    //     }
    //   });
    // } catch (error) {
    //   console.error('Upload failed:', err);
    // }



    reader.readAsArrayBuffer(file);
  };

  const getChartData = () => {
    const labels = dataRows.map(row => row[xKey]);
    const values = dataRows.map(row => row[yKey]);

    return {
      labels: chartType === 'scatter' ? undefined : labels,
      datasets: [{
        label: `${yKey} vs ${xKey}`,
        data: chartType === 'scatter'
          ? dataRows.map(row => ({ x: row[xKey], y: row[yKey] }))
          : values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      }]
    };
  };

  const renderChart = () => {
    const data = getChartData();
    const options = { responsive: true };

    switch (chartType) {
      case 'bar': return <Bar data={data} options={options} />;
      case 'line': return <Line data={data} options={options} />;
      case 'pie': return <Pie data={data} options={options} />;
      case 'doughnut': return <Doughnut data={data} options={options} />;
      case 'scatter': return <Scatter data={data} options={options} />;
      default: return <Bar data={data} options={options} />;
    }
  };

  const downloadChart = () => {
    const chartCanvas = document.querySelector('canvas');
    const image = chartCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'chart.png';
    link.click();
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Excel to Dynamic Chart</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {columns.length > 0 && (
        <>
          <div style={{ marginTop: 20 }}>
            <label>X Axis: </label>
            <select onChange={e => setXKey(e.target.value)}>
              <option value="">Select</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>

            <label style={{ marginLeft: 10 }}>Y Axis: </label>
            <select onChange={e => setYKey(e.target.value)}>
              <option value="">Select</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>

            <label style={{ marginLeft: 10 }}>Chart Type: </label>
            <select onChange={e => setChartType(e.target.value)} value={chartType}>
              {chartTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          {(xKey && yKey) && (
            <div style={{ marginTop: 30 }}>
              {renderChart()}
            </div>
          )}
          <button onClick={downloadChart} style={{ marginTop: 10 }}>
            📥 Download Chart as PNG
          </button>

        </>
      )}
    </div>
  );
};

export default ExcelGraphUploader;