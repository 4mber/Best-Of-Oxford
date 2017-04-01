// Google Maps info //

function AppViewModel() {
	var styles = [
		{
			featureType: 'water',
			stylers: [
				{color: '#19a0d8'}
			]
		},{
			featureType: 'administrative',
			elementType: 'labels.text.stroke',
			stylers: [
				{color: '#ffffff'},
				{weight: 5}
			]
		}, {
			featureType: 'administrative',
			elementType: 'labels.text.fill',
			stylers: [
				{color: '#7C0B0F'}
			]
		},{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [
				{color: '#D8E8EF'},
				{lightness: -40}
			]
		},{
			featureType: 'transit.station',
			stylers: [
				{weight: 9},
				{hue: '#7C0B0F'}
			]
		},{
			featureType: 'road.highway',
			elementType: 'labels.icon',
			stylers: [
				{visibility: 'off'}
			]
		},{
		    featureType: 'water',
				elementType: 'labels.text.stroke',
			stylers: [
					{ lightness: 100 }
			]
			},{
			featureType: 'water',
				elementType: 'labels.text.fill',
	        stylers: [
	        	{ lightness: -100 }
	        ]
	    },{
	        featureType: 'poi',
	        elementType: 'geometry',
	        stylers: [
	        	{ visibility: 'on' },
	        	{ color: '#f0e4d3' }
	        ]
	    },{
			featureType: 'road.highway',
			elementType: 'geometry.fill',
			stylers: [
				{color: '#D8E8EF'},
				{lightness: -25}
			]
		}
	];
	var locations = [
	{title: 'Bodleian Library', lat: 51.754073, lng: -1.254042, type: ['library', 'historic']},
	{title: 'The Duke of Cambridge', lat: 51.7586928, lng: -1.2615543, type: ['cocktails', 'pub']},
	{title: 'The Eagle & Child', lat: 51.7572267, lng: -1.2603115, type: ['pub', 'historic', 'dinner']},
	{title: 'The Gardeners\' Arms', lat: 51.762657, lng: -1.266569, type: ['pub', 'dinner', 'vegan']},
	{title: 'George Street Social', lat: 51.7535146, lng: -1.2610281, type: ['coffee', 'dinner', 'cocktails']},
	{title: 'The Handlebar Cafe & Kitchen', lat: 51.75326500000001, lng: -1.26042, type: ['coffee', 'dinner']},
	{title: 'itsu', lat: 51.7536903, lng: -1.2588341, type: ['sushi', 'fast', 'cheap']},
	{title: 'The King\'s Arms', lat: 51.7551005, lng: -1.2543675, type: ['pub', 'historic', 'dinner']},
	{title: 'LEON', lat: 51.7532467, lng: -1.2586068, type: ['fast', 'cheap', 'vegan']},
	{title: 'The Radcliffe Camera', lat: 51.75342939999999, lng: -1.2540423, type: ['library', 'historic']},
	{title: 'Raoul\'s', lat: 51.7579655, lng: -1.2636138, type: ['cocktails', 'pub']},
	{title: 'The Rickety Press', lat: 51.7598147, lng: -1.2683241, type: ['dinner', 'pizza']},
	{title: 'Turf Tavern', lat: 51.7546851, lng: -1.2529685, type: ['pub', 'dinner', 'historic']},
	{title: 'Turl Street Kitchen', lat: 51.7539487, lng: -1.256603, type: ['coffee', 'dinner']},
	{title: 'The Varsity Club', lat: 51.7523237, lng: -1.257008, type: ['cocktails', 'rooftop']},
	{title: 'Vaults & Garden', lat: 51.752882, lng: -1.25364, type: ['coffee', 'vegan', 'historic', 'dinner']},
	{title: 'The White Rabbit', lat: 51.7544318, lng: -1.2606805, type: ['dinner', 'pub', 'pizza', 'vegan']}
	];

	// var Location = function(data) {
	// 	var self = this;
	// 	this.title = data.title;
	// 	this.visible = ko.observable(true);

		// this.contentString = '<div class="infoWindowContent"><div class="title"><b>' + data.title + "</b></div>" + 
		// '<div class="type">' + data.type + '</div></div>';

		// this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

		// this.marker = new google.maps.Marker({
		// 	position: new google.maps.LatLng(data.lat, data.lng),
		// 	map: map,
		// 	title: data.title
		// });

		// this.showMarker = ko.computed(function() {
		// 	if(this.visible() === true) {
		// 		this.marker.setMap(map);
		// 	} else {
		// 		this.marker.setMap(null);
		// 	}
		// 	return true;
		// }, this);

		// this.marker.addListener('click', function(){
		// 	self.contentString = '<div class="infoWindowContent"><div class="title"><b>' + data.title + "</b></div>" + 
		// 	'<div class="type">' + data.type + '</div></div>';

	 //        self.infoWindow.setContent(self.contentString);

		// 	self.infoWindow.open(map, this);

		// 	self.marker.setAnimation(google.maps.Animation.BOUNCE);
	 //      	setTimeout(function() {
	 //      		self.marker.setAnimation(null);
	 //     	}, 2100);
		// });

		// this.bounce = function(place) {
		// 	google.maps.event.trigger(self.marker, 'click');
		// };
	// };	

	var self = this;
	this.searchTerm = ko.observable("");
	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 51.7577903, lng: -1.2604487},
		zoom: 15,
		styles: styles,
		mapTypeControl: false
	});

	locations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.title.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, self);

	// this.mapElem = document.getElementById('map');
	// this.mapElem.style.height = window.innerHeight - 50;

	// self.updateList = function(businessId) {
 //        self.yelp(businessId, null);
 //    };

	self.yelp = function(businessId, marker) {
        var auth = {
            consumerKey: "075NV9hdtE4WvuCTh09oKQ",
            consumerSecret: "zaP21iHZ2jwqtsOEb5Ya9AE5Xes",
            accessToken: "9Ojq-deiUWSZ_Csd6btJjAKVDWysS44n",
            accessTokenSecret: "YJMKQ2LLeQvh0iVZzY1WKFkOaxY",
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };
        var yelp_url = 'https://api.yelp.com/v2/business/' + businessId;

        var parameters = {
            oauth_consumer_key: auth.consumerKey,
            oauth_token: auth.accessToken,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb'
        };

        var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, auth.consumerSecret, auth.accessTokenSecret);
        parameters.oauth_signature = encodedSignature;
        var selectedMarker = null;

        self.markers().forEach(function(currentmarker) {
            if (currentmarker.yelp_id === businessId) {
                selectedMarker = currentmarker;
                currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png');
            } else {
                currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            }
        });

        var errorTimeout = setTimeout(function() {
            alert("Something went wrong - please try again!");
        }, 8000);

        $.ajax({
            url: yelp_url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function(results) {
                clearTimeout(errorTimeout);
                self.business(results);
                self.location(results.location.display_address);
                self.reviews([]);
                results.reviews.forEach(function(review) {
                    self.reviews.push({
                        review: review.excerpt + " - " + review.user.name
                    });
                });

                var contentString = '<div class="content">' +
                    '<h1 id="firstHeading" class="firstHeading">' + results.name + '</h1>' +
                    '<div id="bodyContent">' +
                    '<p>' + results.reviews[results.reviews.length - 1].excerpt + " - " + results.reviews[results.reviews.length - 1].user.name + '</p>' +
                    '</div>' +
                    '</div>';
                if (self.InfoMarker != null) {
                    self.InfoMarker.close();
                }
                self.InfoMarker = new google.maps.InfoWindow({
                    content: contentString
                });
                self.InfoMarker.open(mapview.map, selectedMarker);

            },
            fail: function() {
                alert("Uh oh, something went wrong! Please try again.");
            }
        });
        self.markers = new ko.observableArray();
        self.searchFilter = ko.observable('');
        self.business = ko.observable('');

        /** Funtion to create a locations  for markers array
         * @param title string the name of the location
         * @param latitude float the latitute to place the marker
         * @param longitude float the longitude of the marker
         * @param detail string TODO the information for the infoWindow
         * @return an object of the location added
         */
        self.createLocation = function(title, latitude, longitude, business_id) {
            var location = {
                position: new google.maps.LatLng(latitude, longitude),
                title: title,
                visible: true,
                map: self.map,
                yelp_id: business_id
            };

            // add marker to array of markers
            self.markers.push(new google.maps.Marker(location));
            self.markers()[self.markers().length - 1].setAnimation(null);
            self.markers()[self.markers().length - 1].setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
            // add click function to the new marker
            self.markers()[self.markers().length - 1].addListener('click', function() {
                var marker = this;
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 1400);

                }
                self.yelp(this.yelp_id, this);
            });

            // return the object
            return location;
        };

        self.coordinates = [
            new self.createLocation('Bodleian Library', 51.754073, -1.254042, 'guitar-center-manhattan-3'),
            new self.createLocation('The Duke of Cambridge', 51.7586928, -1.2615543, 'guitar-center-manhattan'),
            new self.createLocation('The Eagle & Child', 51.7572267, -1.2603115, 'jazz-standard-new-york'),
            new self.createLocation('The Gardeners\' Arms', 51.762657, -1.266569, 'the-iridium-new-york'),
            new self.createLocation('George Street Social', 51.7535146, -1.2610281, 'the-jazz-gallery-new-york-2'),
            new self.createLocation('The Handlebar Cafe & Kitchen', 51.75326500000001, -1.26042, 'guitar-new-york-new-york'),
            new self.createLocation('itsu', 51.7536903, -1.2588341, 'metropolitan-room-new-york'),
            new self.createLocation('The King\'s Arms', 51.7551005, -1.2543675, 'sam-ash-music-stores-new-york'),
            new self.createLocation('LEON', 51.7532467, -1.2586068, 'rudys-music-stop-new-york-2'),
            new self.createLocation('The Radcliffe Camera', 51.75342939999999, -1.2540423, 'birdland-new-york'),
            new self.createLocation('Raoul\'s', 51.7579655, -1.2636138, 'the-museum-of-modern-art-new-york-2'),
            new self.createLocation('The Rickety Press', 51.7598147, -1.2683241, 'dizzys-club-coca-cola-new-york'),
            new self.createLocation('Turf Tavern', 51.7546851, -1.2529685, 'dizzys-club-coca-cola-new-york'),
            new self.createLocation('Turl Street Kitchen', 51.7539487, -1.256603, 'dizzys-club-coca-cola-new-york'),
            new self.createLocation('The Varsity Club', 51.7523237, -1.257008, 'dizzys-club-coca-cola-new-york'),
            new self.createLocation('Vaults & Garden', 51.752882, -1.25364, 'dizzys-club-coca-cola-new-york'),
            new self.createLocation('The White Rabbit', 51.7544318, -1.2606805, 'dizzys-club-coca-cola-new-york')
        ];
    };
}

function startApp() {
	ko.applyBindings(new AppViewModel());
}
function errorHandling() {
	alert("Oh no! There was an error loading the page! Please refresh or try again later.");
}