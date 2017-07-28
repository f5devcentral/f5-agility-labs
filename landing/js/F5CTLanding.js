// F5 Community Training Landing Page Generator
// Created by: Hitesh Patel

var F5CTLanding = {
	data: {},
	_data_loaded: 0,
	_bs_col_iter: 0,
	loadClasses: function() {
		var _this = this;
		var href = window.location.href;
		var baseUrl = href.substring(0, href.lastIndexOf('/')) + "/";
		$.getJSON(baseUrl + 'js/class_data.json', function(data) {
			_this.data = data;
			_this._data_loaded = 1;
			console.log(_this.data);

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
	updatePage: function() {
		var _this = this;

		for(var i = 0; i < _this.data.groups.length; i++) {
			var g = _this.data.groups[i];

			for(var j = 0; j < g.classes.length; j++) {
				var c = g.classes[j]
				
				if(_this._bs_col_iter == 0) {
					$(".f5-classes").append(' <div class="row">');
				}

				var htmlLink = g.id + '/html/index.html';
				var classHtmlLink = g.id + '/html/' + c.id + '/' + c.id + '.html';
				var pdfLink = g.id + '/pdf/' + g.sphinxname + '-' + c.id + '.pdf';
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

				_this._bs_col_iter++;
				if(_this._bs_col_iter > 2) {
					$(".f5-classes").append('</div>');
					_this._bs_col_iter = 0;
				}

			
			}
			$(".f5-classes").append('</div>');
		}
	}
}