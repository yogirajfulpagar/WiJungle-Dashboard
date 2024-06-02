import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
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

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #222;
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px 0;
  background-color: #333;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  padding: 20px;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
`;

const ChartTitle = styled.h2`
  text-align: center;
  margin: 0 0 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #444;
  color: #fff;
  font-size: 16px;

  &::placeholder {
    color: #aaa;
  }
`;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/eve.json")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const jsonData = lines.map((line) => JSON.parse(line));
        setData(jsonData);
        setFilteredData(jsonData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, filter]);

  const alertSeverityData = filteredData.filter(
    (item) => item.event_type === "alert"
  );
  const eventTypeData = filteredData.reduce((acc, item) => {
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

  const protocolData = filteredData.reduce((acc, item) => {
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

  const pieColors = ["#82ca9d", "#8884d8", "#ff7f0e", "#8dd1e1", "#ff7373"];

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <FilterContainer>
          <FilterInput
            type="text"
            placeholder="Search events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </FilterContainer>
        <ChartContainer>
          <ChartTitle>Alert Severity Over Time</ChartTitle>
          <LineChart width={900} height={500} data={alertSeverityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="timestamp" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="alert.severity"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={{ stroke: "#82ca9d", strokeWidth: 2, r: 5 }}
              activeDot={{ stroke: "#fff", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Events by Type</ChartTitle>
          <BarChart width={900} height={500} data={eventTypeChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="event_type" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              fill="#82ca9d"
              barSize={30}
              radius={5}
              animationBegin={800}
            />
          </BarChart>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Protocol Distribution</ChartTitle>
          <PieChart width={900} height={500}>
            <Pie
              data={protocolChartData}
              dataKey="count"
              nameKey="proto"
              cx="50%"
              cy="50%"
              outerRadius={200}
              fill="#8884d8"
              label
              labelLine={false}
              animationBegin={1600}
            >
              {protocolChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" />
          </PieChart>
        </ChartContainer>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;