var geo = {
    xhr: Ti.Network.createHTTPClient({
        timeout: 2e4
    }),
    responseStatuses: {
        OK: "OK",
        INVALID_REQUEST: "INVALID_REQUEST",
        MAX_ELEMENTS_EXCEEDED: "MAX_ELEMENTS_EXCEEDED",
        OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
        REQUEST_DENIED: "REQUEST_DENIED",
        UNKNOWN_ERROR: "UNKNOWN_ERROR"
    },
    elementStatuses: {
        OK: "OK",
        NOT_FOUND: "NOT_FOUND",
        ZERO_RESULTS: "ZERO_RESULTS"
    },
    errors: {
        NONE: {
            error: 0,
            message: ""
        },
        XHR_ERROR: {
            error: -1,
            message: "xhr_error"
        },
        JSON_ERROR: {
            error: -2,
            message: "json_error"
        },
        LOCATION_SERVICES_DISABLED: {
            error: -3,
            message: "err_geo_device_turned_off"
        },
        AUTHORIZATION_DENIED: {
            error: -4,
            message: "err_geo_running_services_disallowed"
        },
        AUTHORIZATION_RESTRICTED: {
            error: -5,
            message: "err_geo_system_services_disallowed"
        },
        ERROR_LOCATION_UNKNOWN: {
            error: -6,
            message: "err_geo_location_unknown"
        },
        ERROR_DENIED: {
            error: -7,
            message: "err_geo_access_denied"
        },
        ERROR_NETWORK: {
            error: -8,
            message: "err_geo_network_error"
        },
        ERROR_HEADING_FAILURE: {
            error: -9,
            message: "err_geo_failure_detect_heading"
        },
        ERROR_REGION_MONITORING_DENIED: {
            error: -10,
            message: "err_geo_region_monitoring_access_denied"
        },
        ERROR_REGION_MONITORING_FAILURE: {
            error: -11,
            message: "err_geo_region_monitoring_access_failure"
        },
        ERROR_REGION_MONITORING_DELAYED: {
            error: -12,
            message: "err_geo_region_monitoring_setup_delayed"
        },
        ERROR_UNKNOWN: {
            error: -13,
            message: "err_geo_region_monitoring_setup_delayed"
        }
    },
    location: {
        longitude: null,
        latitude: null,
        altitude: null,
        heading: null,
        accuracy: null,
        speed: null,
        timestamp: null,
        altitudeAccuracy: null,
        status: null
    },
    checkLocation: function(callback) {
        Ti.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
        Ti.Geolocation.purpose = L("geolocation_purpose");
        if (false === Titanium.Geolocation.locationServicesEnabled) {
            this.location.status = this.errors.LOCATION_SERVICES_DISABLED;
            callback();
            return;
        }
        var authorization = Titanium.Geolocation.locationServicesAuthorization;
        if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
            this.location.status = this.errors.AUTHORIZATION_DENIED;
            callback();
            return;
        }
        if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
            this.location.status = this.errors.AUTHORIZATION_RESTRICTED;
            callback();
            return;
        }
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 50;
        var self = this;
        self.callback = callback;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (!e.success || e.error) {
                switch (e.code) {
                  case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
                    self.location.status = self.errors.ERROR_LOCATION_UNKNOWN;
                    break;

                  case Ti.Geolocation.ERROR_DENIED:
                    self.location.status = self.errors.ERROR_DENIED;
                    break;

                  case Ti.Geolocation.ERROR_NETWORK:
                    self.location.status = self.errors.ERROR_NETWORK;
                    break;

                  case Ti.Geolocation.ERROR_HEADING_FAILURE:
                    self.location.status = self.errors.ERROR_HEADING_FAILURE;
                    break;

                  case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
                    self.location.status = self.errors.ERROR_REGION_MONITORING_DENIED;
                    break;

                  case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
                    self.location.status = self.errors.ERROR_REGION_MONITORING_FAILURE;
                    break;

                  case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
                    self.location.status = self.errors.ERROR_REGION_MONITORING_DELAYED;
                    break;

                  default:
                    self.location.status = self.errors.ERROR_UNKNOWN;
                }
                self.callback();
                return;
            }
            self.location.longitude = e.coords.longitude;
            self.location.latitude = e.coords.latitude;
            self.location.altitude = e.coords.altitude;
            self.location.heading = e.coords.heading;
            self.location.accuracy = e.coords.accuracy;
            self.location.speed = e.coords.speed;
            self.location.timestamp = e.coords.timestamp;
            self.location.altitudeAccuracy = e.coords.altitudeAccuracy;
            self.location.status = self.errors.NONE;
            self.callback();
        });
    },
    geocoding: function(address, callback) {
        address = address.replace(" ", "+");
        address = Ti.Network.encodeURIComponent(address);
        var url = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=" + address + "&language=" + Titanium.Locale.getCurrentLanguage();
        Ti.API.info(url);
        var self = this;
        self.callback = callback;
        self.url = url;
        this.xhr.onload = function() {
            this.responseText;
            var responseJSON;
            try {
                responseJSON = JSON.parse(this.responseText);
            } catch (e) {
                self.callback({
                    error: self.errors.JSON_ERROR
                });
            }
            responseJSON.status != self.responseStatuses.OK ? callback({
                error: responseJSON.status
            }) : self.callback({
                error: false,
                response: responseJSON
            });
        };
        this.xhr.onerror = function() {
            self.callback(self.errors.XHR_ERROR);
        };
        try {
            this.xhr.open("GET", url, true);
            this.xhr.send();
        } catch (err) {
            self.callback({
                error: self.errors.XHR_ERROR
            });
        }
    },
    reverseGeocoding: function(lat, lng, callback, useBing) {
        var url = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=" + lat + "," + lng + "&language=" + Titanium.Locale.getCurrentLanguage();
        useBing && (url = "http://dev.virtualearth.net/REST/v1/Locations/" + lat + "," + lng + "?o=json&c=" + Titanium.Locale.getCurrentLanguage() + "&key=AsVfU_xKdVN8M9muQCO-VMcGSuFSoX4PO-30i38RHIAk5Tr-IDWZ5GHtzZJVD7l5");
        var self = this;
        self.callback = callback;
        self.url = url;
        this.xhr.onload = function() {
            this.responseText;
            var responseJSON;
            try {
                responseJSON = JSON.parse(this.responseText);
            } catch (e) {
                self.callback({
                    error: self.errors.JSON_ERROR
                });
            }
            responseJSON && responseJSON.status && responseJSON.status != self.responseStatuses.OK ? responseJSON.status === self.elementStatuses.ZERO_RESULTS || responseJSON.status === self.responseStatuses.OVER_QUERY_LIMIT ? geo.reverseGeocoding(lat, lng, callback, true) : callback({
                error: responseJSON.status
            }) : self.callback({
                error: false,
                response: responseJSON
            });
        };
        this.xhr.onerror = function() {
            self.callback(self.errors.XHR_ERROR);
        };
        try {
            this.xhr.open("GET", url, true);
            this.xhr.send();
        } catch (err) {
            self.callback({
                error: self.errors.XHR_ERROR
            });
        }
    }
};