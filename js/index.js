//variables
var sideMenuVisible = false;
var globalIdMac = "";
var type = 1;
var interval;

//initialize page
function init() 
{
    $('.input-group.date, #fechaRegistro').datepicker({
            format: "dd/mm/yyyy",//formato de fecha
            todayHighlight: true,//Ilumina el hoy
            endDate: '-1d',//Desabilita los dias futuros, solo acepta de hoy hacia atras
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });
	getDevices();
}

function getDevices()
{
	var x = new XMLHttpRequest();
    //prepare request
    x.open('GET', '/dashboard2/apis/devices.php');
    x.send(); // send request
    x.onreadystatechange = function()
    {
        //readyState = 4 : back with data
        //status == 200 : succesfull response from API
        if (x.readyState == 4 && x.status == 200) 
        {
            var jsonData = JSON.parse(x.responseText);
            if (jsonData.status == 0) 
            {
                showDevices(jsonData.devices);
            }
        }
    }
}

function showDevices(devices)
{
	var divStations = document.getElementById('sidemenu');
    for (var i = 0 ; i < devices.length; i++) 
    {
        var divInfo = document.createElement('div');
        divInfo.className = 'stationinfo';
        divInfo.setAttribute('onclick', 'settingInteval("' + devices[i].idMac + '")');
        divStations.appendChild(divInfo);

        var divIcon = document.createElement('div');
        divIcon.className = "stationicon";

        var imgIcon = document.createElement("img");
        imgIcon.src = "images/conta.png";
        divIcon.appendChild(imgIcon);

        divInfo.appendChild(divIcon);

        var divName = document.createElement("div");
        divName.className = "stationname";
        divName.innerHTML = devices[i].description;

        divInfo.appendChild(divName);

        var divIp = document.createElement("div");
        divIp.setAttribute("class", "stationip");
        divIp.innerHTML = devices[i].ipAddress;

        divInfo.appendChild(divIp);
        divStations.appendChild(divInfo);
    }	
}

function changeType(value)
{
    type = value;
    if (value == 1) 
    {
        document.getElementById('chart').style.display = "block";
        document.getElementById('chart2').style.display = "none";
    }
    else
    {
        document.getElementById('chart').style.display = "none";
        document.getElementById('chart2').style.display = "block";
    }
    settingInteval(globalIdMac);
}

function getValues(idMac)
{
    var x = new XMLHttpRequest();
    //prepare request
    x.open('GET', '/dashboard2/apis/devices.php?idMac=' + idMac +'&type=' + type);
    x.send(); // send request
    x.onreadystatechange = function()
    {
        //readyState = 4 : back with data
        //status == 200 : succesfull response from API
        if (x.readyState == 4 && x.status == 200) 
        {
            var jsonData = JSON.parse(x.responseText);
            if (jsonData.status == 0) 
            {
                prepareChart(jsonData);
            }
        }
    }
}

function settingInteval(mac)
{
    console.log(interval);
    globalIdMac = mac;
    console.log(globalIdMac);
    if (typeof interval === 'undefined') 
    {
        console.log("true");
        interval = setInterval('getValues("'+mac+'");', 1000);
    }
    else
    {
        console.log("false");
        clearInterval(interval);
        interval = setInterval('getValues("'+mac+'");', 1000);
    }
    
}

//prepare chart
function prepareChart(data) 
{
    console.log('Preparing chart...');
    //data arrays
    if (type == 1) 
    {
        var xAxisContainerCategories = [];
        var seriesContainerData = [];
        var totalLatas = 0;
        var max = 0;
        //read data
        data.device.readingsContainer.forEach(function(item) {
            xAxisContainerCategories.push(item.bethours);
            seriesContainerData.push(parseInt(item.total));
            totalLatas = totalLatas + parseInt(item.total);
            if (max <  item.total) { max = parseInt(item.total); }
        });
        drawContainerChart('Contenedor de ' + data.device.description, "Latas totales colectadas " + totalLatas, xAxisContainerCategories, "Total de latas colectadas entre horas", seriesContainerData, max);
    }
    else
    {
        var xAxisContainerCategories = [];
        var seriesContainerData = [];
        var totalDispensar = 0;
        var max = 0;
        //read data
        data.device.readingsDuck.forEach(function(item) {
            xAxisContainerCategories.push(item.bethours);
            seriesContainerData.push(parseInt(item.total));
            totalDispensar = totalDispensar + parseInt(item.total);
            if (max <  item.total) { max = parseInt(item.total); }
        });
        drawDuckChart('Contenedor de ' + data.device.description, "Latas totales colectadas " + totalDispensar, xAxisContainerCategories, "Total de latas colectadas entre horas", seriesContainerData, max);
    }
}

//draw column chart
function drawDuckChart(chartTitle, chartSubtitle, xAxisCategories, seriesName, seriesData, max) 
{
    //highchart test
    temperatureChart = Highcharts.chart('chart2', {
        chart: {
            type: 'column'
        },
        title: {
            text : chartTitle,
            style: {
                'font-size' :'18pt', 
                color: '#555'
            }
        },
        subtitle: {
            text: chartSubtitle,
            style: {
                'font-size' :'14pt', 
                color: '#777'
            }
        },
        xAxis: {
            categories: xAxisCategories
        },
        yAxis: {
            min: 0,
            max: (max + 30),
            title: 'Degrees Fahrenheit'
        },
        plotOptions : {
            series: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#000000'
                    }
                }
            }
        },
        series: [
            {
                name: seriesName,
                animation: false,
                color: '#ffdb58',
                data: seriesData
            }
        ]
    });
}

//draw column chart
function drawContainerChart(chartTitle, chartSubtitle, xAxisCategories, seriesName, seriesData, max) 
{
    //highchart test
    temperatureChart = Highcharts.chart('chart', {
        chart: {
            type: 'column'
        },
        title: {
            text : chartTitle,
            style: {
                'font-size' :'18pt', 
                color: '#555'
            }
        },
        subtitle: {
            text: chartSubtitle,
            style: {
                'font-size' :'14pt', 
                color: '#777'
            }
        },
        xAxis: {
            categories: xAxisCategories
        },
        yAxis: {
            min: 0,
            max: (max + 10),
            title: 'Degrees Fahrenheit'
        },
        plotOptions : {
            series: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#0D47A1'
                    }
                }
            }
        },
        series: [
            {
                name: seriesName,
                animation: false,
                color: '#0D47A1',
                data: seriesData
            }
        ]
    });
}

//show menu
function showMenu() {
    if (!sideMenuVisible) {
        sideMenuVisible = true;
        document.getElementById("sidemenu").style.width = "20%";
        document.getElementById("content").style.width = "80%";
        document.getElementById("content").style.marginLeft = "20%";
        var nav = document.getElementById('nav').clientHeight;
        document.getElementById("sidemenu").style.marginTop = (nav - 40)+"px";
        document.getElementById("chart").style.width = "100%";

    }
    else {
        sideMenuVisible = false;
        document.getElementById("sidemenu").style.width = "0";
        document.getElementById("content").style.marginLeft= "0";
        document.getElementById("content").style.width = "100%";
        document.getElementById("chart").style.width = "100%";
        document.getElementById("nav").style.marginLeft = "0px";
    }

}


function build()
{
	console.log(urlHtml + 'buildings.html');
	document.getElementById('charger').src = urlHtml + 'buildings.html';
}

function newBuild()
{
	document.getElementById('charger').src = urlHtml + 'post.html';
}