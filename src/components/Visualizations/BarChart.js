import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection'; 
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if ( Array.isArray(data)&&data && d3Container.current) {
      const intensityData =data?.map(d => ({
        topic: d.topic,
        intensity: d.intensity
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

      
      const x = scaleBand()
        .domain(intensityData.map(d => d.topic))
        .range([0, width])
        .padding(0.2);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .remove();

      
      const y = scaleLinear()
        .domain([0, Math.max(...intensityData.map(d => d.intensity))])
        .nice()
        .range([height, 0]);

      svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', 'white')
        .style('font-size', '8px');

      
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
        tooltip.html(`Topic: ${d.topic}<br>Intensity: ${d.intensity}`)
          .style('left', `${event.pageX }px`)
          .style('top', `${event.pageY }px`);
      };

      const hideTooltip = () => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      };

      
      svg.selectAll('.bar')
        .data(intensityData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.topic))
        .attr('y', d => y(d.intensity))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.intensity))
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

export default BarChart;
