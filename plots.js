function init() {
    // Inside init(), the d3.select() method is used to select the dropdown menu, which 
    // has an id of #selDataset. The dropdown menu is assigned to the variable selector.
    var selector = d3.select("#selDataset");
  
    // The d3.json() method is used to read the data from samples.json. The data from 
    // the entire JSON file is assigned the (arbitrary) argument name data.
    d3.json("samples.json").then((data) => {
      console.log(data);
      // Inside the data object, the names array, as seen from console.log(data), 
      // contains the ID numbers of all the study participants. The variable sampleNames 
      // is assigned to this array.
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    buildMetadata(940);
    buildCharts(940);
  })}
  
  

  init();

// The following function is declared in plots.js, but it is never called in plots.js.
// It's instead called by the onchange attribute of the dropdown menu in index.html
    // The argument name newSample refers to the value of the selected menu option. In 
    // index.html, onchange=optionChanged(this.value) passes the selected menu option’s 
    // value to the optionChanged() function. This function gives this information the 
    // argument name newSample. In other words, this.value and newSample are equivalent.



function optionChanged(newSample) {
  // console.log(newSample) replaced with the function calls to instead:
  // 1) populate the info panel
  // 2) visualise the data
  buildMetadata(newSample);
  buildCharts(newSample);
}

// when a dropdown menu option is selected, the ID number is passed in as sample
function buildMetadata(sample) {
  // d3.json() pulls in the entire dataset contained in samples.json and refers to it as data
  d3.json("samples.json").then((data) => {
    // metadata array in the dataset (data.metadata) is assigned the variable metadata
    var metadata = data.metadata;
    // the filter() method is called on the metadata array to filter for an object in the 
    // array whose id property matches the ID number passed into buildMetadata() as sample
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // the results of the filter() method are returned as an array, the first item in the 
    // array (resultArray[0]) is selected and assigned the variable result
    var result = resultArray[0];
    // The id of the Demographic Info panel is sample-metadata. The d3.select() method 
    // is used to select this <div>, and the variable PANEL is assigned to it
    var PANEL = d3.select("#sample-metadata");

    // PANEL.html("") ensures that the contents of the panel are cleared for when 
    // another ID number is chosen from the dropdown menu
    PANEL.html("");
    // the append() and text() methods are chained to append a H6 heading to the panel 
    // and print the location of the volunteer to the panel, respectively
    // PANEL.append("h6").text(result.location);
    
    Object.entries(result).forEach(([key,value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ": " + value);
    })
  });
};

// when menu option selected, ID passed in as sample.
function buildCharts(sample) {
  function buildBarChart(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      sample_values = result.sample_values.slice(0,10).reverse();
      otu = result.otu_ids.slice(0,10).reverse()
      otu_ids = otu.map(x => `OTU ${x}`);
      otu_labels = result.otu_labels.slice(0,10).reverse();
      
      // console.log(sample_values);
      // console.log(otu_ids);
      // console.log(otu_labels);

      var trace = [{
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: 'bar',
        orientation: 'h',
        marker: {
          color: 'coral',
          opacity: 0.6,
          line: {
            color: 'indianred',
            width: 1.5
          }
        }
      }];

      var layout = {
        title: 'Top 10 Bacterial Species (OTUs)',
        xaxis: {
          title: 'Values'
        },
        yaxis: {
          title: 'Operational Taxonomic Unit IDs'
        }
      };

      Plotly.newPlot("bar", trace, layout);
    })
  };

  function buildGauge(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)
      var result = resultArray[0];
      var wfreq = result.wfreq
      // console.log(wfreq)

      var trace = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
          title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", 
                  font: {size: 16}},
          gauge: {
                axis: { range: [null, 9] },
                bar: { color: "lightsalmon" },
                bgcolor: "lightblue",
                steps: [
                  { range: [0, 1], color: "cornsilk"},
                  { range: [1, 2], color: "blanchedalmond"},
                  { range: [2, 3], color: "bisque"},
                  { range: [3, 4], color: "navajowhite"},
                  { range: [4, 5], color: "wheat"},
                  { range: [5, 6], color: "burlywood"},
                  { range: [6, 7], color: "peru"},
                  { range: [7, 8], color: "saddlebrown"},
                  { range: [8, 9], color: "maroon"},
                ],
              }
            }
          ];
  
      var layout = { 
          width: 600, 
          height: 450, 
          margin: { t: 10, b: 10, l:10, r:10 }
        };

      Plotly.newPlot('gauge', trace, layout);
    }
    );
  };

  function buildBubbleChart(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      sample_values = result.sample_values;
      otu_ids = result.otu_ids;
      otu_labels = result.otu_labels;

      var trace = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        },
        type: 'scatter'
      }];

      var layout = {
        title: 'Present Bacterial Species/ Operational Taxonomic Unit (OTUs)',
        xaxis: {
          title: 'Values'
        },
        yaxis: {
          title: 'Prevalence of OTUs'
        }
    };

      Plotly.newPlot("bubble", trace, layout); 
  });
};

  buildBarChart(sample);
  buildGauge(sample);
  buildBubbleChart(sample);
};