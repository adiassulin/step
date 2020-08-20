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
google.charts.setOnLoadCallback(drawChart);

/** Creates a chart and adds it to the page. */
function drawChart() {
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