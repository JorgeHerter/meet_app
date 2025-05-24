import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!allLocations || !events) return;

    const chartData = allLocations.map((location) => {
      const count = events.filter(event => event.location === location).length;
      const city = location.split(', ')[0];
      return { city, count };
    });

    setData(chartData);
  }, [allLocations, events]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {data.length === 0 ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: '#888',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}
        >
          Loading city chart...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis type="category" dataKey="city" name="City" />
            <YAxis type="number" dataKey="count" name="Number of Events" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Events per City" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CityEventsChart;
