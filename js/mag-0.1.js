/* 2009-05-23
 * 
 * MAG - Multimedia AJAX Gallery
 * Created by Matteo 'Peach' Pescarin
 * email  : peach[AT]smartart.it
 * website: http://smartart.it
 * 
 * This code is released under the GPL v3
 * 
 */
var MAG = {}
MAG.templates = {};

MAG.templates.loginForm = '<form method="post" action="" id="login_form"><fieldset><legend>Login</legend><div class="messagebox"></div><div>Username: <input name="username" type="text" id="username" value="" maxlength="20" /></div><div>Password: <input name="password" type="password" id="password" value="" maxlength="20" /></div><div><input name="Submit" type="submit" id="submit" value="Login" /><a href="#" id="cancel">Cancel</a></div></fieldset></form>';

MAG.title = '';
MAG.thumbsdir = 'thumbs/';
MAG.themesdir = 'themes/';
MAG.usedtheme = '';
MAG.settingsdir = 'settings/';
MAG.configfile = 'config.xml';
MAG.image = new Class({
	Implements: Options,
	options: {
		src: '',
		thumbSrc: '',
		title: '',
		datetime: '',
		info: '',
		comments: []
	},
	initialize: function(options) {
		this.setOptions(options);
		if (this.options.title == '') {
			this.options.title = this.options.src;
		}
		this.options.thumbSrc = MAG.thumbsdir+this.options.src.split('.')[0]+'-thumb.jpg';
	}
});
MAG.gallery = new Class({ // defining the mootools class
	Implements: Options,
	options: {
		id: 0,
		config: '',
		position: 0,
		title: '',
		view: 'default',
		directory: '',
		images: [],
		imgIndex: 0
	},
	initialize: function(options) {
		this.setOptions(options)
	},
	addImage: function(image) {
		this.options.images.push(new MAG.image(image));
	},
	renderGallery: function() {
		switch (this.options.view) {
			default:
				this.showThumbs();
				break;
		}
	},
	showThumbs: function() {
		var arrLen = this.options.images.length;
		$('#thumbnails').empty();
		for (var i=0; i<arrLen; i++) {
			var image = this.options.images[i];
			var dir = this.options.directory;
			$('<div></div>')
				.attr('class', 'image'+i)
				.css({
					'background': 'url("themes/default/images/loader.gif") no-repeat center center',
				//	'width': '100px',
				//	'height': '100px',
					'float': 'left'})
				.appendTo('#thumbnails');
			var img = new Image();
			$(img)
				.hide()
				.appendTo('#thumbnails .image'+i)
				.load(function() {
					$('#thumbnails .image'+i).css({'background': 'transparent'});
					$(this).fadeIn();
				}).error(function() { 
					alert("can't load image: "+image.options.title);
				}).attr({'src': dir+image.options.thumbSrc, 'class': i})
				.click(function() {
					MAG.galleries.gallery[MAG.galleries.active].showPreview(Number($(this).attr('class')));
				});
		}
	},
	showPreview: function(imgId) {
		this.options.imgIndex = imgId;
		var image = this.options.images[imgId];
		var dir = this.options.directory;
		// TODO check out image transitions
		$('#preview')
			.empty()
			.click(function() {
				$(this).fadeOut().empty();
			})
			.fadeIn();
		$('<div></div>')
			.attr('class','preview')
			.css({'margin': '10 auto'})
			.hide()
			.appendTo('#preview');
		var newImage = new Image();
		$(newImage)
			.appendTo('#preview .preview')
			.load(function() {
				var height = document.window.innerHeight-20;
				var width = this.width * height/this.height;
				$(this).css({
					'width': width, 
					'height': height
					})
				$('#preview div').fadeIn();
			}).error(function() { 
				alert("can't load image: "+image.options.title);
			}).attr('src', dir+image.options.src)
			.click(function(){ 
				MAG.galleries.gallery[MAG.galleries.active].nextImage(imgId+1); 
			});
	},
	nextImage: function(imgId) {
		
		this.options.imgIndex++;
	}
});
MAG.galleries = {
	active: -1, // active gallery
	gallery: [],
	addGallery: function(params) {
		this.gallery.push(new MAG.gallery(params));
	},
	getGallery: function(id) {
		/*this.gallery.each(function(item) { // mootools each.
			if (item.options.id === id) {
				return item; // returns only from the callback not the outer function
			}
		});*/
		for (var i = 0 ; i < this.gallery.length ; i++) { // avoids futile code exec
			if (this.gallery[i].options.id === id) {
				return this.gallery[i];
			}
		}
	}
};
//TODO occorre scrivere una funzione che sia ereditata da tutti gli oggetti per realizzare la pretty print.
// MooTools deve dirmi come fare ad avere una funzione polimorfica per ralizzare questo concetto
/*function sortGalleries(a, b) {
	// hic sunt leones
	// order function
	return a.id - b.id
};*/
MAG.utils = {
	/* rendering page for the entire page */
	renderPage: function() {
		// TODO start building the page structure
		$('body').append('<div id="galleries"></div>');
		$('body').append('<div id="panel"></div>');
		$('body').append('<div id="preview"></div>');
		$('body').append('<div id="thumbnails"></div>');
		$('#preview').css({
			'display': 'none',
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'top': '0',
			'background-color': '#000',
			'text-align': 'center'
		});
		$('#galleries').append('<ul></ul>');
		$.each(MAG.galleries.gallery, function() { // TODO move to internal method for pretty printing
			var id = this.options.id;
			var title = this.options.title;
			var view = this.options.view;
			$('<li></li>')
				.html('<a id="gallery'+id+'" href="#">'+title+'</a>')
				.appendTo('#galleries ul')
				.end()
				.click(function () {
					MAG.utils.loadGallery(id, view)
				});
		});
		$('#panel').append('<ul></ul>');
		$('<li></li>')
			.html('<a href="#">Login</a>')
			.appendTo('#panel ul')
			.end()
			.click(function() {
				MAG.utils.showLogin($(this));
			});
	},
	loadGallery: function(id, view) {
		// check if the id hasn't already been loaded
		if (MAG.galleries.active === id) {
			return;
		}
		// TODO use id to get the image listing of the gallery
		var gallery = MAG.galleries.getGallery(id);
		$.ajax({
			type: 'GET',
			url: location.href.substr(0, location.href.search(location.pathname)+1)+gallery.options.directory+gallery.options.config,
			dataType: 'xml',
			success: function(xml) { // load images into galleries
				$(xml).find('gallery image').each(function() {
					gallery.addImage({
						src: $(this).attr('src'),
						title: $(this).find('title').text(),
						datetime: $(this).find('datetime').text(),
						info: $(this).find('info').text()
						//, comments: [] // TODO
					});
				});
				gallery.renderGallery();
			}
		});
		MAG.galleries.active = id; // set the current gallery as active
		$('#gallery'+id).attr('class','active')
	},
	showLogin: function(li) {
		$('#overlay').empty().append(MAG.templates.loginForm).fadeIn(100);//.click(function() {$(this).fadeOut(100).empty();});
		// FIXME temporary solution for closing login form
		$('#login_form #cancel').click(function() { $('#overlay').fadeOut(100).empty()});
		$('#password').blur(function() {
			$('#login_form').trigger('submit');
		});
		$('#login_form').submit(function() { 
			if($('input').val() != '') {
				$.post('includes/login.php', 
					{
						username: $('#username').val(),
						password: $('#password').val(),
						rand: Math.random()
					},
					function(result) {
						if (result == 'ok') { // valid login
							// TODO change Login link to Logout
							// set a cookie (?)
							$('#overlay').fadeOut(100).empty();
						} else { // invalid login
							$('#overlay .messagebox').fadeOut(100).empty().append('Invalid Login').fadeIn(100);
						}
					}
				);
			} else {
				$('#overlay .messagebox').fadeOut(100).empty().append('Fill in the form or press ESC').fadeIn(100);
			}
			return false; // do not post the form physically causing reload of page.
		});
	}
};


$(document).ready(function () {
	// obscure the main window while loading
	// TODO display a progressbar
	$("#overlay").show()
	$("#overlay img").css({
		'margin-top': ($(document).height()/2)-30
	})
	// load configuration data from server
	// FIXME data should be requested to a server-side script?
	$.ajax({
		type: 'GET',
		url: location.href.substr(0, location.href.search(location.pathname)+1)+MAG.settingsdir+MAG.configfile,
		dataType: 'xml',
		success: function(xml) {
			$(xml).find('settings themes').each(function() {
				MAG.usedtheme = $(this).attr('used')
				$('head').append('<link type="text/css" rel="stylesheet" media="all" href="'+MAG.themesdir+MAG.usedtheme+'/style.css"/>');
			});
			$(xml).find('settings title').each(function() {
				document.title = MAG.title = $(this).text();
				//$('head title').replaceWith('<title>'+MAG.title+'</title>');
			});
			$(xml).find('galleries gallery').each(function () {
				MAG.galleries.addGallery({
					id: Number($(this).attr('id')),
					config: $(this).attr('src'),
					position: Number($(this).attr('pos')),
					title: $(this).find("title").text(),
					view: $(this).find('view').text(),
					directory: $(this).find('directory').attr('src')
				});
			});
			MAG.utils.renderPage();
			// show the underlying page
			$('#overlay').fadeOut(1000);
			
		}
	});
});
