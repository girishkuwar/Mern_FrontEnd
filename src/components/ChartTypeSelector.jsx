import React from 'react';

const chartTypes = {
  '2d': [
    { type: 'bar', label: 'Bar Chart', icon: 'bar_chart' },
    { type: 'line', label: 'Line Chart', icon: 'show_chart' },
    { type: 'pie', label: 'Pie Chart', icon: 'pie_chart' },
    { type: 'doughnut', label: 'Doughnut', icon: 'donut_small' },
    { type: 'scatter', label: 'Scatter', icon: 'scatter_plot' }
  ],
  '3d': [
    { type: 'bar3d', label: '3D Column', icon: 'view_column' },
    { type: 'scatter3d', label: '3D Scatter', icon: 'bubble_chart' },
    { type: 'line3d', label: '3D Line', icon: 'timeline' },
    { type: 'surface3d', label: '3D Surface', icon: 'terrain' },
    { type: 'mesh3d', label: '3D Mesh', icon: 'grid_on' },
    { type: 'bubble3d', label: '3D Bubble', icon: 'blur_circular' }
  ]
};

export default function ChartTypeSelector({ chartType, setChartType }) {
  const is3D = chartType.includes('3d');

  const handleMainTypeClick = (type) => {
    setChartType(type === '2d' ? 'bar' : 'bar3d'); // default sub-type
  };

  const handleSubTypeClick = (subType) => {
    setChartType(subType);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Select Chart Type</h3>

      {/* 2D / 3D Selector */}
      <div className="flex gap-4 mb-6">
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer w-32 text-center transition 
          ${!is3D
              ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handleMainTypeClick('2d')}
        >
          <span className="material-icons text-3xl mb-2">view_agenda</span>
          2D Chart
        </div>
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer w-32 text-center transition 
          ${is3D
              ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handleMainTypeClick('3d')}
        >
          <span className="material-icons text-3xl mb-2">view_in_ar</span>
          3D Chart
        </div>
      </div>

      {/* Chart Subtype Options */}
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-3">
          {is3D ? 'Select a 3D Chart' : 'Select a 2D Chart'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {chartTypes[is3D ? '3d' : '2d'].map((chart) => (
            <div
              key={chart.type}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer text-center transition
              ${chartType === chart.type
                  ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => handleSubTypeClick(chart.type)}
            >
              <span className="material-icons text-3xl mb-2">{chart.icon}</span>
              {chart.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
