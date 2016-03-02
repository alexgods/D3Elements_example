goog.require('goog.dom');
goog.require('goog.ui.MenuButton');
goog.require('goog.async.Delay');
goog.require('goog.async.Throttle');
goog.require('goog.Timer');
goog.require('goog.ui.LabelInput');
   
    function loadDonutCharts() {
    	
    	var salesData=[
    	           	{label:"Basic", color:"#3366CC"},
    	           	{label:"Plus", color:"#DC3912"},
    	           	{label:"Lite", color:"#FF9900"},
    	           	{label:"Elite", color:"#109618"},
    	           	{label:"Delux", color:"#990099"}
    	           ];

    	           var svg = d3.select("body").append("svg").attr("width",700).attr("height",300);

    	           svg.append("g").attr("id","salesDonut");
    	           svg.append("g").attr("id","quotesDonut");

    	           Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);
    	           Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);
    	           
    	       	   var timeout = setTimeout(function() {
    	       			changeData();
    	       			}, 5000);
    	           	
    	           function changeData(){
    	           	Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
    	           	Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
     	       	    var timeout = setTimeout(function() {
     	       	    	changeData();
   	       				}, 5000);
    	           }

    	           function randomData(){
    	           	return salesData.map(function(d){ 
    	           		return {label:d.label, value:1000*Math.random(), color:d.color};});
    	           }
    	
    }
    
    
    function loadBulletCharts() {
    	var margin = {top: 5, right: 40, bottom: 20, left: 120},
        width = 960 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    var chart = d3.bullet()
        .width(width)
        .height(height);

    var JSONData =[
                   {"title":"Revenue","subtitle":"US$, in thousands","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
                   {"title":"Profit","subtitle":"%","ranges":[20,25,30],"measures":[21,23],"markers":[26]},
                   {"title":"Order Size","subtitle":"US$, average","ranges":[350,500,600],"measures":[100,320],"markers":[550]},
                   {"title":"New Customers","subtitle":"count","ranges":[1400,2000,2500],"measures":[1000,1650],"markers":[2100]},
                   {"title":"Satisfaction","subtitle":"out of 5","ranges":[3.5,4.25,5],"measures":[3.2,4.7],"markers":[4.4]}
                   ];
    
    var data = JSONData.slice();

      var svg = d3.select("body").selectAll("svg")
          .data(data)
        .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);

      var title = svg.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ")");

      title.append("text")
          .attr("class", "title")
          .text(function(d) { return d.title; });

      title.append("text")
          .attr("class", "subtitle")
          .attr("dy", "1em")
          .text(function(d) { return d.subtitle; });

      var timeout = setTimeout(function() {update();}, 5000);

    function update() {
    	svg.datum(randomize).call(chart.duration(1000));
    	var timeout = setTimeout(function() {update();}, 5000);
    }
    
    
    function randomize(d) {
      if (!d.randomizer) d.randomizer = randomizer(d);
      d.ranges = d.ranges.map(d.randomizer);
      d.markers = d.markers.map(d.randomizer);
      d.measures = d.measures.map(d.randomizer);	
      return d;
    }

    function randomizer(d) {
      var k = d3.max(d.ranges) * .2;
      return function(d) {
        return Math.max(0, d + k * (Math.random() - .5));
      };
    }
    
    }  
    
    
    function loadSimpleGraph() { 
    	var width = 960,
        height = 500-37;

    var margin = {top: 20, right:20, bottom:20, left:50};

    // draw and append the container
    var svg = d3.select("body").append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
          .attr("transform","translate(" + margin.left + "," + margin.right + ")");

    var xScale = d3.scale.linear()
          .range([0,width - margin.left - margin.right]);

    var yScale = d3.scale.linear()
          .range([height - margin.top - margin.bottom,0]);

    var line = d3.svg.line().interpolate("monotone")
      .x(function(d){ return xScale(d.x); })
      .y(function(d){ return yScale(d.y); });

    // create random data
    function newData(lineNumber, points){
      return d3.range(lineNumber).map(function(){
        return d3.range(points).map(function(item,idx){
          return {x:idx/(points-1),y:Math.random()*100};
        });
      });
    }

    function render(){
      // generate new data
      var data = newData(+7,+3);

      // obtain absolute min and max
      var yMin = data.reduce(function(pv,cv){
        var currentMin = cv.reduce(function(pv,cv){
          return Math.min(pv,cv.y);
        },100);
        return Math.min(pv,currentMin);
      },100);
      var yMax = data.reduce(function(pv,cv){
        var currentMax = cv.reduce(function(pv,cv){
          return Math.max(pv,cv.y);
        },0);
        return Math.max(pv,currentMax);
      },0);

      // set domain for axis
      yScale.domain([yMin,yMax]);

      // create axis scale
      var yAxis = d3.svg.axis()
          .scale(yScale).orient("left");

      // if no axis exists, create one, otherwise update it
      if (svg.selectAll(".y.axis")[0].length < 1 ){
        svg.append("g")
            .attr("class","y axis")
            .call(yAxis);
      } else {
        svg.selectAll(".y.axis").transition().duration(1500).call(yAxis);
      }

      // generate line paths
      var lines = svg.selectAll(".line").data(data).attr("class","line");

      // transition from previous paths to new paths
      lines.transition().duration(1500)
        .attr("d",line)
        .style("stroke", function(){
          return '#'+Math.floor(Math.random()*16777215).toString(16);
        });
        
      // enter any new data
      lines.enter()
        .append("path")
        .attr("class","line")
        .attr("d",line)
        .style("stroke", function(){
          return '#'+Math.floor(Math.random()*16777215).toString(16);
        });

      // exit
      lines.exit()
        .remove();
    }

    // initial page render
    render();

    // continuous page render
    setInterval(render, 5000);
    
    }
    
    function loadRadarCharts() {

		var margin = {top: 100, right: 100, bottom: 100, left: 100},
			width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
			height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

		var data = [
				  [//iPhone
					{axis:"Battery Life",value:0.22},
					{axis:"Brand",value:0.28},
					{axis:"Contract Cost",value:0.29},
					{axis:"Design And Quality",value:0.17},
					{axis:"Have Internet Connectivity",value:0.22},
					{axis:"Large Screen",value:0.02},
					{axis:"Price Of Device",value:0.21},
					{axis:"To Be A Smartphone",value:0.50}			
				  ],[//Samsung
					{axis:"Battery Life",value:0.27},
					{axis:"Brand",value:0.16},
					{axis:"Contract Cost",value:0.35},
					{axis:"Design And Quality",value:0.13},
					{axis:"Have Internet Connectivity",value:0.20},
					{axis:"Large Screen",value:0.13},
					{axis:"Price Of Device",value:0.35},
					{axis:"To Be A Smartphone",value:0.38}
				  ],[//Nokia Smartphone
					{axis:"Battery Life",value:0.26},
					{axis:"Brand",value:0.10},
					{axis:"Contract Cost",value:0.30},
					{axis:"Design And Quality",value:0.14},
					{axis:"Have Internet Connectivity",value:0.22},
					{axis:"Large Screen",value:0.04},
					{axis:"Price Of Device",value:0.41},
					{axis:"To Be A Smartphone",value:0.30}
				  ]
				];

		var color = d3.scale.ordinal()
			.range(["#EDC951","#CC333F","#00A0B0"]);
			
		var radarChartOptions = {
		  w: width,
		  h: height,
		  margin: margin,
		  maxValue: 0.5,
		  levels: 5,
		  roundStrokes: true,
		  color: color
		};
		//Call function to draw the Radar chart
		RadarChart(".radarChart", data, radarChartOptions);	
		var timeout = setTimeout(function() {newRadar();}, 5000);
    }
    
  //This function generates a new array with 3 objects every time. The values for each axis are randomized
  //In order to re-generate the radar chart, you jsut need to run RadarChart.draw("#chart2", data) as usual.    
  function newRadar(){
    data = [];
    for(var i=0; i<3; i++){
      data.push([
{axis:"Battery Life",value: Math.random()},
{axis:"Brand",value: Math.random()},
{axis:"Contract Cost",value: Math.random()},
{axis:"Design And Quality",value: Math.random()},
{axis:"Have Internet Connectivity",value: Math.random()},
{axis:"Large Screen",value: Math.random()},
{axis:"Price Of Device",value: Math.random()},
{axis:"To Be A Smartphone",value: Math.random()}			

]);

    }

	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	
	var color = d3.scale.ordinal()
		.range(["#EDC951","#CC333F","#00A0B0"]);
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 0.5,
	  levels: 5,
	  roundStrokes: true,
	  color: color
	};
	
	RadarChart(".radarChart", data, radarChartOptions);
	var timeout = setTimeout(function() {newRadar();}, 5000);
  }
    
  function createTags(){
	  this.headerElement = goog.dom.createDom('div', {'class':'radarChart','style': 'padding-left: 50px;padding-top: 15px; width: 50%;margin: 0 auto;font: 14px;'}, this.title);
	  var radioGrouped = goog.dom.createDom('input', {type:'radio', name:'mode', value:'grouped'});
	  var labelGrouped = goog.dom.createDom('label', null,'Grouped');
	  var radioChecked = goog.dom.createDom('input', {type:'radio', name:'mode', value:'stacked'});
	  var labelChecked = goog.dom.createDom('label', null,'Checked');
	  
	  goog.dom.appendChild(document.body, headerElement);
	  goog.dom.appendChild(document.body, radioGrouped);
	  goog.dom.appendChild(document.body, labelGrouped);
	  goog.dom.appendChild(document.body, radioChecked);
	  goog.dom.appendChild(document.body, labelChecked);
  }
  
    function loadCharts() { 
    	loadBulletCharts();
    	createTags();
    	loadRadarCharts();
    	loadStackedGroupedBars();
    	loadDonutCharts();
    	loadSimpleGraph();
    	    	
    }
