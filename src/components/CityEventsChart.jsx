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
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 60, // increased for rotated labels
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of Events"
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Events per City" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
