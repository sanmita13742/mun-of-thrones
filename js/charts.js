document.addEventListener("DOMContentLoaded", function () {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(initCharts);

    // Retrieve resources and invasionData from localStorage or set default values
    let resources = JSON.parse(localStorage.getItem('resources')) || {
        "Country 1": { Army: 6.8, Silver: 10.49, Gold: 19.3 },
        "Country 2": { Army: 8.5, Silver: 12.0, Gold: 15.0 }, 
        "Country 3": { Army: 5.0, Silver: 9.0, Gold: 11.0 },
        "Country 4": { Army: 6.8, Silver: 10.49, Gold: 19.3 },
        "Country 5": { Army: 8.5, Silver: 12.0, Gold: 15.0 },
        "Country 6": { Army: 5.0, Silver: 9.0, Gold: 11.0 },
        "Country 7": { Army: 6.8, Silver: 10.49, Gold: 19.3 },
        "Country 8": { Army: 8.5, Silver: 12.0, Gold: 15.0 },
        "Country 9": { Army: 5.0, Silver: 9.0, Gold: 11.0 },
        "Country 10": { Army: 5.0, Silver: 9.0, Gold: 11.0 }
    };

    let invasionData = JSON.parse(localStorage.getItem('invasionData')) || {};


    function initCharts() {
        const countryNumber = getCountryNumber();
        const countryName = "Country " + countryNumber;
    
        if (!resources[countryName]) {
            console.error("Country not found in resources:", countryName);
            return;
        }
    
        console.log('Drawing charts for:', countryName);
        drawPieChart(countryName);
        drawColumnChart(countryName);
    }
    
    function getCountryNumber() {
        const url = window.location.href;
        const match = url.match(/Country(\d+)\.html/);
        return match ? match[1] : 1;
    }

    // Function to draw the pie chart for a country
    function drawPieChart(countryName) {
        if (invasionData[countryName]) {
            let totalInvasion = 0;
            const dataArr = [['Status', 'Value']];

            // Loop through all invaders of this country
            for (const invader in invasionData[countryName]) {
                const percent = invasionData[countryName][invader];
                totalInvasion += percent / 10; // Convert percent to a 10-unit scale
                dataArr.push(['Invaded by ' + invader, percent / 10]);
            }

            // Ensure total invasion does not exceed 10
            totalInvasion = Math.min(totalInvasion, 10);
            const remainingPortion = Math.max(10 - totalInvasion, 0);
            if (remainingPortion > 0) {
                dataArr.push(['Remaining under ' + countryName, remainingPortion]);
            }

            const data = google.visualization.arrayToDataTable(dataArr);

            const options = {
                title: countryName + " (" + (totalInvasion * 10) + "% Invaded)",
                pieHole: 0.4,
                slices: { 0: { color: 'red' }, 1: { color: '#6f9654' }, 2: { color: 'blue' } },
                height: 400,
                width: '100%'
            };

            const chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            chart.draw(data, options);

            // Display a message indicating the extent of invasion
            document.getElementById('invasionMessage').innerText =
                countryName + " has been invaded by " + Object.keys(invasionData[countryName]).length + " countries!";
        } else {
            // Normal case for non-invaded countries
            let totalResources = resources[countryName].Army + resources[countryName].Silver + resources[countryName].Gold;
            totalResources = Math.min(totalResources, 10); // Ensure total resources don't exceed 10
            const notOccupied = Math.max(10 - totalResources, 0);

            const data = google.visualization.arrayToDataTable([
                ['Occupancy', 'Area Occupied'],
                ['Not Occupied', notOccupied],
                ['Occupied by ' + countryName, totalResources]
            ]);

            const options = {
                title: countryName,
                pieHole: 0.4,
                slices: { 0: { color: '#e0440e' }, 1: { color: '#6f9654' } },
                height: 400,
                width: '100%'
            };

            const chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            chart.draw(data, options);
        }
    }

    function drawColumnChart(countryName) {
        const data = google.visualization.arrayToDataTable([
            ["Resources", "Available", { role: "style" }],
            ["Army (Lakhs)", resources[countryName].Army, "#b87333"],
            ["Silver", resources[countryName].Silver, "silver"],
            ["Gold", resources[countryName].Gold, "gold"]
        ]);

        const options = {
            title: "Resources of " + countryName,
            height: 400,
            width: '100%',
            bar: { groupWidth: "95%" },
            legend: { position: "none" }
        };

        const chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(data, options);
    }

    // Invade button click event handler
    document.getElementById("invadeButton").addEventListener("click", function () {
        const invader = document.getElementById("invaderSelect").value;
        const invaded = document.getElementById("invadedSelect").value;
        const percent = parseFloat(document.getElementById("percentInput").value);

        if (invader !== invaded && !isNaN(percent) && percent > 0 && percent <= 100) {
            // Mark the invaded country with the invasion percentage
            if (!invasionData[invaded]) {
                invasionData[invaded] = {};
            }
            invasionData[invaded][invader] = percent;
            localStorage.setItem('invasionData', JSON.stringify(invasionData));

            // Update the pie chart for the invaded country
            drawPieChart(invaded);
        } else {
            alert("Invalid input! Make sure the countries are different and the invasion percentage is between 1 and 100.");
        }
    });

    // Update resources and store them in localStorage
    document.getElementById("updateButton").addEventListener("click", function () {
        const country = document.getElementById("countrySelect").value;
        const resourceType = document.getElementById("resourceSelect").value;
        const newValue = parseFloat(document.getElementById("resourceValue").value);

        if (!isNaN(newValue) && newValue >= 0) {
            resources[country][resourceType] = newValue;
            localStorage.setItem('resources', JSON.stringify(resources));

            drawPieChart(country);
            drawColumnChart(country);
        } else {
            alert("Please enter a valid number");
        }
    });
});
