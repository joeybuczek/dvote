// example doughnut chart data
var dataExample = [
    {
        value: 2,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red Delicious"
    },
    {
        value: 3,
        color:"#46BFBD",
        highlight: "#5AD3D1",
        label: "Gala"
    },
    {
        value: 1,
        color:"#FDB45C",
        highlight: "#FFC870",
        label: "Granny Smith"
    }
];

// chart options
var legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%><%}%></li></ul>"
var options = { 
    percentageInnerCutout : 50, 
    animateScale : false, 
    animationEasing : "easeOutQuart",
    legendTemplate : legendTemplate
};

// get chartData from data-chartdata on page's span element
var chartData = JSON.parse(document.getElementById('chartData').getAttribute('data-chartdata'));

// create chart
var ctx = document.getElementById('chartCanvas').getContext('2d');
var pieChart = new Chart(ctx).Pie(chartData, options);
// add legend
legend(document.getElementById('legendDiv'), chartData);






// Chart.js.legend ========================================================================
function legend(parent, data, chart, legendTemplate) {
	legendTemplate = typeof legendTemplate !== 'undefined' ? legendTemplate : "<%=label%>";
    parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;
    // remove possible children of the parent
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }

    var show = chart ? showTooltip : noop;
    datas.forEach(function(d, i) {

        //span to div: legend appears to all element (color-sample and text-node)
        var title = document.createElement('div');
        title.className = 'title';
        parent.appendChild(title);

        var colorSample = document.createElement('div');
        colorSample.className = 'color-sample';
        colorSample.style.backgroundColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
        colorSample.style.borderColor = d.hasOwnProperty('fillColor') ? d.fillColor : d.color;
        title.appendChild(colorSample);
        legendNode=legendTemplate.replace("<%=value%>",d.value);
        legendNode=legendNode.replace("<%=label%>",d.label);
        var text = document.createTextNode(legendNode);
        text.className = 'text-node';
        title.appendChild(text);

        show(chart, title, i);
    });
}

//add events to legend that show tool tips on chart
function showTooltip(chart, elem, indexChartSegment){
    var helpers = Chart.helpers;

    var segments = chart.segments;
    //Only chart with segments
    if(typeof segments != 'undefined'){
        helpers.addEvent(elem, 'mouseover', function(){
            var segment = segments[indexChartSegment];
            segment.save();
            segment.fillColor = segment.highlightColor;
            chart.showTooltip([segment]);
            segment.restore();
        });

        helpers.addEvent(elem, 'mouseout', function(){
            chart.draw();
        });
    }
}

function noop() {}