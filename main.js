// SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container and group element for the chart
const svgLine = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// LOAD AND TRANSFORM DATA
d3.csv("weather.csv").then(data => {
    // --- CASE 1: FLATTEN ---
    // Determine your fields of interest:
    // - X: Date
    // - Y: Actual Precipitation
    // - Category: City

    // 1.1: Rename and reformat
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear; // Parse dates and get year
        d.precip = +d.actual_precipitation; // Convert precipitation to numeric
    }); 

    // Check your work:
    console.log("=== CASE 1: FLATTEN ===");
    console.log("Raw data:", data);

    // 1.2: Filter
    /*
        Don't make any filters. Set filtered data to be just be `data`.
    */
    const filteredData1 = data;// Your code here!

    // Check your work:
    console.log("Filtered data 1:", filteredData1);

    // 1.3: GROUP AND AGGREGATE
    // "For each city per year, I want the average of actual precipitation."
    const groupedData1 = d3.groups(filteredData1, d => d.city, d => d.year)
        .map(([city, years]) => ({
            city,
            values: years.map(([year, entries]) => ({
                year,
                actualPrecip: d3.mean(entries, e => e.precip)
            }))
        }));

    
    // Check your work:
    console.log("Grouped data 1:", groupedData1);

    // 1.4: FLATTEN
    /* 
        Flatten your data into an array where each element contains an object whose properties are:
            - Your x-variable (date)
            - Your y-variable (avgPrecipitation)
            - Your color variable (city)
    */
    const flattenedData = groupedData1.flatMap(({city, values}) =>
        values.map(({years, actualPrecip}) => ({
            years,
            actualPrecip,
            city
        }))
    );   

    // // Check your work:
    console.log("Final flattened data:", flattenedData);
    console.log("---------------------------------------------------------------------");

    // --- CASE 2: PIVOT ---
    // 2.1: Rename and reformat
    /*
        Uncomment the following code! Hint: highlight and CTRL+/.
    */
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear(); // Parse dates and get year
        d.month = new Date(d.date).getMonth() + 1; // Parse dates and get month (0-based, so add 1)
        d.actualPrecip = +d.actual_precipitation; // Convert precipitation to numeric
        d.avgPrecip = +d.average_precipitation; // Convert to numeric
        d.recordPrecip = +d.record_precipitation; // Convert to numeric
    });

    // Check your work:
    console.log("=== CASE 2: PIVOT ===");
    console.log("Raw data:", data);

    // 2.2: Filter
    /*
        Filter the data to just the year of 2014.
    */
    // const filteredData2 = data.filter(d => d.year === 2014);// Your code here!
    const filteredData2 = data;

    // Check your work:
    console.log("Filtered data 2:", filteredData2);

    // 2.3: Group and aggregate
    /*
        "For each [MONTH], I want the {average of} [AVERAGE], [ACTUAL], and [RECORD PRECIPITATION]."
    */
    const groupedData2 = d3.groups(filteredData2, d => d.month)
        .map(([month, entries]) => ({
            month,
            actualPrecip: d3.mean(entries, e => e.actualPrecip),
            avgPrecip: d3.mean(entries, e => e.avgPrecip),
            recordPrecip: d3.mean(entries, e => e.recordPrecip)
        }));

    // Check your work:
    console.log("Grouped data 2:", groupedData2);

    // 2.4: FLATTEN
    /*
        Flatten your data into an array where each element contains:
            - X-variable (month)
            - Y-variable (precipitation value)
            - Category (measurement type)
    */
    const pivotedData = groupedData2.flatMap(({month, actualPrecip, avgPrecip, recordPrecip}) => [
       {month, preticipation: actualPrecip, measurement: "Actual"},
       {month, preticipation: avgPrecip, measurement: "Average"},
       {month, preticipation: recordPrecip, measurement: "Record"}
    ]);

    // Check your work:
    console.log("Final pivoted data:", pivotedData);
});