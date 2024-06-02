import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #222; /* Dark background color */
  color: #fff; /* Light text color */
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
  background-color: #333; /* Darker chart background color */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); /* Light shadow color */
`;

const ChartTitle = styled.h2`
  text-align: center;
  margin: 20px 0;
`;

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/eve.json")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const jsonData = lines.map((line) => JSON.parse(line));
        setData(jsonData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const alertSeverityData = data.filter((item) => item.event_type === "alert");
  const eventTypeData = data.reduce((acc, item) => {
    const eventType = item.event_type;
    if (!acc[eventType]) {
      acc[eventType] = 0;
    }
    acc[eventType]++;
    return acc;
  }, {});

  const eventTypeChartData = Object.keys(eventTypeData).map((eventType) => ({
    event_type: eventType,
    count: eventTypeData[eventType],
  }));

  const protocolData = data.reduce((acc, item) => {
    const proto = item.proto;
    if (!acc[proto]) {
      acc[proto] = 0;
    }
    acc[proto]++;
    return acc;
  }, {});

  const protocolChartData = Object.keys(protocolData).map((proto) => ({
    proto,
    count: protocolData[proto],
  }));

  const pieColors = ["#82ca9d", "#8884d8", "#ff7f0e", "#8dd1e1", "#ff7373"]; // Add more colors as needed

  return (
    <DashboardContainer>
      <ChartContainer>
        <ChartTitle>Alert Severity Over Time</ChartTitle>
        <LineChart width={800} height={400} data={alertSeverityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="timestamp" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="alert.severity" stroke="#82ca9d" />
        </LineChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Events by Type</ChartTitle>
        <BarChart width={800} height={400} data={eventTypeChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="event_type" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Protocol Distribution</ChartTitle>
        <PieChart width={800} height={400}>
          <Pie
            data={protocolChartData}
            dataKey="count"
            nameKey="proto"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {protocolChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
