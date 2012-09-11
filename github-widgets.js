/**
 * GitHub Activity Widgets
 * @author Benjamin J. Balter ( http://ben.balter.com )
 */
 
var gitHubWidgets = {
	
	base: 'https://api.github.com/',
	el: document.getElementById("github-widget"),
	org: null,
	repo: null,
	type: null,
	limit: null,
		
	// Build Query URL
	buildUrl: function() {
		
		//allow folks to manually override via gitHubWidgets.org = "foo", etc.
		this.org = this.org || this.el.getAttribute("data-org"); //gh organization (or user)
		this.repo = this.repo || this.el.getAttribute("data-repo"); //repo name, used only for commits
		this.type = this.type || this.el.getAttribute("data-type"); // commits, repos, events
		this.limit = this.limit || this.el.getAttribute("data-limit") || 5 // commits, repos, events
		
		if ( this.type == "repos" || this.type == "events" && !this.repo )
			url = this.base + "orgs/" + this.org + "/" + this.type;
		else 
			url = this.base + "repos/" + this.org + "/" + this.repo + "/" + this.type;		
		
		url = url + "?callback=gitHubWidgets.callback";

		return url;
		
	},
	
	// Append JSONP call to body
	addScript: function() {
	
		body = document.getElementsByTagName("body")[0];         
		jsonp = document.createElement("script");
		jsonp.src = this.buildUrl();
		body.appendChild( jsonp );

	},
	
	//Callback handler
	callback: function( response ) {
		
		//error handling
		if ( response.meta.status > 200 )
			return false;
			
		response.data = response.data.slice( 0, this.limit )


		for ( i=0; i< response.data.length; i++ ) {
		
			if ( this.type == "commits" )
				this.renderCommit( response.data[i] );
			else if ( this.type == "repos" )
				this.renderRepo( response.data[i] );
			else if ( this.type == "events" ) 
				this.renderEvent( response.data[i] );
		
		}
		
	},
	
	authorUrl: function( url ) {
		return url.replace( 'https://api.github.com/users/', 'https://github.com/' );
	},
	
	repoUrl: function( url ) {
		return url.replace( 'https://api.github.com/repos/', 'https://github.com/' );
	},
	
	renderCommit: function( commit ) {
		commit_url = "http://github.com/" + this.org + "/" + this.repo + "/commits/" + commit.sha;
		committer_url = this.authorUrl( commit.committer.url );

		li = document.createElement( "li" );
		li.innerHTML = '<a href="' + commit_url + '">' + commit.commit.message + "</a>";
		li.innerHTML +=  ' by <a href="' + committer_url + '">' + commit.commit.author.name + '</a>';
		li.innerHTML += " - " + relativeDate( new Date( commit.commit.author.date ) );
		
		this.el.appendChild( li );
		
	},
	
	renderRepo: function( repo ) {
		
		li = document.createElement( "li" );
		li.innerHTML = '<a href="' + repo.html_url + '">' + repo.name + "</a>";
		li.innerHTML += '<span class="meta"> - ';
		li.innerHTML += '<span class="stars">stars: ' + repo.watchers + "</span>";
		li.innerHTML += ', <span class="forks">forks: ' + repo.forks + "</span>";
		li.innerHTML += "</span>";
		
		this.el.appendChild( li );

	},
	
	renderEvent: function( event ) {

		//event types: http://developer.github.com/v3/events/types/
		li = document.createElement( "li" );
		switch ( event.type ) {
			case "WatchEvent":
				li.innerHTML = '<a href="' + this.authorUrl( event.actor.url ) + '">' + event.actor.login + "</a>";
				li.innerHTML += ' ' + event.payload.action + ' watching ';
				li.innerHTML += '<a href="' + this.repoUrl( event.repo.url ) + '">' + event.repo.name + "</a>";
			break;
			case "IssueCommentEvent":
				li.innerHTML = '<a href="' + this.authorUrl( event.actor.url ) + '">' + event.actor.login + "</a>";
				li.innerHTML += ' ' + event.payload.action + ' issue ';
				li.innerHTML += '<a href="' + event.payload.issue.html_url + '">' + event.payload.issue.title + "</a>";
			break;
			case "ForkEvent":
				li.innerHTML = '<a href="' + this.authorUrl( event.actor.url ) + '">' + event.actor.login + "</a>";
				li.innerHTML += ' forked repo ';
				li.innerHTML += '<a href="' + this.repoUrl( event.repo.url ) + '">' + event.repo.name + "</a>";
			break;
			default:
				//we don't know this event; don't render an li
				li = null;
		} 
		
		if ( li )
			this.el.appendChild( li );
		
	}
}

gitHubWidgets.addScript();

/*
 Source: https://github.com/azer/relative-date/blob/master/lib/relative-date.js
*/
var relativeDate = (function(undefined){

  var SECOND = 1000,
      MINUTE = 60 * SECOND,
      HOUR = 60 * MINUTE,
      DAY = 24 * HOUR,
      WEEK = 7 * DAY,
      YEAR = DAY * 365,
      MONTH = YEAR / 12;

  var formats = [
    [ 0.7 * MINUTE, 'just now' ],
    [ 1.5 * MINUTE, 'a minute ago' ],
    [ 60 * MINUTE, 'minutes ago', MINUTE ],
    [ 1.5 * HOUR, 'an hour ago' ],
    [ DAY, 'hours ago', HOUR ],
    [ 2 * DAY, 'yesterday' ],
    [ 7 * DAY, 'days ago', DAY ],
    [ 1.5 * WEEK, 'a week ago'],
    [ MONTH, 'weeks ago', WEEK ],
    [ 1.5 * MONTH, 'a month ago' ],
    [ YEAR, 'months ago', MONTH ],
    [ 1.5 * YEAR, 'a year ago' ],
    [ Number.MAX_VALUE, 'years ago', YEAR ]
  ];

  function relativeDate(input,reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );
    
    var delta = reference - input,
        format, i, len;

    for(i = -1, len=formats.length; ++i < len; ){
      format = formats[i];
      if(delta < format[0]){
        return format[2] == undefined ? format[1] : Math.round(delta/format[2]) + ' ' + format[1];
      }
    };
  }

  return relativeDate;

})();