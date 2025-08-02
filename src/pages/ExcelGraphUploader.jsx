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

import FileDropZone from '../components/FileDropZone';
import ChartTypeSelector from '../components/ChartTypeSelector';
import AxisSelectorGroup from '../components/AxisSelectorGroup';
import DataPreviewTable from '../components/DataPreviewTable';

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
  const [fileName, setFileName] = useState('');
  const { id } = useParams();

  const handleFileUpload = async (file) => {
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
      setFileName(file.name);

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
      } catch (err) {
        console.error("Error sending data to server:", err);
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
    const common3D = {
      x: dataRows.map(row => row[xKey]),
      y: dataRows.map(row => row[yKey]),
      z: dataRows.map(row => row[zKey]),
    };

    switch (chartType) {
      case 'bar3d':
      case 'scatter3d':
        return (
          <Plot
            data={[{
              ...common3D,
              type: 'scatter3d',
              mode: 'markers',
              marker: {
                size: 6,
                color: common3D.z,
                colorscale: 'Viridis',
                opacity: 0.8
              }
            }]}
            layout={{
              title: '3D Scatter',
              scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } }
            }}
            style={{ minHeight: '500px', width: '100%', height: '100%' }}
          />
        );

      case 'line3d':
        return (
          <Plot
            data={[{
              ...common3D,
              type: 'scatter3d',
              mode: 'lines',
              line: { width: 4, color: '#636efa' }
            }]}
            layout={{
              title: '3D Line',
              scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } }
            }}
            style={{ minHeight: '500px', width: '100%', height: '100%' }}
          />
        );

      case 'surface3d': {
        const xSet = [...new Set(common3D.x)];
        const ySet = [...new Set(common3D.y)];
        const zMatrix = ySet.map(yVal =>
          xSet.map(xVal => {
            const match = dataRows.find(row => row[xKey] === xVal && row[yKey] === yVal);
            return match ? Number(match[zKey]) : null;
          })
        );

        return (
          <Plot
            data={[{ type: 'surface', x: xSet, y: ySet, z: zMatrix }]}
            layout={{
              title: '3D Surface',
              scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } }
            }}
            style={{ minHeight: '500px', width: '100%', height: '100%' }}
          />
        );
      }

      case 'mesh3d':
        return (
          <Plot
            data={[{
              ...common3D,
              type: 'mesh3d',
              opacity: 0.5,
              color: 'rgb(0,100,200)'
            }]}
            layout={{
              title: '3D Mesh',
              scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } }
            }}
            style={{ minHeight: '500px', width: '100%', height: '100%' }}
          />
        );

      case 'bubble3d':
        return (
          <Plot
            data={[{
              ...common3D,
              type: 'scatter3d',
              mode: 'markers',
              marker: {
                size: common3D.z.map(z => Math.abs(Number(z)) || 1),
                color: common3D.z,
                colorscale: 'Viridis',
                opacity: 0.8
              }
            }]}
            layout={{
              title: '3D Bubble',
              scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } }
            }}
            style={{ minHeight: '500px', width: '100%', height: '100%' }}
          />
        );

      case 'bar': return <Bar data={getChartData()} options={{ responsive: true }} />;
      case 'line': return <Line data={getChartData()} options={{ responsive: true }} />;
      case 'pie': return <Pie data={getChartData()} options={{ responsive: true }} />;
      case 'doughnut': return <Doughnut data={getChartData()} options={{ responsive: true }} />;
      case 'scatter': return <Scatter data={getChartData()} options={{ responsive: true }} />;
      default: return null;
    }
  };

  const downloadChart = () => {
    const plotlyElement = document.querySelector('.js-plotly-plot');
    if (plotlyElement) {
      window.Plotly.toImage(plotlyElement, { format: 'png', width: 800, height: 600 })
        .then(dataUrl => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `chart-${chartType}-${Date.now()}.png`;
          link.click();
        });
    } else {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `chart-${chartType}-${Date.now()}.png`;
        link.click();
      }
    }
  };

  const downloadPDF = () => {
    const element = document.querySelector('.js-plotly-plot') || document.querySelector('canvas');
    if (!element) return;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height / 2);
      pdf.save(`chart-${chartType}-${Date.now()}.pdf`);
    });
  };

  useEffect(() => {
    const fetchUpload = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/excel/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const jsonData = res.data.data;
        setDataRows(jsonData);
        setColumns(Object.keys(jsonData[0]));
        setXKey(Object.keys(jsonData[0])[0] || '');
        setYKey(Object.keys(jsonData[0])[1] || '');
        setZKey(Object.keys(jsonData[0])[2] || '');
      } catch (err) {
        console.error("Failed to fetch upload:", err);
      }
    };
    fetchUpload();
  }, [id]);

  const is3D = ['bar3d', 'scatter3d', 'line3d', 'surface3d', 'mesh3d', 'bubble3d'].includes(chartType);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center" style={{ backgroundImage: "url('/wave.svg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-6 mt-9">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Excel to Dynamic Chart</h2>

        {fileName && <p className="text-center text-gray-600 text-sm mb-4">Uploaded: <span className="font-medium text-blue-600">{fileName}</span></p>}

        {!id && dataRows.length === 0 && <FileDropZone onFileSelect={handleFileUpload} />}

        {columns.length > 0 && (
          <>

            <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
            <AxisSelectorGroup
              chartType={chartType}
              xKey={xKey}
              yKey={yKey}
              zKey={zKey}
              setXKey={setXKey}
              setYKey={setYKey}
              setZKey={setZKey}
              columns={columns}
            />

            {(xKey && yKey && (!is3D || zKey)) && (
              <div className="mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  {renderChart()}
                </div>
              </div>
            )}


            <DataPreviewTable columns={columns} dataRows={dataRows} />

            <div className="flex justify-center mt-7">
              <button onClick={downloadChart} className="px-4 py-2 mx-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Download PNG</button>
              <button onClick={downloadPDF} className="px-4 py-2 mx-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Download PDF</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExcelGraphUploader;
