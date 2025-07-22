import React, { useState , useRef } from 'react';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExcelGraphUploader = () => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // Read first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Assuming data is in format: [{ name: 'John', score: 80 }, { name: 'Jane', score: 95 }]
            const labels = jsonData.map(row => row.name);
            const scores = jsonData.map(row => row.score);

            // Set chart data
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Scores',
                        data: scores,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)'
                    }
                ]
            });
        };

        reader.readAsBinaryString(file);
    };

    const downloadJPG = () => {
        const chart = chartRef.current;
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chart.jpg';
        link.click();
      };

    const downloadPDF = () => {
        const chart = chartRef.current;
        const pdf = new jsPDF();
        pdf.addImage(chart.toBase64Image(), 'JPEG', 10, 10, 180, 100);
        pdf.save('chart.pdf');
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="mb-4"
            />

            {chartData && (
                <>
                    <Bar
                        data={chartData}
                        ref={chartRef}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                    <div className="mt-4 space-x-2">
                        <button onClick={downloadJPG} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Download JPG
                        </button>
                        <button onClick={downloadPDF} className="bg-green-500 text-white px-4 py-2 rounded">
                            Download PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExcelGraphUploader;
