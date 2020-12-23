var date = new Date()
var PATH_TO_STATS = "data/stats.json?t=" + date.getTime()

function ajaxGet(path, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200){
            callback(this)
        }
    }
    xhttp.open("GET", path)
    xhttp.send()
}

function GetSortOrderDesc(prop){
   return function(a,b){
      if( a[prop] < b[prop]){
          return 1;
      }else if( a[prop] > b[prop] ){
          return -1;
      }
      return 0;
   }
}

function getData() {
    ajaxGet(PATH_TO_STATS, function (response){
        var data = JSON.parse(response.responseText);
        console.log(data);
        //push data into an array
        let sortArray = [];
        for (let plugin in data){
            let item = data[plugin];
            item.name = plugin;
            sortArray.push(item);
        }
        console.log(sortArray);
        // sort based on totals
        sortArray.sort(GetSortOrderDesc('total'));
        console.log(sortArray);
        for (let plugin in sortArray){
            window.setTimeout(add_elements, 5, sortArray[plugin]);
        }
    })
}

function add_elements(plugin){
    // Adds the necessary containers & buttons to the page
    var container = document.getElementById('statsOverview').children[0];
    if (container){
        var pluginContainer = document.createElement("div")
        pluginContainer.id = plugin.name + "Container"
        pluginContainer.className = "col-md-12 row"

        var versionGraph = document.createElement("div")
        versionGraph.id = plugin.name + "Version"
        versionGraph.className = "col-md-6"
        pluginContainer.appendChild(versionGraph)

        var historyGraph = document.createElement("div")
        historyGraph.id = plugin.name + "History"
        historyGraph.className = "col-md-6"
        pluginContainer.appendChild(historyGraph)

        container.appendChild(pluginContainer)
        
        if(window.location.hash == "#" + pluginContainer.id){
            window.location.href = "#" + pluginContainer.id;
        }
        
        
        createVersionsChart(plugin, plugin.name + "Version", names[plugin.name] + " Versions");
        createHistoryChart(plugin, plugin.name + "History", names[plugin.name] + " History (30 days)")
    }

    var btnContainer = document.getElementById("btnContainer")
    if (btnContainer){
        var buttonHTML = '<a href="#' + plugin.name + 'Container" class="dropdown-item">' +
            names[plugin.name] +
            '</a>'
        btnContainer.innerHTML = btnContainer.innerHTML + buttonHTML
    }
}

function createVersionsChart(data, element, name) {
    console.log(data)
    try {
        var values = []
        var labels = []
        for (let version in data.versions) {
            labels.push(version)
            values.push(data.versions[version].instances)
        }
        var chartData = [{
            values: values,
            labels: labels,
            hole: .4,
            type: "pie",
        }]
        var layout = {
            title: name,
            annotations: [
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: data.total
                }
            ],
        }
        Plotly.newPlot(element, chartData, layout)
    } catch (error) {
        console.log(name, error)
    }
}

function createHistoryChart(data, element, name){
    try{
        var x_vals = []
        var versions = []
        for (let date in data.history){
            x_vals.push(data.history[date].date)
            for (let version in data.history[date].versions){
                if (!versions.includes(version)){
                    versions.push(version)
                }
            }
        }
        var lines = []

        for (let versionIndex in versions) {
            var version = versions[versionIndex]
            var y_vals = []
            for (let date in data.history) {
                try {
                    y_vals.push(data.history[date].versions[version].instances)
                } catch (e) {
                    // if the version didn't exist on that date, line should be at 0
                    y_vals.push(0)
                }
            }
            lines.push({
                x: x_vals,
                y: y_vals,
                mode: 'lines',
                name: version
            })
        }
        layout = {
            title: name,
        }
        Plotly.newPlot(element, lines, layout)
    } catch (e) {
        console.log(name, e)
    }

}

// When the user scrolls down 100px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  //Get the button:
  var mybutton = document.getElementById("top_btn");
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function loadPage() {
    getData()
}

loadPage()
