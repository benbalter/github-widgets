GitHub Activity Widgets
=======================

Javascript widgets for showing GitHub organization activity (commits, events, repos) in webpages

Types of Widgets
----------------

* **Events** - Recent events (e.g., forking, pull requests, comments)
* **Repos** - List of all organization repos
* **Commits** - Recent commit activity

Usage
-----

Include the following code in the body of your website where you would like the widget to go:

```html
<ul id="github-widget"
    data-type  = "events" 
    data-org   = "whitehouse" 
    data-limit = "10" 
></ul>
```

and include the following code right before your page's `</body>` tag:

```html
<script src="https://raw.github.com/benbalter/github-widgets/master/github-widgets.min.js"></script>
```

Customization
-------------

You can customize the widget with the following options:

* `data-type` - the type of widget, either `events`, `commits`, or `repos`
* `data-org` - the GitHub organization
* `data-limit` - the maximum number of results to return
* `data-repo` - (for events and commits only) the repository