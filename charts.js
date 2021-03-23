function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var sampleNames = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = sampleNames.filter(sampleObj => sampleObj.id == sample);

     // console.log(filteredSamples);
    // Create a variable that holds the first sample in the array.
    var filteredArray = [filteredSamples[0]];
    //console.log(filteredArray);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    //first create new array that has three columns, then sort in desc order and then slice 10 

    var sortedOtuData = filteredArray.sort((a,b) => 
        a.sample_values - b.sample_values).reverse(); 

    //console.log(sortedOtuData);
      
    var otuIds = sortedOtuData[0].otu_ids.slice(0,10).reverse();
    var otuLabels = sortedOtuData[0].otu_labels.slice(0,10).reverse();
    var otuSampleValues = sortedOtuData[0].sample_values.slice(0,10).reverse();
    
    //console.log(otuIds);
    //console.log(otuLabels);
    //console.log(otuSampleValues);

     // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(data => 'OTU '+ data);

    // Create the trace for the bar chart. 
    var barData = [{x:otuSampleValues,
                    y: yticks,
                    type:"bar",
                    orientation: 'h',
                    hovertext: otuLabels
    }
      
    ];
    // Create the layout for the bar chart. 
    var barLayout = { title:{text: "Top 10 Bactaria Cultures Found",
                            font: {size:20}}
     
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout,{responsive: true});
    // 1. Create the trace for the bubble chart.
    //To create the trace object for the bubble chart in Step 1, 
    //assign the otu_ids, sample_values, and otu_labels to the x, y, and text properties, respectively. 
    //For the mode and marker properties, the mode is "markers" and the marker property is a dictionary 
    //that defines the size, color, and colorscale of the markers.

    var bubbleData = [{
      x:  sortedOtuData[0].otu_ids,
      y: sortedOtuData[0].sample_values,
      mode: 'markers',
      type: 'scatter',
      text: sortedOtuData[0].otu_labels,
      marker: { size: sortedOtuData[0].sample_values ,
                color: sortedOtuData[0].otu_ids  ,
               //color: otuSampleValues  
               colorscale : 'Earth',
              // opacity: 0.90

      },
      hovertext:sortedOtuData[0].otu_labels
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:{text: 'Bacteria Cultures Per Sample',
              font: {size: 20}},
      xaxis: {title: "OTU ID"},
      hovermode: 'closest'
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout,{responsive: true});
    
    //console.log(parseFloat(data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq));
     // 4. Create the trace for the gauge chart.
     var gaugeData = [{
                  domain: { x: [0, 1], y: [0, 1] },
                  value : parseFloat(data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq),
                  title: {text:"Scrubs per Week"},
                  type: "indicator",
                  mode: "gauge+number",
                  gauge: {
                    axis: { range: [null, 10],
                    nticks:5,dtick:2 },
                    bar: { color: "black" },
                    steps: [
                      { range: [0, 2], color: "red" },
                      { range: [2, 4], color: "orange" },
                      { range: [4, 6], color: "yellow" },
                      { range: [6, 8], color: "yellowgreen" },
                      { range: [8, 10], color: "green" }
                    ]}
     }
     
    ];
 
    // 5. Create the layout for the gauge chart.
   var gaugeLayout =  { title:{text:"Belly Button Washing Frequency",
                                font:{size: 20 
                               }} 
     
  }

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout,{responsive: true});


  });
}
