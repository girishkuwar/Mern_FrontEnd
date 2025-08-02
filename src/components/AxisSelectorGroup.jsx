import React from 'react';

export default function AxisSelectorGroup({ chartType, xKey, yKey, zKey, setXKey, setYKey, setZKey, columns }) {
  const is3D = ['bar3d', 'scatter3d', 'line3d', 'surface3d', 'mesh3d', 'bubble3d'].includes(chartType);

  const renderSelectBox = (label, value, setValue) => (
    <div className="w-40 p-4 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition">
      <label className="block text-sm font-semibold mb-2 text-gray-800 text-center">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      >
        <option value="">Select</option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-start">
      {renderSelectBox('X Axis', xKey, setXKey)}
      {renderSelectBox('Y Axis', yKey, setYKey)}
      {is3D && renderSelectBox('Z Axis', zKey, setZKey)}
    </div>
  );
}
