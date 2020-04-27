window.onload = async () => {
    let svg = createSVG();
    let boroughs = await getNYCBoroughs();
    // let neighborhoods = await getNYCNeighborhoods();
    let stops = await getSubwayStops();

    let projection = d3.geoMercator()
        .scale(50000)
        .center([-73.94, 40.70])
    let path = d3.geoPath(projection)

    let count = 0;

    let station_names = Array()
    for (const station in stops) {
        let name = stops[station]['properties']['stop_name']
        if(!station_names.includes(name)) {
            count++;
            station_names.push(name)
        } else {
            console.log(stops[station], station_names[station_names.indexOf(name)])
        }
        // console.log(stops[station]['properties']['stop_name'])
    }
    console.log(count)
    // svg.selectAll('.subway-stop')
    //     .data(stops)
    //     .join(
    //         enter => {
    //             return enter.append('path')
    //                 .attr('d', path)
    //                 .attr('class', 'subway-stop')
    //                 .attr('fill', d => {
    //                     count++;
    //                     console.log(d.properties.stop_name, d.properties.trains)
    //                     return 'red'
    //                 })
    //         }
    //     );

    console.log(count);
}

let createSVG = () => {
    return d3.select('body').append('svg')
        .attr('id', 'map')
        .attr('width', '75%')
        .attr('viewBox', [73.94, -40.70, 975, 610])
        .append('g');
}

let getNYCBoroughs = async () => {
    let boroughs = await d3.json('static/json/boroughs.json');

    return topojson.feature(boroughs, boroughs.objects.boroughs).features;
}

let getNYCNeighborhoods = async () => {
    let neighborhoods = await d3.json('static/json/neighborhoods.json');

    return neighborhoods.features;
}

let getSubwayStops = async () => {
    let stops = await d3.json('static/json/subway_stops.json')

    // console.log(stops)
    return topojson.feature(stops, stops.objects.subway_stops).features;

}