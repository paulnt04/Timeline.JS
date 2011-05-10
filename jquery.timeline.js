// Cove Visual Javascript Library
// Visuals for Timeline Manipulation using jQuery and Canvas Support

// Timeline Framework

// Color helper from FLOT (github.com/flot/flot), originally inspired by jQuery color animation plugin by John Resig
(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);


(function($) {
	$.fn.timeline = function(type, data_, options_) {
		// data_ should be formatted as {"video":{"duration":"hh:mm:ss"},"data":{"series_1_name": [{"start_time": "hh:mm:ss", "duration": "hh:mm:ss"}]}}
		var ctx;
		var target = this;
		var c_width = '500px';
		var c_height = '100px';
		var c_scale = '1'; // 1 second per pixel
		var fill_list = {};
		var color_list = [];
		var label_options = {};
		var point_options = {};
		var line_options = {};
		var autoscale = false;
		try {
			var options = JSON.parse(options_);
		} catch(er) {
			options = options_
		}
		try {
			var data = JSON.parse(data_);
		} catch(er) {
			data = data_
		}
		
		//console.warn("Type:" + type + ",Data:" + data_ + ",Options:" + options_) // DEBUGGING INPUT
		
		if (this[0].tagName == "CANVAS") {
			ctx = this[0].getContext("2d");
			// Parses input options (see function below)
			parseOptions(options,true);
			// fillGenerator(Object.keys(data["data"]).length); // Uncomment to activate colored lines
			// Height and width of target if set. Else, 500px X 100px is default. Can also be set in options.
			if (this.css('width')) {
				c_width = parseInt(this.css('width'));
			}
			if (this.css('height')) {
				c_height = parseInt(this.css('height'));
			}
			
			this.attr('width',c_width).attr('height',c_height);
			
			if (Object.keys(data["data"]).length > 0 && Object.keys(data["video"]).length > 0) {
				// Vertical Scaling
				autoscale = true // BUG (autoscale set to false in parseOptions)
				if (autoscale == true) {
					c_height = Object.keys(data["data"]).length*15+20;
					this.css('height',c_height.toString() + "px");
					this.attr('height',c_height)
				}
				
				var scale_ratio = scaler(data["video"]);
				if (type == "line") {
					vector(100,0,100,c_height,{});
					line_display(data,options,scale_ratio);
				} else if (type == "frequency") {
					frequency_display(data,options,scale_ratio);
				} else {
					console.error('CoVisual Plot Type not recognized. See Documentation for Details')
				}
			} else {
				console.error('No Data. See Documentation for JSON formatting')
			}
						
		} else if (this[0].tagName == "DIV") {
				options["css"] = {};
				if (!options["css"]["width"]) {
					options["css"]["width"] = this.css('width'); + "\"";
				}
				if (!options["css"]["height"]) {
					options["css"]["height"] = this.css('height'); + "\"";
				}
				
				// preserve border
				if (!options["css"]["border"]) {
					options["css"]["border"] = this[0].style.border;
				}
				
				this.replaceWith("<canvas id=\"covisual_" + (document.getElementsByTagName('canvas').length + 1).toString() + "\"><!-- --></canvas>");
				json_options_ = JSON.stringify(options);
				json_data_ = JSON.stringify(data);
				id = '#covisual_' + (document.getElementsByTagName('canvas').length).toString()
				$(id).timeline(type,json_data_,json_options_);
		} else {
				console.error("CoVisual TimeLines require HTML5 Canvas Support. Target must be a div or canvas.");
		};
		
		function line_display(line_data_,line_options_,scale_data_) {
			var i=1;
			$.each(data["data"], function (series_name,series_data) {
				// ctx.fillStyle = colorlist[i-1]; // Uncomment for colors
				label(series_name,i,label_options)
				$.each(series_data, function (item) {
					interval = series_data[item]
					time = interval["start_time"].split(":")
					if (time.length == 3) {
						start_time = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseInt(time[2])
					} else if (time.length == 2) {
						start_time = parseInt(time[0])*60 + parseInt(time[1])
					} else 	if (time.length == 1) {
						seconds = time[0]
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					time = interval["duration"].split(":")
					if (time.length == 3) {
						duration = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseInt(time[2])
					} else if (time.length == 2) {
						duration = parseInt(time[0])*60 + parseInt(time[1])
					} else if (time.length == 1) {
							seconds = time[0]
					} else {
						console.error("Covisuals.js: Invalid Time Format for Video Duration.");
						throw "1";
					}
					start = Math.ceil(start_time/scale_data_) + 100;
					length = Math.ceil(duration/scale_data_);
					line(start,length,i,line_options_)
				});
				i++;
			});
		};
		
		function frequency_display(freq_data, freq_options,scale_data_) {
			
		};
		
		// Scaler
		function scaler(video_data_) {
			data_width = parseInt(c_width) - 100;
			time = video_data_["duration"].split(":")
			if (time.length == 3) {
				seconds = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseInt(time[2])
			} else if (time.length == 2) {
				seconds = parseInt(time[0])*60 + parseInt(time[1])
			} else if (time.length == 1) {
				seconds = time[0]
			} else {
				console.error("Covisuals.js: Invalid Time Format for Video Duration.");
				throw "1";
			}
			spp = seconds/data_width; // seconds per pixel
			return spp;
		};
		
		// Line Subfunction. line_options_ is a JSON object
		function line(start_x,length,series_number,line_options_) {
			ctx.lineWidth = 3;
			parseOptions(line_options_,false);
			ctx.beginPath();
			y = series_number*15 + 4; 
			ctx.moveTo(start_x, y);
			ctx.lineTo(start_x + length, y);
			ctx.stroke();
			ctx.closePath();
		};
		
		function vector(start_x,start_y,end_x,end_y,line_options_) {
			ctx.lineWidth = 1;
			parseOptions(line_options_,false);
			ctx.beginPath();
			ctx.moveTo(start_x, start_y);
			ctx.lineTo(end_x, end_y);
			ctx.stroke();
			ctx.closePath();
		};
		
		function point(x,y,series_number,point_options_) {
			var radius = 2;
			parseOptions(point_options_,false);
			ctx.beginPath();
			ctx.arc(x,y,radius,0,Math.PI*2,true); // arc(x,y,radius,startAngle,endAngle,clockwise)
			ctx.closePath();
			ctx.fill();
		};
		
		function label(labeltext, series_number, label_options_) {
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.font = "12pt Arial";
			maxWidth = 100;
			parseOptions(label_options_,false);
			
			y = series_number*15 - 6; 
			ctx.fillText(labeltext,4, y,maxWidth);
		};
		
		// Option Parsing function. Escapes most javascript functions
		function parseOptions(opts,global_flag) {
			$.each(opts, function(i,val) {
				var escaped_var = i.replace(/[^A-Za-z0-9\.]/g,'');
				try {var escaped_val = val.replace(/[^A-Za-z0-9\.]/g,'');} catch(er) {escaped_val = val}
				try {$.parseJSON(val); isJSON = true;} catch(er) { isJSON = false }
				if (eval('ctx.' + escaped_var)) {
					eval('var ctx.' + escaped_var + ' = \'' + val + '\'')
				} else if (isJSON) {
					if (i == "label") {
						label_options = $.parseJSON(val) || val;
					} else if (i == "point") {
						point_options = $.parseJSON(val) || val;
					} else if (i == "line") {
						line_options = $.parseJSON(val) || val;
					} else if (i == "css" && global_flag == true) {
						css = $.parseJSON(val) || val;
						$.each(css, function(j,cval) {
							if (target.css(j) || target.css(j) == "") {
								target.css(j,cval);
							};
						});
					} else if (typeof(eval(escaped_var)) != "undefined") {
						try {
							eval('var ' + escaped_var + ' = ' + escaped_val);
						} catch(er) {
							eval('var ' + escaped_var + ' = \'' + escaped_val + '\'');
						}
					};
				} else if (target.css(i) && global_flag == true) {
					target.css(i,val)
				} else if (typeof(window[escaped_var] != "undefined")) {
					eval('var ' + escaped_var + ' = \'' + val + '\'');
				};
			});
		};
		
		// Fill Generator from FLOT (see https://github.com/flot/flot)
		// Needs manipulation for adding new colors to existing colors and for more than 3 colors
		function fillGenerator(number) {
			var colors = [], variation = 0;
			i = 0;
			needColors = number - color_list.length
			while (colors.length < neededColors) {
			    var c;
			    if (color_list.length == i) // check degenerate case
			        c = $.color.make(100, 100, 100);
			    else
			        c = $.color.parse(color_list[i]);
            
			    // vary color if needed
			    var sign = variation % 2 == 1 ? -1 : 1;
			    c.scale('rgb', 1 + sign * Math.ceil(variation / 2) * 0.2)
            
			    // FIXME: if we're getting to close to something else,
			    // we should probably skip this one
			    colors.push(c);
            
			    ++i;
			    if (i >= color_list.length) {
			        i = 0;
			        ++variation;
			    }
			}
			$.each(colors, function(obj) {
				color_list.push(colors[obj].toString())
			});
		};
		
	};
})(jQuery);