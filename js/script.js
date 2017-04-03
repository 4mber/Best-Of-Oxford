'use strict';

function init() {
    var MapViewModel = function() {
        // To make our GoogleMap unique...
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
        var self = this
        self.infoMarker = null;
        self.reviews = ko.observableArray();
        self.location = ko.observableArray();

        // Display Google Map of Oxford...
        self.map = new google.maps.Map(document.getElementById('map'), {
	        center: {lat: 51.7577903, lng: -1.2604487},
	        zoom: 15,
	        styles: styles,
	        mapTypeControl: false
    	});
        self.updateList = function(businessId) {
            self.yelp(businessId, null);
        };

        // Our base Yelp API integration...
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
                oauth_nonce: nonceGenerate(),
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
                    currentmarker.setIcon('https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png');
                } else {
                    currentmarker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                }
            });

            var errorTimeout = setTimeout(function() {
                alert("Error! Please refresh or try again later.");
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
                            var theReview;
			    self.reviews ? theReview = self.reviews.push({
                            review: review.excerpt + " - " + review.user.name
                            }) : theReview = "No reviews available.";
                    });

                    // Creates content for inside of info windows...
                    var contentString = '<div class="content">' +
                        '<h1 id="first-heading" class="first-heading"> <a target="_blank" href="' + results.url + '">' + results.name + '</a></h1>' +
                        '<div id="bodyContent">' +
                        '<img src="' + results.rating_img_url + '">' +
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
                error: function(err) {
                    alert("Error! Please refresh or try again later.");
                }
            });
        };

        self.markers = new ko.observableArray();
        self.searchFilter = ko.observable('');
        self.business = ko.observable('');

        self.createLocation = function(title, latitude, longitude, business_id) {
            var location = {
                position: new google.maps.LatLng(latitude, longitude),
                title: title,
                visible: true,
                map: self.map,
                yelp_id: business_id
            };

            // Add a new marker to the markers array...
            self.markers.push(new google.maps.Marker(location));
            self.markers()[self.markers().length - 1].setAnimation(null);
            self.markers()[self.markers().length - 1].setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            // And add the click function & animation to the new marker...
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

            return location;
        };

        // Add in all of our locations...
        self.coordinates = [
            new self.createLocation('The Duke of Cambridge', 51.7586928, -1.2615543, 'duke-of-cambridge-oxford'),
            new self.createLocation('The Eagle & Child', 51.7572267, -1.2603115, 'the-eagle-and-child-oxford'),
            new self.createLocation('The Gardeners\' Arms', 51.762657, -1.266569, 'gardeners-arms-oxford'),
            new self.createLocation('George Street Social', 51.7535146, -1.2610281, 'george-street-social-oxford'),
            new self.createLocation('The Handlebar Cafe', 51.75326500000001, -1.26042, 'the-handlebar-oxford'),
            new self.createLocation('The King\'s Arms', 51.7551005, -1.2543675, 'the-kings-arms-oxford'),
            new self.createLocation('Raoul\'s', 51.7579655, -1.2636138, 'raouls-cocktail-bar-oxford'),
            new self.createLocation('The Rickety Press', 51.7598147, -1.2683241, 'the-rickety-press-oxford'),
            new self.createLocation('Turf Tavern', 51.7546851, -1.2529685, 'the-turf-tavern-oxford'),
            new self.createLocation('Turl Street Kitchen', 51.7539487, -1.256603, 'turl-street-kitchen-oxford'),
            new self.createLocation('The Varsity Club', 51.7523237, -1.257008, 'the-varsity-club-oxford'),
            new self.createLocation('Vaults & Garden', 51.752882, -1.25364, 'the-vaults-and-garden-oxford-2'),
            new self.createLocation('The White Rabbit', 51.7544318, -1.2606805, 'the-white-rabbit-oxford')
        ];

        // Updates locations list and marker visibilities based on input from the search field...
        self.searchFilter.subscribe(function(searchValue) {
            searchValue = searchValue.toLowerCase();
            var change = false;
            ko.utils.arrayForEach(self.markers(), function(marker) {
                var text = marker.title.toLowerCase();
                if (text.search(searchValue) === -1) {
                    if (marker.getVisible() === true) {
                        change = true;
                    }
                    marker.setVisible(false);
                } else {
                    if (marker.getVisible() === false) {
                        change = true;
                    }
                    marker.setVisible(true);
                }
            });
            if (change === true) {
                var data = self.markers().slice(0);
                self.markers([]);
                self.markers(data);
            }
        });
    };
    // Activates knockout...
    var mapview = new MapViewModel();
    ko.applyBindings(mapview);
}

function nonceGenerate(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function errorHandler() {
	alert("There was an error loading Google Maps. Please refresh or try again later!");
}
