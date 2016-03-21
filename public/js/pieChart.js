var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    }
];
var options = { 
    percentageInnerCutout : 50, 
    animateScale : false, 
    animationEasing : "easeOutBounce" 
};
var ctx = document.getElementById('chartCanvas').getContext('2d');
new Chart(ctx).Pie(data, options);