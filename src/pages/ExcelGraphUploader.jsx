import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';


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
  const [zKey, setZKey] = useState('');
  const [chartType, setChartType] = useState('bar');
  const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'scatter', 'bar3d', 'scatter3d', 'line3d', 'surface3d', 'mesh3d', 'bubble3d'];
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
      setXKey('');
      setYKey('');
      setZKey('');

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

  const renderChart = () => {
    const data = getChartData();
    const options = { responsive: true };

    if (chartType === 'bar3d' && xKey && yKey && zKey) {
      return (
        <Plot
          data={[{
            type: 'bar3d', // not a valid type, so instead use scatter3d with bars
            type: 'scatter3d',
            mode: 'markers',
            x: dataRows.map(row => row[xKey]),
            y: dataRows.map(row => row[yKey]),
            z: dataRows.map(row => row[zKey]),
            marker: {
              size: 6,
              color: dataRows.map(row => row[zKey]),
              colorscale: 'Viridis',
              opacity: 0.8
            }
          }]}
          layout={{
            title: '3D Bar Chart',
            autosize: true,
            scene: {
              xaxis: { title: xKey },
              yaxis: { title: yKey },
              zaxis: { title: zKey }
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }
  
    if (chartType === 'scatter3d' && xKey && yKey && zKey) {
      return (
        <Plot
          data={[{
            type: 'scatter3d',
            mode: 'markers',
            x: dataRows.map(row => row[xKey]),
            y: dataRows.map(row => row[yKey]),
            z: dataRows.map(row => row[zKey]),
            marker: {
              size: 6,
              color: dataRows.map(row => row[zKey]),
              colorscale: 'Viridis',
              opacity: 0.8
            }
          }]}
          layout={{
            title: '3D Scatter Chart',
            autosize: true,
            scene: {
              xaxis: { title: xKey },
              yaxis: { title: yKey },
              zaxis: { title: zKey }
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }
    
    if (chartType === 'line3d' && xKey && yKey && zKey) {
      return (
        <Plot
          data={[{
            type: 'scatter3d',
            mode: 'lines',
            x: dataRows.map(row => row[xKey]),
            y: dataRows.map(row => row[yKey]),
            z: dataRows.map(row => row[zKey]),
            line: { width: 4, color: '#636efa' }
          }]}
          layout={{
            title: '3D Line Chart',
            scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    if (chartType === 'surface3d' && xKey && yKey && zKey) {
      const xSet = [...new Set(dataRows.map(row => row[xKey]))];
      const ySet = [...new Set(dataRows.map(row => row[yKey]))];
      const zMatrix = ySet.map(yVal =>
        xSet.map(xVal => {
          const match = dataRows.find(row => row[xKey] === xVal && row[yKey] === yVal);
          return match ? Number(match[zKey]) : null;
        })
      );
    
      return (
        <Plot
          data={[{
            type: 'surface',
            x: xSet,
            y: ySet,
            z: zMatrix
          }]}
          layout={{
            title: '3D Surface Plot',
            scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    if (chartType === 'mesh3d' && xKey && yKey && zKey) {
      return (
        <Plot
          data={[{
            type: 'mesh3d',
            x: dataRows.map(row => row[xKey]),
            y: dataRows.map(row => row[yKey]),
            z: dataRows.map(row => row[zKey]),
            opacity: 0.5,
            color: 'rgb(0,100,200)'
          }]}
          layout={{
            title: '3D Mesh Plot',
            scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    if (chartType === 'bubble3d' && xKey && yKey && zKey) {
      return (
        <Plot
          data={[{
            type: 'scatter3d',
            mode: 'markers',
            x: dataRows.map(row => row[xKey]),
            y: dataRows.map(row => row[yKey]),
            z: dataRows.map(row => row[zKey]),
            marker: {
              size: dataRows.map(row => Math.abs(Number(row[zKey])) || 1),
              color: dataRows.map(row => Number(row[zKey])),
              colorscale: 'Viridis',
              opacity: 0.8
            }
          }]}
          layout={{
            title: '3D Bubble Chart',
            scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
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
    const plotlyElement = document.querySelector('.js-plotly-plot');

  if (plotlyElement) {
    window.Plotly.toImage(plotlyElement, { format: 'png', width: 800, height: 600 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `chart-${chartType}-${Date.now()}.png`;
        link.click();
      })
      .catch(err => console.error("Plotly image download failed:", err));
  } else {
    // Fallback for Chart.js
    const chartCanvas = document.querySelector('canvas');
    if (chartCanvas) {
      const image = chartCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `chart-${chartType}-${Date.now()}.png`;
      link.click();
    }
  }
  };

  const downloadPDF = () => {
    const plotlyElement = document.querySelector('.js-plotly-plot') || document.querySelector('canvas');

    if (!plotlyElement) return;
  
    html2canvas(plotlyElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height / 2);
      pdf.save(`chart-${chartType}-${Date.now()}.pdf`);
    }).catch(err => console.error("PDF generation failed", err));
  };

  useEffect(() => {
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
        setZKey('');
      } catch (err) {
        console.error("Failed to fetch upload by ID", err);
      }
    };
    fetchUpload();
  }, []);

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
            <div className={`grid grid-cols-1 ${['bar3d', 'scatter3d', 'line3d', 'surface3d', 'mesh3d', 'bubble3d'].includes(chartType) ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 mb-4`}>

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

              {['bar3d', 'scatter3d', 'line3d', 'surface3d', 'mesh3d', 'bubble3d'].includes(chartType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Z Axis</label>
                  <select
                    onChange={e => setZKey(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select</option>
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              )}

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

            {(xKey && yKey && (chartType === 'bar3d' || chartType === 'scatter3d' ? zKey : true)) && (
              <div className="mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  {renderChart()}
                </div>
              </div>
            )}

            {dataRows.length > 0 && (
              <div className="mt-4 overflow-auto max-h-96 border rounded-md">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="px-4 py-2 font-semibold text-gray-700">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {dataRows.slice(0, 20).map((row, i) => (
                      <tr key={i}>
                        {columns.map(col => (
                          <td key={col} className="px-4 py-2 text-gray-800">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-2 px-2">Showing first 20 rows.</p>
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
