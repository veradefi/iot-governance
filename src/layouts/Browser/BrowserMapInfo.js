import React, { Component } from 'react'
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
var $ = require ('jquery');


export default class BrowserMapInfo extends Component {
  constructor(props) {
    super(props)
    this.state={
        loading:false,
        lat:props.lat,
        lng:props.lng,
    }
    var self=this;

    
  }


getMap = () => {
    $('#showMap').html('');
   var google=window.google;
   var map_json=this.props.map_json;
   var lng=this.props.lng;
   var lat=this.props.lat;
   if ("Latitude" in map_json) {
       lat=map_json["Latitude"];
   }
   if ("Longitude" in map_json) {
       lng=map_json["Longitude"];
   }
   //Set up some of our variables.
   var map; //Will contain map object.
   var marker = false; ////Has the user plotted their location marker? 
   
   //Function called to initialize / create the map.
   //This is called when the page has loaded.
   function initMap() {
    
       //The center location of our map.
       var centerOfMap = new google.maps.LatLng(lat, lng);
    
       //Map options.
       var options = {
         center: centerOfMap, //Set center.
         zoom: 3, //The zoom value.
         mapTypeId: google.maps.MapTypeId.HYBRID
       };
    
       //Create the map object.
       map = new google.maps.Map(document.getElementById('map'), options);
       
       var pointMarker=new google.maps.Marker({
           position: new google.maps.LatLng(lat, lng),
           map: map, 
           
       });
    
       //Listen for any clicks on the map.
       google.maps.event.addListener(map, 'click', function(event) {     
           pointMarker.setMap(null);
           //Get the location that the user clicked.
           var clickedLocation = event.latLng;
           //If the marker hasn't been added.
           if(marker === false){
               //Create the marker.
               marker = new google.maps.Marker({
                   position: clickedLocation,
                   map: map,
                   draggable: true //make it draggable
               });
               //Listen for drag events!
               google.maps.event.addListener(marker, 'dragend', function(event){
                   markerLocation();
               });
           } else{
               //Marker has already been added, so just change its location.
               marker.setPosition(clickedLocation);
           }
           //Get the marker's location.
           markerLocation();
       });
       
        // Create the search box and link it to the UI element.
       var input = document.getElementById('pac-input');
       var searchBox = new google.maps.places.SearchBox(input);
       map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

       // Bias the SearchBox results towards current map's viewport.
       map.addListener('bounds_changed', function() {
         searchBox.setBounds(map.getBounds());
       });

       var markers = [];
       
       // Listen for the event fired when the user selects a prediction and retrieve
       // more details for that place.
       searchBox.addListener('places_changed', function() {
         
         var places = searchBox.getPlaces();

         if (places.length == 0) {
           return;
         }

         // Clear out the old markers.
         markers.forEach(function(marker) {
           marker.setMap(null);
         });
         markers = [];

         // For each place, get the icon, name and location.
         var bounds = new google.maps.LatLngBounds();
         places.forEach(function(place) {
           if (!place.geometry) {
             console.log("Returned place contains no geometry");
             return;
           }
           var icon = {
             url: place.icon,
             size: new google.maps.Size(71, 71),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(17, 34),
             scaledSize: new google.maps.Size(25, 25)
           };

           // Create a marker for each place.
           markers.push(new google.maps.Marker({
             map: map,
             icon: icon,
             title: place.name,
             position: place.geometry.location
           }));

           if (place.geometry.viewport) {
             // Only geocodes have viewport.
             bounds.union(place.geometry.viewport);
           } else {
             bounds.extend(place.geometry.location);
           }
         });
         map.fitBounds(bounds);
         map.setZoom(12);
       });
   }
           
   //This function will get the marker's current location and then add the lat/long
   //values to our textfields so that we can save the location.
   function markerLocation(){
       //Get location.
       var currentLocation = marker.getPosition();
       //Add lat and lng values to a field that we can save.
       document.getElementById('lat').value = currentLocation.lat(); //latitude
       document.getElementById('lng').value = currentLocation.lng(); //longitude
   }
           
           
   //Load the map when the page has finished loading.
   google.maps.event.addDomListener(window, 'load', initMap);
   initMap();
   $("#showMap").show();
}

  render() {
    var self=this;
     
    const MapWithASearchBox = compose(
        withProps({
          googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCUU90mGUU8I7wHFPfteUJmZHdy-CSOApM&v=3.exp&libraries=geometry,drawing,places",
          loadingElement: <div style={{ height: `100%` }} />,
          containerElement: <div style={{ height: `400px` }} />,
          mapElement: <div style={{ height: `100%` }} />,
          marker: { lat: parseFloat(self.props.lat), 
            lng: parseFloat(self.props.lng)
          },
        }),
        lifecycle({
          componentWillMount() {
            const refs = {}
            this.setState({
              bounds: null,
              center: { lat: parseFloat(self.state.lat), 
                lng: parseFloat(self.state.lng)
              },
              marker:  { lat: parseFloat(self.state.lat), 
                lng: parseFloat(self.state.lng)
              },
              onClick: ref => {
                console.log(ref);
                var clickedLocation =ref.latLng;
                var lat=clickedLocation.lat();
                var lng=clickedLocation.lng();
                self.setState({'lat':lat, 'lng':lng})
                console.log(clickedLocation);
              },
              /*
              onMapMounted: ref => {
                refs.map = ref;
              },

              onBoundsChanged: () => {
                this.setState({
                  bounds: refs.map.getBounds(),
                  center: refs.map.getCenter(),
                })
              },
              onSearchBoxMounted: ref => {
                refs.searchBox = ref;
              },
              onPlacesChanged: () => {
                const places = refs.searchBox.getPlaces();
                const bounds = new window.google.maps.LatLngBounds();
                places.forEach(place => {
                  if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport)
                  } else {
                    bounds.extend(place.geometry.location)
                  }
                });
                const nextMarkers = places.map(place => ({
                  position: place.geometry.location,
                }));
                const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
                this.setState({
                  center: nextCenter,
                  markers: nextMarkers,
                });
                // refs.map.fitBounds(bounds);
              },
              */
            })
          },
        }),
        withScriptjs,
        withGoogleMap
      )(props =>
        <GoogleMap
          ref={props.onMapMounted}
          defaultZoom={17}
          onClick={props.onClick}
          center={props.center}
          mapTypeId = {window.google.maps.MapTypeId.HYBRID}
          onBoundsChanged={props.onBoundsChanged}
          
        >
          <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search Location..."
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                marginTop: `8px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
              }}
            />
          </SearchBox>
           <Marker key={"map_marker"} position={{'lat':parseFloat(self.state.lat), 'lng':parseFloat(self.state.lng)}} />
        </GoogleMap>
      );
    
    if (this.state.loading) {
        return (
            <div id={"location_save_loading"}>
                <center>
                <img src="images/wait.gif"  width={100} />
                </center>
            </div>
        )
    } else {
        return(
            <div className={"row"} id={"location_map"}>
            <div className={"col-md-12"}>
                    <MapWithASearchBox />

                <div className={"input-group"}>
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lat"} 
                            value={"http://www.w3.org/2003/01/geo/wgs84_pos#lat"}
                            readOnly={true} />
                    <span style={{verticalAlign:"middle"}}><h1> = </h1></span>
        
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lat"} 
                            value={self.state.lat}
                            onChange={(e) => {
                                var val=e.target.value;
                                self.setState({lat:val});
                            }}
                            />   
                </div>                  
                <div className={"input-group"}>
                    <input  className={"form-control"} 
                            type={"text"}
                            id={"long_name"}
                            readOnly={true} 
                            value={"http://www.w3.org/2003/01/geo/wgs84_pos#long"} />

                    <span style={{verticalAlign:"middle"}}><h1> = </h1></span>
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lng"} 
                            onChange={(e) => {
                                var val=e.target.value;
                                self.setState({lng:val});
                            }}
                            value={self.state.lng} />   
                </div>
                <center>
                    <br/>
                    <button className={"btn btn-primary"} 
                            type={"button"} 
                            onClick={() =>{
                                self.props.saveLocation(self.state.lat, self.state.lng);
                            }}>
                            Save Location
                    </button>
                </center>

            </div>
        </div>
       
        )
    }
  }
}
