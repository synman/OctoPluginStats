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

function getData() {
    ajaxGet(PATH_TO_STATS, function (response){
        var data = JSON.parse(response.responseText)
        console.log(data)
        createVersionsChart(data.stlviewer, "stlviewer", "STL Viewer")
        createVersionsChart(data.displayprogress, "displayprogress", "DisplayProgress")
        createVersionsChart(data.M117NavBar, "M117NavBar", "OctoPrint-M117NavBar")
        createVersionsChart(data.M117PopUp, "M117PopUp", "OctoPrint-M117PopUp")
        createVersionsChart(data.BLTouch, "BLTouch", "OctoPrint-BLTouch")
        createVersionsChart(data.youtubelive, "youtubelive", "YouTube Live")
        createVersionsChart(data.custombackground, "custombackground", "OctoPrint-CustomBackground")
        createVersionsChart(data.tplinksmartplug, "tplinksmartplug", "OctoPrint-TPLinkSmartplug")
        createVersionsChart(data.tasmota, "tasmota", "OctoPrint-Tasmota")
        createVersionsChart(data.floatingnavbar, "floatingnavbar", "OctoPrint-FloatingNavbar")
        createVersionsChart(data.mqttpublish, "mqttpublish", "OctoPrint-MQTTPublish")
        createVersionsChart(data.tasmota_mqtt, "tasmota_mqtt", "OctoPrint-TasmotaMQTT")
        createVersionsChart(data.M117SpeechSynthesis, "M117SpeechSynthesis", "OctoPrint-M117SpeechSynthesis")
        createVersionsChart(data.taborder, "taborder", "OctoPrint-TabOrder")
        createVersionsChart(data.bedlevelvisualizer, "bedlevelvisualizer", "Bed Level Visualizer")
        createVersionsChart(data.ipOnConnect, "ipOnConnect", "OctoPrint-ipOnConnect")
        createVersionsChart(data.sidebartempgraph, "sidebartempgraph", "OctoPrint-SideBarTempGraph")
        createVersionsChart(data.domoticz, "domoticz", "OctoPrint-Domoticz")
        createVersionsChart(data.bedlevelingwizard, "bedlevelingwizard", "OctoPrint-BedLevelingWizard")
        createVersionsChart(data.statefulsidebar, "statefulsidebar", "Stateful Sidebar")
        createVersionsChart(data.rtmpstreamer, "rtmpstreamer", "OctoPrint-RTMPStreamer")
        createVersionsChart(data.wemoswitch, "wemoswitch", "OctoPrint-WemoSwitch")
        createVersionsChart(data.active_filters_extended, "active_filters_extended", "Active Filters Extended")
        createVersionsChart(data.dragon_order, "dragon_order", "OctoPrint-DragonOrder")
        createVersionsChart(data.MyMiniFactory, "MyMiniFactory", "OctoPrint-MyMiniFactory")
        createVersionsChart(data.UltimakerFormatPackage, "UltimakerFormatPackage", "Cura Thumbnails")
        createVersionsChart(data.terminalcommandsextended, "terminalcommandsextended", "Terminal Commands Extended")
        createVersionsChart(data.Python3PluginCompatibilityCheck, "Python3PluginCompatibilityCheck", "Python 3 Check")
        createVersionsChart(data.AutoTerminalInput, "AutoTerminalInput", "Auto Terminal Input")
        createVersionsChart(data.prusaslicerthumbnails, "prusaslicerthumbnails", "PrusaSlicer Thumbnails")
        createVersionsChart(data.EasyServo, "EasyServo", "Easy Servo")
        createVersionsChart(data.multilineterminal, "multilineterminal", "Multi Line Terminal")
        createVersionsChart(data.mqttsubscribe, "mqttsubscribe", "MQTT Subscribe")
        createVersionsChart(data.M300Player, "M300Player", "M300 Player")
        createVersionsChart(data.stickypad, "stickypad", "Sticky Pad")
        createVersionsChart(data.webcam_iframe, "webcam_iframe", "Webcam Iframe")
        createVersionsChart(data.widescreen, "widescreen", "OctoPrint-WideScreen")
        createVersionsChart(data.consolidate_temp_control, "consolidate_temp_control", "Consolidate Temp Control")
        createVersionsChart(data.ArduCamFocus, "ArduCamFocus", "ArduCamFocus")
        createVersionsChart(data.consolidatedtabs, "consolidatedtabs", "Consolidated Tabs")
        createVersionsChart(data.backupscheduler, "backupscheduler", "Backup Scheduler")
    })
}

function createVersionsChart(data, element, name) {
    console.log(data)
    var values = []
    var labels = []
    for (let version in data.versions){
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
        annotations :[
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
}

function loadPage() {
    getData()
}

loadPage()
