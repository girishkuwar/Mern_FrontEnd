import React from 'react';

export default function DataPreviewTable({ columns = [], dataRows = [] }) {
  return (
    <div className="mt-6 overflow-auto max-h-96 border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {dataRows.slice(0, 20).map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-gray-800 whitespace-nowrap">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2 px-2">Showing first 20 rows.</p>
    </div>
  );
}
