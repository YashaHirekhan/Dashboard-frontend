import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection'; 
import * as d3 from 'd3';
import worldGeoJSON from './data/world.geojson';
import countryCoordinates from './data/country-coordinates.json';  // Assuming this is your mapping file

const WorldMap = ({ data }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (Array.isArray(data)&& data && d3Container.current) {
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const width = 500 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            
            select(d3Container.current).select('svg').remove();

           
            const svg = select(d3Container.current)
                          .append('svg')
                          .attr('width', width + margin.left + margin.right)
                          .attr('height', height + margin.top + margin.bottom)
                          .append('g')
                          .attr('transform', `translate(${margin.left},${margin.top})`);

           
            const projection = d3.geoMercator()
                .center([0, 20])
                .scale(150)
                .translate([width / 2, height / 2]);

            
            d3.json(worldGeoJSON).then(dataGeo => {


              
                const allRegions = Array.from(new Set(data?.map(d => d.region)));
                
                const customColors = [ '#5500FF', '#0C45FF', '#1BFF41', '#FF6C0A','#7F00AD', '#ca73ef', '#FF6C0A', '#ff0a54'];

                const color = d3.scaleOrdinal()
                    .domain(allRegions)
                    .range(customColors);


                
                const valueExtent = d3.extent(data, d => +d.intensity);
                const size = d3.scaleSqrt()
                    .domain(valueExtent)
                    .range([1, 50]);

                
                svg.append('g')
                    .selectAll('path')
                    .data(dataGeo.features)
                    .join('path')
                    .attr('fill', '#5C6FB8')
                    .attr('d', d3.geoPath().projection(projection))
                    .style('stroke', 'none')
                    .style('opacity', 0.3);

                
                const mappedData = data?.map(d => {
                    const coords = countryCoordinates[d.country];
                    return {
                        ...d,
                        lat: coords ? coords.lat : null,
                        lon: coords ? coords.lon : null
                    };
                }).filter(d => d.lat && d.lon);  

                
                svg.selectAll('circle')
                    .data(mappedData)
                    .join('circle')
                    .attr('cx', d => projection([+d.lon, +d.lat])[0])
                    .attr('cy', d => projection([+d.lon, +d.lat])[1])
                    .attr('r', d => size(+d.intensity))
                    .style('fill', d => color(d.region))
                    .attr('stroke', d => d.intensity > 2000 ? 'black' : 'none')
                    .attr('stroke-width', 1)
                    .attr('fill-opacity', 0.4);

                
                const tooltip = select(d3Container.current)
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)
                    .style('background-color', 'black')
                    .style('color', 'white')
                    .style('border-radius', '5px')
                    .style('padding', '10px')
                    .style('position', 'absolute')
                    .style('pointer-events', 'none')
                    .style('max-width', '300px');

                const showTooltip = (event, d) => {
                    tooltip.transition()
                        .duration(100)
                        .style('opacity', 1);
                    tooltip.html(`Title: ${d.title} <br>Country: ${d.country} <br> Region: ${d.region}<br>Intensity: ${d.intensity}`)
                        .style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY + 10}px`);
                };

                const hideTooltip = () => {
                    tooltip.transition()
                        .duration(100)
                        .style('opacity', 0)
                };

                svg.selectAll('circle')
                    .on('mouseover', (event, d) => showTooltip(event, d))
                    .on('mousemove', (event, d) => showTooltip(event, d)) 
                    .on('mouseleave', hideTooltip);
            });
        }
    }, [data]);

    return (
        <div className="d3-component" ref={d3Container}></div>
    );
};

export default WorldMap;
