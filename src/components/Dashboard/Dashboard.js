import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Filters from '../FilterBar/Filters';
import BarChart from '../Visualizations/BarChart';
import WorldMap from '../Visualizations/Map';
import PieChart from '../Visualizations/PieChart';
import LineChart from '../Visualizations/LineChart';
import DoughnutChart from '../Visualizations/DoughnutChart';
import './Dashboard.css';

const InfoCard = ({ title, subtitle }) => (
  <div className="info-card">
    <h3>{title}</h3>
    <p>{subtitle}</p>
  </div>
);

const Dashboard = ({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    country: ''
  });

  const filterData = (data, filters) => {
    return data.filter(item => {
      const {
        endYear,
        topic,
        sector,
        region,
        pest,
        source,
        country
      } = filters;

      if (endYear && item.end_year !== endYear) {
        return false;
      }

      if (topic && item.topic !== topic) {
        return false;
      }

      if (sector && item.sector !== sector) {
        return false;
      }

      if (region && item.region !== region) {
        return false;
      }

      if (pest && item.pestle !== pest) {
        return false;
      }

      if (source && item.source !== source) {
        return false;
      }

      if (country && item.country !== country) {
        return false;
      }

      return true;
    });
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    const filtered = filterData(data, updatedFilters);
    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="dashboard-container">
      <Header />
      <Filters data={data} onFilterChange={handleFilterChange} />
      <div className="dashboard-visuals">
        <div className='left'>
          <div className="card">
            <BarChart className="v" data={filteredData} />
            <InfoCard title="Bar Chart" subtitle="Represents Topic Wise Intensity." />
          </div>
          <div className="card">
            <LineChart className="v" data={filteredData} />
            <InfoCard title="Line Chart" subtitle="Represents the number of projects started in a year." />
          </div>
        </div>
        <div className='middle'>
          <div className="mapcard ">
            <WorldMap className="v" data={filteredData} />
            <div className="map-info-card">
              <h3>World Map Chart</h3>
              <p>Represents countries and regions where projects took place and the size of bubble show the intensity.</p>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className="card">
            <PieChart className="v" data={filteredData} />
            <InfoCard title="Pie Chart" subtitle="Represents the projects based on the respective sector." />
          </div>
          <div className="card">
            <DoughnutChart className="v" data={filteredData} />
            <InfoCard title="Doughnut Chart" subtitle="Represents the projects based on the respective pestles." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
