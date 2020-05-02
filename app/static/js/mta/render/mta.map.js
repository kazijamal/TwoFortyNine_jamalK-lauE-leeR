let createMapSVG = () => {
    let map = d3.select('#choropleth-container')
        .append('svg')
        .attr('id', 'map')
        .attr('width', '100%')
        .attr('viewBox', [73.94, -40.70, 975, 610])
        .append('g')
        .attr('transform', 'translate(100)');

    let legend = map.append('g')
        .attr('id', 'legend')
        .attr("width", 320)
        .attr("height", 50)
        .attr('transform', 'translate(120,20)')
        .attr("viewBox", [0, 0, 320, 50]);

    legend.append('g').attr('id', 'legend-colors');
    legend.append('g').attr('id', 'legend-ticks-container');

    return map;
}

let renderMapSVG = (svg, ridership, zipcodes, colorMapper, zipCases) => {

    let projection = d3.geoMercator()
        .scale(50000)
        .center([-73.94, 40.70])
    let path = d3.geoPath(projection)

    let borders = topojson.mesh(zipcodes, zipcodes.objects.zip_codes);
    zipcodes = topojson.feature(zipcodes, zipcodes.objects.zip_codes).features;

    // TODO: delete stops with the same name and combine their stops
    let color = (colorMapper, d) => {
        let c = colorMapper(zipCases[d]);
        if (c == undefined) {
            return 'lightgrey';
        }
        return c;
    }

    svg.selectAll('.zipcode-area')
        .data(zipcodes)
        .join(
            enter => {
                return enter.append('path')
                    .attr('d', path)
                    .attr('class', 'zipcode-area')
                    .attr('fill', d => {
                        return color(colorMapper, d.properties.zcta)
                    })
            }
        );

    svg.append("path")
        .datum(borders)
        .attr("fill", "none")
        .attr("class", "zipcode-border")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    legend(colorMapper, 'Number of Positive COVID-19 Cases', 6, 320, 50, 18, 0, 22, 0, 5, 'd')
}

function legend(
    color,
    title,
    tickSize = 6,
    width = 320,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues) {

    let x = d3.scaleLinear()
        .domain([0, color.range().length])
        .rangeRound([marginLeft, width - marginRight]);

    d3.select('#legend-colors')
        .selectAll('rect')
        .data(color.range())
        .join(
            enter => enter.append('rect')
                .attr('x', (d, i) => x(i - 1))
                .attr('y', marginTop)
                .attr('width', (d, i) => x(i) - x(i - 1))
                .attr('height', height - marginTop - marginBottom)
                .attr('fill', d => d)
        );

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    const thresholds = color.thresholds();
    const thresholdFormat = d => Math.round(d);
    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);

    d3.select("#legend-ticks").remove();

    d3.select('#legend-ticks-container')
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr('id', 'legend-ticks')
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));
}

export { createMapSVG, renderMapSVG };