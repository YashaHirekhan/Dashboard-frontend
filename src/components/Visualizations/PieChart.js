import React, { useEffect, useRef } from 'react';
import { select, arc, pie, scaleOrdinal } from 'd3';

const PieChart = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (Array.isArray(data)&&data && d3Container.current) {
      const sectorData = data?.reduce((acc, d) => {
        if (d.sector) {
          acc[d.sector] = (acc[d.sector] || 0) + 1;
        }
        return acc;
      }, {});

      
      const sectors = Object.keys(sectorData)
        .map(sector => ({
          sector,
          count: sectorData[sector],
        }))
        .filter(d => d.count >= 20);

      const othersCount = Object.keys(sectorData)
        .map(sector => sectorData[sector])
        .filter(count => count < 20)
        .reduce((a, b) => a + b, 0);

      if (othersCount > 0) {
        sectors.push({
          sector: 'Others',
          count: othersCount,
        });
      }

      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = 400 - margin.left - margin.right;
      const height = 290 - margin.top - margin.bottom;
      const radius = Math.min(width, height) / 2;

      
      select(d3Container.current).select('svg').remove();

     
      const svg = select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    
      const defs = svg.append('defs');


      const gradients = [
        { id: 'gradient1', startColor: '#ff0f7b', endColor: '#f89b29' },
        { id: 'gradient2', startColor: '#0061ff', endColor: '#60efff' },
        { id: 'gradient3', startColor: '#f74c06', endColor: '#f9bc2c' },
        { id: 'gradient4', startColor: '#c81d77', endColor: '#6710c2' },
        { id: 'gradient5', startColor: '#adfda2', endColor: '#11d3f3' },
        { id: 'gradient6', startColor: '#51c26f', endColor: '#f2e901' },
        
      ];

      gradients.forEach((gradient, index) => {
        const gradientDef = defs.append('linearGradient')
          .attr('id', gradient.id)
          .attr('gradientTransform', 'rotate(90)');
        
        gradientDef.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', gradient.startColor);
        
        gradientDef.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', gradient.endColor);
      });

      
      const color = scaleOrdinal()
        .domain(sectors.map(d => d.sector))
        .range(gradients.map(gradient => `url(#${gradient.id})`));

      
      const pieGenerator = pie()
        .value(d => d.count)
        .sort(null);

      const arcGenerator = arc()
        .innerRadius(0)
        .outerRadius(radius);

      
      const arcs = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('.arc')
        .data(pieGenerator(sectors))
        .enter()
        .append('g')
        .attr('class', 'arc');

      arcs.append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data.sector))
        .style('stroke', '#07144a') 
        .style('stroke-width', '3px') 
        .on('mouseover', (event, d) => {
          tooltip.style('opacity', 1);
        })
        .on('mousemove', (event, d) => {
          tooltip.html(`${d.data.sector}: ${d.data.count}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });

      const tooltip = select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('background-color', 'black')
        .style('color', 'white')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('position', 'absolute')
        .style('pointer-events', 'none');

      
      const legend = svg.append('g')
        .attr('transform', `translate(${width - 30},${20})`);

      sectors.forEach((d, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0,${i * 15})`);

        legendRow.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', color(d.sector));

        legendRow.append('text')
          .attr('x', 15)
          .attr('y', 10)
          .attr('text-anchor', 'start')
          .style('font-size', '8px')
          .style('fill', 'white')
          .text(d.sector);
      });

    }
  }, [data]);

  return (
    <div className="d3-component" ref={d3Container}></div>
  );
};

export default PieChart;
