// GitHub Topic search for F5 Networks Repositories
// Created by: Hitesh Patel

var F5GitHubSearch = {
	// Base URL for GitHub API
	ghurl: "https://api.github.com",

	// Our GitHub Orgs
	ghorgs: ['F5Networks', 'f5devcentral'],

	// Topics to exclude
	topic_exclude: ['f5','f5networks'],

	// Internal caching, etc.
	repos: [],
	topics: {},
	_bs_col_iter: 0,
	_orgs_loaded: 0,
	_filter_orgs: [],
	_filter_topics: [],
	_filter_string: "",

	// Add a repository to the cache
	addRepo: function(obj) {
		// Fixup description so we don't show 'null'
		if(typeof(obj.description) !== 'string') { obj.description = ""; }

		// Add a display flag for use with search filters
		if(typeof(obj.display) === 'undefined') { obj.display = false; }
		this.repos.push(obj);
	},

	// Is the specified topic in the topic_exclude array
	topicExcluded: function(t) {
		if(this.topic_exclude.indexOf(t) >= 0) {
			return true;
		}
		return false;
	},

	// Opposite of above
	topicNotExcluded: function(t) { return !this.topicExcluded(t); },

	// Add the HTML for a repository to the page
	addRepoToPage: function(obj) {
		var _this = this;
		if(this._bs_col_iter == 0) {
			$(".repos").append('<div class="row">');
		}

		var topicHTML = "<h6>";
		obj.topics.forEach(function(t) {
			if(_this.topicNotExcluded(t)) {
				topicHTML += '  <span class="label label-default">' + t + '</span>';
			}
		});
		topicHTML += "</h6>";

		$( ".repos" ).append(
			'<div class="col-md-4"><div class="panel tile-medium">' +
			'  <div class="panel-header">' +
			'    <h2><a href="' + obj.html_url + '">' + obj.name + '</a></h2>' +
			'  </div>' +
			'  <div class="panel-body">' +
            '    <h5><span class="label label-primary">' + obj.owner.login + '</span></h5>' +
            topicHTML +
            '  </div>' +
			'  <div class="panel-footer">' +
			'    <p>' + obj.description + '</p>' +
			'  </div>' +
			' </div>' +
			'</div>');
		this._bs_col_iter++;
		if(this._bs_col_iter > 2) {
			$(".repos").append('</div>');
			this._bs_col_iter = 0;
		}

	},

	// Empty the repos div
	clearResults: function() {
		$(".repos").empty();
		this._bs_col_iter = 0;
	},

	// Add org labels to the page
	addOrgsToPage: function() {
		var _this = this;
		this.ghorgs.forEach(function(o) {
			//$(".orgs").append('<span class="label label-default">' + o + '</span>');
			$(".orgs").append(
				'<label class="btn btn-primary active">' +
				'<input type="checkbox" autocomplete="off" checked id="org_' + o + '"> ' + o + ' </label>');
			$('#org_' + o).change(function() {
				_this.applyFilters();
			})
		});
	},

	// Apply our filters to each element in repos[]
	// The end result is a toggle of the display attribute
	applyFilters: function() {
		var _this = this;
		_this._filter_orgs = [];
		_this._filter_topics = [];

		// Setup _filter_string with the entered search string
		_this._filter_string = $("#searchstring").val().toLowerCase();

		// Setup _filter_orgs[] with the orgs that were selected
		_this.ghorgs.forEach(function(o) {
			var checked = $("#org_" + o).prop('checked');
			if(checked == true) {
				_this._filter_orgs.push(o);
			}
		});

		// Setup _filter_topics[] with the topics that were selected
		_this.getTopics().forEach(function(t) {
			var checked = $("#topic_" + t).prop('checked');
			if(checked == true) {
				_this._filter_topics.push(t);
			}
		});

		//console.log("_filter_string=" + this._filter_string)
		//console.log("_filter_orgs=" + this._filter_orgs)
		//console.log("_filter_topics=" + this._filter_topics)

		// Check if repo topic is in the topic filter
		var inTopicFilter = function(t) {
			if(_this._filter_topics.indexOf(t) >= 0) {
				return true;
			}
			return false;
		}

		// Check if a repo org is in the org filter
		var inOrgFilter = function(o) {
			if(_this._filter_orgs.indexOf(o) >= 0) {
				return true;
			}
			return false;
		}

		// Check if repo name or description includes the search string
		// A black search string is ignored and results in a match
		var inStringFilter = function(a) {
			if(_this._filter_string.length == 0 ||
			   a.toLowerCase().includes(_this._filter_string)) {
				return true;
			}
			return false;
		}

		// Check if the topic list is empty and the user
		// has indicated they want to see repos with empty no topics
		var inEmptyTopicFilter = function(t) {
			if(t.length == 0 && $('#topic_empty').prop('checked')) {
				return true;
			}
			return false;
		}

		// Perform our search
		_this.repos.forEach(function(r) {
			r.display = false;

			// Filter selected orgs and by search string
			if(inOrgFilter(r.owner.login) &&
			  (inStringFilter(r.name) || inStringFilter(r.description))) {

				// Filter by selected topics
				//if((r.topics.length == 0 && _this._filter_topics.length == _this.getTopics().length) || r.topics.find(inTopicFilter)) {
				if(inEmptyTopicFilter(r.topics) || r.topics.find(inTopicFilter)) {
					r.display = true;
				}
			}
		});

		// repos[].display reflects what be shown now
		_this.displayResults();
	},

	// Display search results on page based on repos[].display value
	displayResults: function() {
		var _this = this;
		var resultCounter = 0;

		_this.clearResults();
		_this.repos.forEach(function(r) {
			if(r.display) {
				_this.addRepoToPage(r);
				resultCounter++;
			}
		});

		$(".results-counter").empty().append('<h2>Results <span class="badge">' + resultCounter + " / " + _this.repos.length + "</span></h2>");

	},

	// Add topic label to the topics div
	addTopicToPage: function(t) {
		var _this = this;
		$(".topics").append(
			'<label class="btn btn-primary active">' +
			'<input type="checkbox" autocomplete="off" checked id="topic_' + t + '"> ' + t + ' </label>');

		$('#topic_' + t).change(function() {
			_this.applyFilters();
		})
	},

	// Get all repos
	getRepos: function() { return this.repos },

	// Load repo information from GitHub API
	loadRepos: function() {
		var _this = this;

		// Callback executed when API query returns data
		var searchCallback = function(result) {
		  	result.items.forEach(function(i) {
		  		_this.addRepo(i);

				i.topics.forEach(function(t) {
					// Filter out excluded topics
					if(_this.topicExcluded(t) || t == "f5noindex") {
						return;
					}

					// New topic, add it to the index and filter
					if(typeof(_this.topics[t]) === 'undefined') {
						_this.topics[t] = [];
						_this._filter_topics.push(t);
					}

					_this.topics[t].push(i.full_name);
				});
		  	})

		  	// Keep track of our load progress
		  	_this._orgs_loaded++;
		}

		// Send search query to GitHub API
		this.ghorgs.forEach(function(o) {
			$.ajax({
			  url: "https://api.github.com/search/repositories",
			  headers: {
			  	Accept: "application/vnd.github.mercy-preview+json"
			  },
			  data: {
			  	q: "user:" + o,
			  	per_page: 100
			  },
			  success: searchCallback
			});
		});

		// Async wait for all repos to load before continuing
		var loadDone = function() {
			// All org repos loaded, continue
			if(_this._orgs_loaded == _this.ghorgs.length) {
				_this.sortRepos();
				_this.addOrgsToPage();
				_this.getTopics().forEach(function(t) {
					_this.addTopicToPage(t);
				});
				_this.addRegisterEventHandlers();
				_this.applyFilters();
			} else {
				// All not loaded, wait a bit
				window.setTimeout(loadDone, 400);
			}
		}
		window.setTimeout(loadDone, 400);
	},

	// Sort the repos[] list using the repo name
	// 'f5-' at the beginning of the name is ignored
	sortRepos: function() {
		var _this = this;

		function compare(a, b) {
			var a_name = a.name;
			var b_name = b.name;
			a_name.replace('f5-','');
			b_name.replace('f5-','');
			if(a_name < b_name) { return -1; }
			if(a_name > b_name) { return 1; }
			return 0;
		}

		_this.repos = _this.repos.sort(compare);
	},

	// Registers various handlers on the page
	addRegisterEventHandlers: function() {
		var _this = this;

		$('#searchstring').on('input', function() {
			_this.applyFilters();
		})

		$('#topic_all').click(function() {
			_this.getTopics().forEach(function(t) {
				$("#topic_" + t).prop('checked', true);
				_this.applyFilters();
			});
		});

		$('#topic_none').click(function() {
			_this.getTopics().forEach(function(t) {
				$("#topic_" + t).prop('checked', false);
				_this.applyFilters();
			});
		});

		$('#topic_empty').change(function() {
			_this.applyFilters();
		});
	},

	// Get a sorted list of topics
	getTopics: function() {
		return Object.keys(this.topics).sort();
	}
}
