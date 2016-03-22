// This function takes an object and returns a formatted pie/doughnut Chart.js data object
module.exports = function (dataObj) {
    var choices = dataObj.choices;
    var returnObj = [];
    var colorChoice = {};
    
    // loop through choices
    for (var i = 0; i < choices.length; i++) {
        // get random color from color array
        colorChoice = colorPicker();
        // push into returnObj
        returnObj.push({
            label: choices[i].label,
            value: choices[i].value,
            color: colorChoice.color,
            highlight: colorChoice.highlight
        });
    }
    
    // return array
    return returnObj;
};

// chart colors function and array
function colorPicker(index) {
    return chartColors[Math.floor(Math.random() * chartColors.length)];
}

var chartColors = [
    {
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    },
    {
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "Grey"
    },
    {
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey"
    },
    {
        color: "#ff3399",
        highlight: "#ff80bf",
        label: "Fuschia"
    },
    {
        color: "#ff9966",
        highlight: "#ffccb3",
        label: "Orange"
    },
    {
        color: "#33ccff",
        highlight: "#99e6ff",
        label: "Blue"
    }
];


// examples showing schemas
var exampleDataObj = { 
    id: 1,
    name: 'Apples!', 
    author: 'JohnnyApplecore@gmail.com',
    description: 'What is your favorite type of apple?', 
    choices: [
        {label:'Gala', value: 3},
        {label:'Red Delicious', value: 2},
        {label:'Granny Smith', value: 1}
    ],
    voters: ['username1','username2','ipaddress1']
};
var exampleReturnObj = [
    {
        value: 2,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red Delicious"
    }
];