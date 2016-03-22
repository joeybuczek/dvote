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
var options = { 
    percentageInnerCutout : 50, 
    animateScale : false, 
    animationEasing : "easeOutQuart" 
};

// get chartData from data-chartdata on page's span element
var chartData = JSON.parse(document.getElementById('chartData').getAttribute('data-chartdata'));

// create chart
var ctx = document.getElementById('chartCanvas').getContext('2d');
new Chart(ctx).Pie(chartData, options);