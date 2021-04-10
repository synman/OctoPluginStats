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
        //console.log(data);
        //push data into an array
        let sortArray = [];
        for (let plugin in data){
            let item = data[plugin];
            item.name = plugin;
            sortArray.push(item);
        }
        //console.log(sortArray);
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
        pluginContainer.id = plugin.name + "Issues"
        pluginContainer.className = "col-md-6"

        container.appendChild(pluginContainer)

        createIssueChart(plugin, plugin.name + "Issues", plugin.title + " Issues (30 days) " + plugin.total + " Instances")
        if(window.location.hash == "#" + pluginContainer.id){
            window.location.href = "#" + pluginContainer.id;
        }
    }

    var btnContainer = document.getElementById("btnContainer")
    if (btnContainer){
        var buttonHTML = '<a href="#' + plugin.name + 'Issues" class="dropdown-item">' +
            plugin.title +
            '</a>'
        btnContainer.innerHTML = btnContainer.innerHTML + buttonHTML
    }
}

function createIssueChart(data, element, name){
    try{
        var x_vals = []
        var issues = []
        var y_vals_instances = []
        var lines = []
        
        for (let date in data.history){
            x_vals.push(data.history[date].date)
            for (let status in data.history[date].issues){
                if (!issues.includes(status)){
                    issues.push(status)
                }
            }
            try {
                y_vals_instances.push(data.history[date].total)
            } catch (e) {
                // if the version didn't exist on that date, line should be at 0
                y_vals_instances.push(0)
            }
        }
        
        lines.push({
            x: x_vals,
            y: y_vals_instances,
            yaxis: 'y2',
            mode: 'lines',
            name: 'instances'
        })

        for (let status in issues) {
            var y_vals = []
            for (let date in data.history) {
                try {
                    y_vals.push(data.history[date].issues[issues[status]])
                } catch (e) {
                    // if the version didn't exist on that date, line should be at 0
                    y_vals.push(0)
                }
            }
            lines.push({
                x: x_vals,
                y: y_vals,
                mode: 'lines',
                name: issues[status]
            })
        }
        layout = {
            title: name,
            legend: {"orientation": "h"},
            yaxis: {title: 'Issues',
                linecolor: '#636363',
                linewidth: 4
            },
            yaxis2: {
                title: 'Total Instances',
                overlaying: 'y',
                side: 'right',
                linecolor: '#636363',
                linewidth: 4
            }
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
