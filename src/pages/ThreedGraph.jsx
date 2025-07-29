import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as XLSX from 'xlsx';
import * as THREE from 'three';

// Axis label
const AxisLabels = () => (
  <>
    <Text position={[6, 0, 0]} fontSize={0.5}>X</Text>
    <Text position={[0, 6, 0]} fontSize={0.5}>Y</Text>
    <Text position={[0, 0, 6]} fontSize={0.5}>Z</Text>
  </>
);

// X-axis name labels
const XLabels = ({ labels }) =>
  labels.map((label, i) => (
    <Text key={i} position={[i * 1.5, -0.5, 0]} fontSize={0.4}>
      {label}
    </Text>
  ));

// CHART TYPES
const BarChart = ({ values }) =>
  values.map((val, i) => (
    <mesh key={i} position={[i * 1.5, val / 2, 0]}>
      <boxGeometry args={[1, val, 1]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  ));

const LineChart = ({ values }) => {
  const points = values.map((y, i) => new THREE.Vector3(i * 1.5, y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="orange" />
    </line>
  );
};

const ScatterChart = ({ values }) =>
  values.map((val, i) => (
    <mesh key={i} position={[i * 1.5, val, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="green" />
    </mesh>
  ));

const PieChart = ({ values }) => {
  const total = values.reduce((a, b) => a + b, 0);
  let startAngle = 0;

  return values.map((val, i) => {
    const angle = (val / total) * Math.PI * 2;
    const midAngle = startAngle + angle / 2;
    const radius = 3;
    const x = Math.cos(midAngle) * radius;
    const z = Math.sin(midAngle) * radius;

    const segment = (
      <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0, 2.5, 0.5, 32, 1, false, startAngle, angle]} />
        <meshStandardMaterial color={`hsl(${(i * 50) % 360}, 70%, 60%)`} />
      </mesh>
    );

    startAngle += angle;
    return segment;
  });
};

const ChartDisplay = ({ type, values }) => {
  switch (type) {
    case 'Bar': return <BarChart values={values} />;
    case 'Line': return <LineChart values={values} />;
    case 'Scatter': return <ScatterChart values={values} />;
    case 'Pie': return <PieChart values={values} />;
    default: return null;
  }
};

const ThreeDChartVisualizer = () => {
  const [values, setValues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [chartType, setChartType] = useState('Bar');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Assuming first row is labels and second row is values
      if (rows.length >= 2) {
        const [headerRow, dataRow] = rows;
        const numeric = dataRow.map((v) => parseFloat(v)).filter((v) => !isNaN(v));
        const validLabels = headerRow.slice(0, numeric.length);
        setValues(numeric);
        setLabels(validLabels);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="border p-2 rounded"
        />
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Bar</option>
          <option>Line</option>
          <option>Scatter</option>
          <option>Pie</option>
        </select>
      </div>

      <div style={{ height: '600px', border: '1px solid #ccc' }}>
        <Canvas camera={{ position: [6, 6, 10], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} />
          <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} />
          <AxisLabels />
          {labels.length > 0 && <XLabels labels={labels} />}
          <ChartDisplay type={chartType} values={values} />
          <OrbitControls />
          <GizmoHelper alignment="bottom-right">
            <GizmoViewport labelColor="black" axisHeadScale={1} />
          </GizmoHelper>
        </Canvas>
      </div>
    </div>
  );
};

export default ThreeDChartVisualizer;
