var date = new Date()
var PATH_TO_STATS = "data/stats.json?t=" + date.getTime()
var names = {
    stlviewer: "STL Viewer",
    displayprogress: "DisplayProgress",
    m117navbar: "OctoPrint-M117NavBar",
    m117popup: "OctoPrint-M117PopUp",
    bltouch: "OctoPrint-BLTouch",
    youtubelive: "YouTube Live",
    custombackground: "OctoPrint-CustomBackground",
    tplinksmartplug: "OctoPrint-TPLinkSmartplug",
    tasmota: "OctoPrint-Tasmota",
    floatingnavbar: "OctoPrint-FloatingNavbar",
    mqttpublish: "OctoPrint-MQTTPublish",
    tasmota_mqtt: "OctoPrint-TasmotaMQTT",
    m117speechsynthesis: "OctoPrint-M117SpeechSynthesis",
    taborder: "OctoPrint-TabOrder",
    bedlevelvisualizer: "Bed Level Visualizer",
    iponconnect: "OctoPrint-ipOnConnect",
    sidebartempgraph: "OctoPrint-SideBarTempGraph",
    domoticz: "OctoPrint-Domoticz",
    bedlevelingwizard: "OctoPrint-BedLevelingWizard",
    statefulsidebar: "Stateful Sidebar",
    rtmpstreamer: "OctoPrint-RTMPStreamer",
    wemoswitch: "OctoPrint-WemoSwitch",
    active_filters_extended: "Active Filters Extended",
    dragon_order: "OctoPrint-DragonOrder",
    myminifactory: "OctoPrint-MyMiniFactory",
    ultimakerformatpackage: "Cura Thumbnails",
    terminalcommandsextended: "Terminal Commands Extended",
    python3plugincompatibilitycheck: "Python 3 Check",
    autoterminalinput: "Auto Terminal Input",
    prusaslicerthumbnails: "PrusaSlicer Thumbnails",
    easyservo: "Easy Servo",
    multilineterminal: "Multi Line Terminal",
    mqttsubscribe: "MQTT Subscribe",
    m300player: "M300 Player",
    stickypad: "Sticky Pad",
    webcam_iframe: "Webcam Iframe",
    widescreen: "OctoPrint-WideScreen",
    consolidate_temp_control: "Consolidate Temp Control",
    arducamfocus: "ArduCamFocus",
    consolidatedtabs: "Consolidated Tabs",
    backupscheduler: "Backup Scheduler"
}

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

function getData() {
    ajaxGet(PATH_TO_STATS, function (response){
        var data = JSON.parse(response.responseText)
        console.log(data)
        for(plugin in data){
            var container = document.getElementById('statsOverview').children[0];
            if (container) {
                var graph = document.createElement("div");
                graph.id = plugin;
                var wrapper = document.createElement("div");
                wrapper.className = "col-md-3";
                wrapper.appendChild(graph);
                container.appendChild(wrapper);
            }
            createVersionsChart(data[plugin], plugin, names[plugin]);
        }
    })
}

function createVersionsChart(data, element, name) {
    var values = []
    var labels = []
    try {
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
        console.log(name, error);
    }
}

function loadPage() {
    getData()
}

loadPage()
