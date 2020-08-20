// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['bar']});
google.charts.load('current', {'packages':['geochart'],'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'});
google.charts.setOnLoadCallback(drawChart);

/** Creates charts and adds it to the page. */
function drawChart() {
  drawEthnicGroups(); 
  drawSheepPeople();
  drawExport();
  drawBetterIsland();


}

/** Fetches favorite island data and uses it to create a chart. */
function drawBetterIsland() {
  fetch('/favorite-city-data').then((response) => response.json())
  .then((favIsland) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Island');
    data.addColumn('number', 'Votes');
    Object.keys(favIsland).forEach((island) => {
      data.addRow([island, favIsland[island]]);
    });

    const options = {
      'title': 'Favorite Island',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById('fav-island-container'));
    chart.draw(data, options);
  });
}

/** Creates a ethnic groups pie charts. */
function drawEthnicGroups() {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Group');
  data.addColumn('number', 'Precentage');
        data.addRows([
          ['Maori', 14.6],
          ['NZ European', 59.1],
          ['other European', 8.5],
          ['other Pacific people', 6.9], 
          ['other Asian', 5.5], 
          ['Chinese', 3.7], 
          ['other', 1.7]
        ]);

  const options = {
    'title': 'Ethnic Group NZ',
    'width':700,
    'height':550
  };

  const chart = new google.visualization.PieChart(
      document.getElementById('nz-chart-container'));
  chart.draw(data, options);
}

function drawSheepPeople() {
  const data = new google.visualization.arrayToDataTable([
          ['Group', 'Count (per million)'],
          ['Sheeps', 29.5],
          ['people', 4.6]]);

  const options = {
    'title': 'sheeps VS. people (2015)',
    'height':600,
    'width':700
  };

  const chart = new google.charts.Bar(document.getElementById('sheep-people-container'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawExport() {
  const data = google.visualization.arrayToDataTable([
          ['Country', 'Popularity'],
          ['China', 23],
          ['Australia', 16.4],
          ['United States', 11.4],
          ['Japan', 5.3],
          ['Belgium', 10.6],
          ['Bulgaria', 10.6],
          ['Czechia', 10.6],
          ['Denmark', 10.6],
          ['Germany', 10.6],
          ['Estonia', 10.6],
          ['Ireland', 10.6],
          ['Greece', 10.6],
          ['Spain', 10.6],
          ['France', 10.6],
          ['Croatia', 10.6],
          ['Italy', 10.6],
          ['Cyprus', 10.6],
          ['Latvia', 10.6],
          ['Lithuania', 10.6],
          ['Luxembourg', 10.6],
          ['Hungary', 10.6],
          ['Malta', 10.6],
          ['Netherlands', 10.6],
          ['Austria', 10.6],
          ['Poland', 10.6],
          ['Portugal', 10.6],
          ['Romania', 10.6],
          ['Slovenia', 10.6],
          ['Slovakia', 10.6],
          ['Finland', 10.6],
          ['Sweden', 10.6]
        ]);

  const options = {
    'title': 'main export partners',
    'height':600,
    'width':700,
    'colors': 'blue',
  };

  const chart = new google.visualization.GeoChart(
      document.getElementById('export-container'));
  chart.draw(data, options);
}