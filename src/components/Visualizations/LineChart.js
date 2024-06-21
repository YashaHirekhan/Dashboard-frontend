import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { line, area } from 'd3-shape';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (Array.isArray(data) && data && d3Container.current) {
      
      const filteredData = data.filter(d => d.start_year !== null);

      
      const startDateData = filteredData.map(d => ({
        startDate: d.start_year,
      }));

      
      const startDateCounts = {};
      startDateData.forEach(d => {
        const startDate = d.startDate;
        startDateCounts[startDate] = startDateCounts[startDate] ? startDateCounts[startDate] + 1 : 1;
      });

      
      const lineChartData = Object.keys(startDateCounts).map(startDate => ({
        startDate,
        frequency: startDateCounts[startDate]
      }));

      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

     
      select(d3Container.current).select('svg').remove();

     
      const svg = select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#69b3a2');

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#f39c12');

     
      const x = scaleBand()
        .domain(lineChartData.map(d => d.startDate))
        .range([0, width])
        .padding(0.2);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('fill', 'white')
        .style('font-size', '8px');

  
      const y = scaleLinear()
        .domain([0, d3.max(lineChartData, d => d.frequency)])
        .nice()
        .range([height, 0]);

      svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', 'white')
        .style('font-size', '8px');

      
      const lineGenerator = line()
        .x(d => x(d.startDate) + x.bandwidth() / 2)
        .y(d => y(d.frequency));

    
      const areaGenerator = area()
        .x(d => x(d.startDate) + x.bandwidth() / 2)
        .y0(y(0))
        .y1(d => y(d.frequency));

    
      svg.append('path')
        .datum(lineChartData)
        .attr('fill', 'url(#line-gradient)')
        .attr('d', areaGenerator);

    
      svg.append('path')
        .datum(lineChartData)
        .attr('fill', 'none')
        .attr('stroke', 'url(#line-gradient)')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

    
      const tooltip = select(d3Container.current)
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('background-color', 'black')
        .style('color', 'white')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('position', 'absolute')
        .style('pointer-events', 'none');

      const showTooltip = (event, d) => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 1);
        tooltip.html(`Start Date: ${d.startDate}<br>Frequency: ${d.frequency}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      };

      const hideTooltip = () => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      };

      
      svg.selectAll('.dot')
        .data(lineChartData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.startDate) + x.bandwidth() / 2)
        .attr('cy', d => y(d.frequency))
        .attr('r', 2)
        .attr('fill', '#69b3a2')
        .on('mouseover', showTooltip)
        .on('mousemove', showTooltip)
        .on('mouseleave', hideTooltip);
    }
  }, [data]);

  return (
    <div className="d3-component" ref={d3Container}></div>
  );
};

export default LineChart;
