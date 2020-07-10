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
  })}
  
  init();

// This function is declared in plots.js, but it is never called in plots.js. It’s 
// instead called by the onchange attribute of the dropdown menu in index.html

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
    
    PANEL.append("h6").text(result.id);
    PANEL.append("h6").text(result.ethnicity);
    PANEL.append("h6").text(result.gender);
    PANEL.append("h6").text(result.age);
    PANEL.append("h6").text(result.location);
    PANEL.append("h6").text(result.bbtype);
    PANEL.append("h6").text(result.wfreq);
  });
}

// SKILL DRILL
// Above modify the buildMetadata() function to populate the Demographic Info panel with 
// the rest of the demographic data when a menu option is selected (not just location)