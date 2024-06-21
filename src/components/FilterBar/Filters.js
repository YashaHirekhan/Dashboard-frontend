
import React from 'react';
import './Filters.css';

const Filters = ({ data, onFilterChange }) => {
  const endYearOptions = Array.from(new Set(data?.map(item => item.end_year))).filter(option => option !== '');
  const topicOptions = Array.from(new Set(data?.map(item => item.topic))).filter(option => option !== '');
  const sectorOptions = Array.from(new Set(data?.map(item => item.sector))).filter(option => option !== '');
  const regionOptions = Array.from(new Set(data?.map(item => item.region))).filter(option => option !== '');
  const pestleOptions = Array.from(new Set(data?.map(item => item.pestle))).filter(option => option !== '');
  const sourceOptions = Array.from(new Set(data?.map(item => item.source))).filter(option => option !== '');
  const countryOptions = Array.from(new Set(data?.map(item => item.country))).filter(option => option !== '');

  const handleSelectChange = (filterName, value) => {
    onFilterChange({ [filterName]: value });
  };

  return (
    <div className='filter-bar'>
      <div className='filters'>
        <div className='dropdown'>
          <select id="end-year-dropdown" onChange={(e) => handleSelectChange('endYear', e.target.value)}>
            <option value="">End Year</option>
            {endYearOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className='dropdown'>
          <select id="topics-dropdown" onChange={(e) => handleSelectChange('topic', e.target.value)}>
            <option value="">Topics</option>
            {topicOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>            
        </div>

        <div className='dropdown'>
          <select id="sector-dropdown" onChange={(e) => handleSelectChange('sector', e.target.value)}>
            <option value="">Sectors</option>
            {sectorOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>            
        </div>

        <div className='dropdown'>
          <select id="regions-dropdown" onChange={(e) => handleSelectChange('region', e.target.value)}>
            <option value="">Regions</option>
            {regionOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>        
        </div>

        <div className='dropdown'>
          <select id="PEST-dropdown" onChange={(e) => handleSelectChange('pest', e.target.value)}>
            <option value="">PEST</option>
            {pestleOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>        
        </div>

        <div className='dropdown'>
          <select id="source-dropdown" onChange={(e) => handleSelectChange('source', e.target.value)}>
            <option value="">Sources</option>
            {sourceOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>        
        </div>

        <div className='dropdown'>
          <select id="country-dropdown" onChange={(e) => handleSelectChange('country', e.target.value)}>
            <option value="">Countries</option>
            {countryOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>        
        </div>

      </div>
      
    </div>
  );
};

export default Filters;
