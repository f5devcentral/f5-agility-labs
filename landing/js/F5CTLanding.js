// F5 Community Training Landing Page Generator
// Created by: Hitesh Patel

var F5CTLanding = {
	data: {},
	stats: { "totalPages":0, "totalWords":0 },
	classCounter: 0,
	_data_loaded: 0,
	_stats_loaded: 0,
	_loaded: {},
	_bs_col_iter: 0,
	main: function() {
		this.loadClasses();
		this.loadStats();
	},
	_getSiteURL: function() {
		var href = window.location.href;
		return href.substring(0, href.lastIndexOf('/')) + "/";
	},
	loadStats: function() {
		var _this = this;
		var baseUrl = _this._getSiteURL();
		$.getJSON(baseUrl + 'js/stats.json', function(data) {
			_this.stats = data;
			_this._stats_loaded = 1;
    	});

		// Async wait for data to load before continuing
		var loadDone = function() {
			// All data loaded, continue
			if(_this._stats_loaded == 1) {
				_this.updateStats();
			} else {
				// All not loaded, wait a bit
				window.setTimeout(loadDone, 20);
			}
		}
		window.setTimeout(loadDone, 20);
	},
	loadClasses: function() {
		var _this = this;
		var href = window.location.href;
		var baseUrl = href.substring(0, href.lastIndexOf('/')) + "/";
		$.getJSON(baseUrl + 'js/class_data.json', function(data) {
			_this.data = data;
			_this._data_loaded = 1;
    	});

		// Async wait for data to load before continuing
		var loadDone = function() {
			// All data loaded, continue
			if(_this._data_loaded == 1) {
				_this.updatePage();
			} else {
				// All not loaded, wait a bit
				window.setTimeout(loadDone, 20);
			}
		}
		window.setTimeout(loadDone, 20);
	},
	updateStats: function() {
		$(".f5-stats").empty();
		$(".f5-stats").append('<p class="f5-stats">Currently serving up ' +
			this.classCounter.toLocaleString() + ' classes with ' +
			this.stats.totalPages.toLocaleString() + ' pages (' +
			this.stats.totalWords.toLocaleString() + ' words) of awesome!</p>')
	},
	updatePage: function() {
		var _this = this;
		var classCount = 0;
		for(var i = 0; i < _this.data.groups.length; i++) {
			var g = _this.data.groups[i];

			for(var j = 0; j < g.classes.length; j++) {
				var c = g.classes[j]

				if(_this._bs_col_iter == 0) {
					$(".f5-classes").append(' <div class="row">');
				}

				if(typeof(c.htmllink) === 'undefined') {
					var htmlLink = g.id + '/html/index.html';
					var classHtmlLink = g.id + '/html/' + c.id + '/' + c.id + '.html';
				} else {
					var htmlLink = g.id + c.htmllink
					var classHtmlLink = htmlLink;
				}

				if(typeof(c.pdflink) === 'undefined') {
					var pdfLink = g.id + '/pdf/' + g.sphinxname + '-' + c.id + '.pdf';
				} else {
					var pdfLink = g.id + c.pdflink;
				}

				$( ".f5-classes" ).append(
					'  <div class="col-md-4 f5-class-item">' +
        			'   <h2><a href="' + classHtmlLink + '">' + c.name + '</a></h2>' +
					'   <p><a class="f5-group" href="' + htmlLink + '">' + g.name + '</a></p>'+
					'   <p>' + g.description + '</p>' +
        			'   <p>' +
          			'    <a class="btn btn-primary" href="' + classHtmlLink + '">HTML</a>' +
          			'    <a class="btn btn-primary" href="' + pdfLink + '">PDF</a>' +
        			'   </p>' +
      				'  </div>');

				_this.classCounter++;
				_this._bs_col_iter++;
				if(_this._bs_col_iter > 2) {
					$(".f5-classes").append('</div>');
					_this._bs_col_iter = 0;
				}


			}
			$(".f5-classes").append('</div>');
			_this.updateStats();
		}

	}
}