import React, { Component } from 'react'
var $ = require ('jquery');


export default class BrowserMapInfo extends Component {
  constructor(props) {
    super(props)
    this.state={
        loading:false
    }
  }

  
getMap = () => {
    $('#showMap').html('');
   var google=window.google;
   var map_json=this.props.map_json;
   var lng=-0.116993;
   var lat=51.508775;
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
                <div id={"map"} style={{width:"100%",height:"300px"}}></div>

                    <input id={"pac-input"} 
                    type={"text"} 
                    placeholder={"Search Box"} 
                    autocomplete={"off"} 
                    style={{height:"30px",width:"300px"}} 
                    className={"m-input m-input--air"} />
                
                <div className={"input-group"}>
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lat_name"} 
                            value={"http://www.w3.org/2003/01/geo/wgs84_pos#lat"} />
                    <span style="vertical-align:middle;"><h1> = </h1></span>
        
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lat"} 
                            value={this.props.latitude} />   
                </div>                  
                <div className={"input-group"}>
                    <input  className={"form-control"} 
                            type={"text"}
                            id={"long_name"} 
                            value={"http://www.w3.org/2003/01/geo/wgs84_pos#long"} />

                    <span style="vertical-align:middle;"><h1> = </h1></span>
                    <input  className={"form-control"} 
                            type={"text"} 
                            id={"lng"} 
                            value={this.props.longitude} />   
                </div>
                <center>
                    <br/>
                    <button className={"btn btn-primary"} 
                            type={"button"} 
                            onClick={() =>{
                                this.props.save_location($('#browse_url').val(),$('#lat').val(),$('#lng').val());
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
