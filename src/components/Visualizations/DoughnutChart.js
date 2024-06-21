import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';

const DoughnutChart = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (Array.isArray(data) && data && d3Container.current) {
      
      const filteredData = data.filter(d => d.pestle !== null && d.pestle !== undefined && d.pestle !== "");

      
      const pestleCounts = filteredData?.reduce((acc, d) => {
        if (acc[d.pestle]) {
          acc[d.pestle]++;
        } else {
          acc[d.pestle] = 1;
        }
        return acc;
      }, {});

      
      const pieData = Object.keys(pestleCounts).reduce((acc, pestle) => {
        if (pestleCounts[pestle] < 70) {
          const others = acc.find(d => d.pestle === 'Others');
          if (others) {
            others.count += pestleCounts[pestle];
          } else {
            acc.push({ pestle: 'Others', count: pestleCounts[pestle] });
          }
        } else {
          acc.push({ pestle, count: pestleCounts[pestle] });
        }
        return acc;
      }, []);

      const width = 400;
      const height = 260;
      const radius = Math.min(width, height) / 2;

      
      select(d3Container.current).selectAll('svg').remove();

      
      const svg = select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      
      const gradients = [
        { id: 'gradient1', startColor: '#ff0f7b', endColor: '#f89b29' },
        { id: 'gradient2', startColor: '#0061ff', endColor: '#60efff' },
        { id: 'gradient3', startColor: '#f74c06', endColor: '#f9bc2c' },
        { id: 'gradient4', startColor: '#c81d77', endColor: '#6710c2' },
        { id: 'gradient5', startColor: '#adfda2', endColor: '#11d3f3' },
        { id: 'gradient6', startColor: '#51c26f', endColor: '#f2e901' },
        
      ];

      const defs = svg.append('defs');
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
        .domain(pieData.map((d, i) => i))
        .range(gradients.map(gradient => `url(#${gradient.id})`));

      
      const arcGenerator = arc()
        .innerRadius(radius * 0.5) 
        .outerRadius(radius);

      
      const pieLayout = pie()
        .value(d => d.count);

      const arcs = pieLayout(pieData);

      svg.selectAll('path')
        .data(arcs)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d, i) => color(i))
        .style('stroke', '#07144a') 
        .style('stroke-width', '2px') 
        .style('opacity', 1);

      
      const legend = svg.append('g')
        .attr('transform', `translate(${radius + 20},${-radius})`); 

      const legendRows = legend.selectAll('.legend-row')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'legend-row')
        .attr('transform', (d, i) => `translate(0, ${i * 15})`);

      legendRows.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d, i) => color(i));

      legendRows.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .style('font-size', '8px')
        .style('fill', 'white') 
        .text(d => d.pestle);

      
      const tooltip = select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('background-color', 'black')
        .style('color', 'white')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('position', 'absolute')
        .style('pointer-events', 'none');

      const showTooltip = (event, d) => {
        tooltip.style('opacity', 1);
      };

      const moveTooltip = (event, d) => {
        tooltip.html(` ${d.data.pestle}: ${d.data.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      };

      const hideTooltip = () => {
        tooltip.style('opacity', 0);
      };

      
      svg.selectAll('path')
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip);
    }
  }, [data]);

  return (
    <div className="d3-component" ref={d3Container}></div>
  );
};

export default DoughnutChart;
