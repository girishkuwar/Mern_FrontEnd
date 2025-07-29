import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import wave from '../assets/wave.svg'
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
  const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'scatter' , 'bar3d' , 'scatter3d'];
  const { id } = useParams();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (!jsonData.length) return alert("Excel file is empty!");

      setDataRows(jsonData);
      setColumns(Object.keys(jsonData[0]));

      // Optional: Upload to server
      // 
      // const formData = new FormData();
      // formData.append('excel', file);
      // try {
      //   await axios.post('http://localhost:5000/api/upload', formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       'Authorization': `Bearer ${localStorage.getItem('token')}`
      //     }
      //   });
      // } catch (err) {
      //   console.error('Upload failed:', err);
      // }

      try {

        await axios.post("http://localhost:5000/api/excel/save", {
          data: jsonData,
          name: file.name
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("Data sent successfully");
      } catch (err) {
        console.error("error sending data to server");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getChartData = () => {
    const labels = dataRows.map(row => row[xKey]);
    const values = dataRows.map(row => Number(row[yKey]));

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

  const get3DChartOption = () => {
    const labels = dataRows.map(row => row[xKey]);
    const values = dataRows.map(row => Number(row[yKey]));
  
    if (chartType === 'bar3d') {
      return {
        tooltip: {},
        xAxis3D: {
          type: 'category',
          data: labels,
        },
        yAxis3D: {
          type: 'category',
          data: ['Value'],
        },
        zAxis3D: {
          type: 'value',
        },
        grid3D: {
          boxWidth: 100,
          boxDepth: 20,
          viewControl: { alpha: 25, beta: 40 },
          light: { main: { intensity: 1.2 } },
        },
        series: [{
          type: 'bar3D',
          data: labels.map((label, idx) => [label, 'Value', values[idx]]),
          shading: 'lambert',
          label: {
            show: false,
          },
          itemStyle: {
            color: '#3b82f6'
          }
        }]
      };
    }
  
    if (chartType === 'scatter3d') {
      return {
        tooltip: {},
        xAxis3D: { type: 'value' },
        yAxis3D: { type: 'value' },
        zAxis3D: { type: 'value' },
        grid3D: {
          viewControl: { alpha: 20, beta: 40 },
          light: { main: { intensity: 1.5 } },
        },
        series: [{
          type: 'scatter3D',
          symbolSize: 10,
          data: dataRows.map(row => [row[xKey], row[yKey], Math.random() * 100]),
          itemStyle: { color: '#06b6d4' }
        }]
      };
    }
  
    return {};
  };
  

  const renderChart = () => {
    const data = getChartData();
    const options = { responsive: true };

    if (chartType === 'bar3d' || chartType === 'scatter3d') {
      return <ReactECharts option={get3DChartOption()} style={{ height: 400 }} />;
    }

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
    link.download = `chart-${chartType}-${Date.now()}.png`;
    link.click();
  };

  const downloadPDF = () => {
    const chartCanvas = document.querySelector('canvas');
    html2canvas(chartCanvas).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
      pdf.save('chart.pdf');
    });
  };

  useEffect(() => {
    console.log(wave);
    const fetchUpload = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/excel/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const jsonData = res.data.data;
        setDataRows(jsonData);
        setColumns(Object.keys(jsonData[0]));
        setXKey('');
        setYKey('');
      } catch (err) {
        console.error("Failed to fetch upload by ID", err);
      }
    }
    fetchUpload();
  }, [])



  return (
    <div style={{
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: `url('/wave.svg')`
    }} className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-6 mt-9">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Excel to Dynamic Chart
        </h2>

        {!id && (
          <div className="mb-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}

        {columns.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X Axis</label>
                <select
                  onChange={e => setXKey(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Y Axis</label>
                <select
                  onChange={e => setYKey(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                <select
                  onChange={e => setChartType(e.target.value)}
                  value={chartType}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  {chartTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            {(xKey && yKey) && (
              <div className="mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  {renderChart()}
                </div>
              </div>
            )}

            <div className="flex justify-center mt-7">
              <button
                onClick={downloadChart}
                className="px-4 py-2 mx-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Download Chart as PNG
              </button>
              <button
                onClick={downloadPDF}
                className="px-4 py-2 mx-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Download Chart as PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExcelGraphUploader;
