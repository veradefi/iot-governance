import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import * as web3Utils from "../../util/web3/web3Utils";
import {Springy, Graph} from "springy";
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
var $ = require ('jquery');


var API_KEY="AIzaSyCUU90mGUU8I7wHFPfteUJmZHdy-CSOApM"

  
const stateToProps = state => {
    return {
      
    };
  };
  
  /**
   *
   * @function dispatchToProps React-redux dispatch to props mapping function
   * @param {any} dispatch
   * @returns {Object} object with keys which would later become props to the `component`.
   */
  
const dispatchToProps = dispatch => {
    return {
        showDialog: (show, content) => {
            dispatch(actions.showDialog(show, content));
        },
        closeDialog: () => {
            dispatch(actions.closeDialog());
        },
    };
};

@connect(stateToProps, dispatchToProps)
export default class Map extends Component {
  constructor(props) {
    super(props)
    this.state={
    }

    var self=this;
    self.isSmartKey=false;
    self.isBrowse=false;
    self.isWeb=false;
    self.isPool=false;
    self.unexplored = [];
    self.explored = [];
    self.infoWindows = {};
    self.map;
    self.markers = [];
    //self.infowindow = google.maps.InfoWindow();
    

  }
  
  log = (msg) => {
    var log = $('#log');
    log.append(msg + "<br/>\n");
    log.scrollTo('100%');
  }



  fetch = (url, key, cb) => {
    var self=this;
    self.log('-> GET ' + url);
    $.ajax({
        beforeSend: function(xhr){
            if (key !== "")
                xhr.setRequestHeader("Authorization", "Basic " + window.Base64.encode(key + ':'));
        },
        type: 'GET',
        url: '/cat/get?href='+encodeURIComponent(url),
        dataType: 'json',
        success: function(body, textStatus, xhr) {
            self.log('<- ' + xhr.status + ' ' + xhr.statusText);
            self.cb(null, body, url); //xhr.getResponseHeader('Location'));
        },
        error: function(xhr, textStatus) {
            self.log('<- Error ' + xhr.status + ' ' + xhr.statusText);
        }
    });
}

storeFact = (o) => {
    var self=this
    // only store unique facts (FIXME, slow)
    for (var i=0;i<self.facts.length;i++) {
        if (self.facts[i].subject == o.subject &&
            self.facts[i].predicate == o.predicate &&
            self.facts[i].object == o.object)
                return;
    }
    self.facts.push(o);
}


  expandCatalogue = (url, doc) => {
    var self=this;
    try {
        // store metadata for catalogue
        for (var i=0;i<doc['catalogue-metadata'].length;i++) {
            //console.log("CATL-FACT "+url+" "+doc['catalogue-metadata'][i].rel+" "+doc['catalogue-metadata'][i].val);
            self.storeFact({
                subject: url,
                predicate: doc['catalogue-metadata'][i].rel,
                object: doc['catalogue-metadata'][i].val
            });
        }
    } catch(e) {
        self.log(e);
    }

    try {
        // store metadata for items and expand any catalogues
        for (var i=0;i<doc.items.length;i++) {
            var item = doc.items[i];
            item.href = window.URI(item.href).absoluteTo(url).toString();    // fixup relative URL
            // store that catalogue has an item
            self.storeFact({
                subject: url,
                predicate: "urn:X-tsbiot:rels:hasResource",
                object: item.href
            });
            for (var j=0;j<item['item-metadata'].length;j++) {
                var mdata = item['item-metadata'][j];
                //console.log("ITEM-FACT "+item.href+" "+mdata.rel+" "+mdata.val);
                self.storeFact({
                    subject: item.href,
                    predicate: mdata.rel,
                    object: mdata.val
                });

                // if we find a link to a catalogue, follow it
                if (mdata.rel == "urn:X-tsbiot:rels:isContentType" &&
                    mdata.val == "application/vnd.tsbiot.catalogue+json") {
                        self.unexplored.push(item.href);
                }
            }
        }
    } catch(e) {
        self.log(e);
    }
}

crawl = (cb) => {
    var self=this;
    if (self.unexplored.length > 0) {    // something to explore
        var url = self.unexplored.pop();

        if (self.explored.indexOf(url) == -1) {   // not seen before
            self.fetch(url, '', function(err, doc, location) {
                if (err) {
                    self.log("Error in "+url+" ("+err+")");
                    self.explored.push(url); // was bad, but explored
                    self.crawl(cb);
                } else {
                    self.explored.push(url);
                    if (self.location === undefined)
                      self.location = url;
                    self.expandCatalogue(location, doc);    // parse doc
                    self.crawl(cb);    // do some more work
                }
            });
        } else {
            self.crawl(cb);  // get next
        }
    } else {
        self.cb();   // done
    }
}

startcrawl = (url) => {
    var self=this;
    self.unexplored.push(url);
    self.crawl(function() {
        self.log('Crawling complete');
        self.plotOnMap(self.searchForLocations());
    });
}

// http://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
fitToContainer = (canvas) => {
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='50%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}


/*
initMap = () => {
    var self=this;
    
    var myOptions = {
        center: new self.googleMaps.LatLng(0, 0),
        zoom: 2,
        mapTypeId: self.googleMaps.MapTypeId.HYBRID
    };
    self.map = new self.googleMaps.Map(document.getElementById("map_canvas"), myOptions);
}

createMarker = (lat, long, title, contentString, i) => {
    var self=this;
    self.markers[i] = new self.googleMaps.Marker({
        position: new self.googleMaps.LatLng(lat, long),
        map: self.map, 
        title:self.title
    });

    self.googleMaps.event.addListener(self.markers[i], 'click', function() {
        //self.infowindow.setContent(self.contentString);
        //self.infowindow.open(self.map, self.markers[i]);
    });
}
*/
getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}


    
plotOnMap = (locs) => {
    var self=this;

    for (var i=0;i<locs.length;i++) {
        self.contentString = '<table class="attrs">';
        for (var key in locs[i])
            self.contentString += '<tr><td><b>'+key+'</b></td><td>'+locs[i][key]+'</td></tr>';
        self.contentString += '</table>';
        self.createMarker(locs[i].latitude, locs[i].longitude, locs[i]['urn:X-tsbiot:rels:hasDescription:en'], self.contentString, self.markers.length);
    }
}

parseLinks = () => {
    var self=this;
    var url='https://iotblock.io/cat'
        
    //alert(url);
    fetch(url, $('#key').val(), function(err, doc, location) {
        var urls=[url];
    
        try {
            for (var i=0;i<doc.items.length;i++) {
                var item = doc.items[i];
                item.href = window.URI(item.href).absoluteTo(url).toString();    // fixup relative URL
                urls.push(item.href);
            }
            self.populateUrls(urls);
            $('#urls').trigger('change');

        } catch(e) {
            console.log(e);
        }
        
    });
}



populateUrls = (urls) => {

    $("#urls").find('option').remove().end();
    
    for (var i=0; i < urls.length; i++) {
        $("#urls").append(new Option(urls[i], urls[i]));
    }
    $("#urls").append(new Option('https://iotblock.io/cat', 'https://iotblock.io/cat'));

}


componentDidMount() {
    var self=this;
    /*
    var param_url = self.getQueryVariable('url');
    var param_key = self.getQueryVariable('key');
    if (param_key === undefined)
        param_key = "";

    if (param_url !== undefined) {
        $('#url').val(param_url);
        self.startcrawl($('#url').val());
    }


    //self.initMap();
    self.parseLinks();

    $('#urls').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        $('#url').val(this.value);
        self.startcrawl($('#url').val());
    });


    $("#crawl").click(function() {
        self.startcrawl($('#url').val());
    });

    $("#clear").click(function() {
        self.unexplored = [];
        self.explored = [];
        self.facts = []; // wipe known facts
        self.initMap();
    });
    */
}


// returns [{resource:,longitude:,latitude:}]
searchForLocations = () => {
    var self=this;
    var locs = {};
    for (var i=0;i<self.facts.length;i++) {
        if (locs[self.facts[i].subject] === undefined)
            locs[self.facts[i].subject] = {};

        if (self.facts[i].predicate == "http://www.w3.org/2003/01/geo/wgs84_pos#long")
            locs[self.facts[i].subject].longitude = self.facts[i].object;
        if (self.facts[i].predicate == "http://www.w3.org/2003/01/geo/wgs84_pos#lat")
            locs[self.facts[i].subject].latitude = self.facts[i].object;
        // INSERT LIST OF ALTERNATE ONTOLOGIES
    }
    // only return nodes we have long and lat for
    var ret = [];
    for (var key in locs) {
        if (locs[key].longitude !== undefined && locs[key].latitude !== undefined) {
            var o = {resource:key, longitude:locs[key].longitude, latitude:locs[key].latitude};
            // fill in any other known properties of this resource
            for (var i=0;i<self.facts.length;i++) {
                if (self.facts[i].subject == key)
                    o[self.facts[i].predicate] = self.facts[i].object;
            }
            ret.push(o);
        }
    }
    return ret;
}



  render() {
    var self=this;
   
      
    return(
    <div id={"mapinfo"} >
        <center>
        <label className={"title2"} style={{paddingTop:"5px"}}>VR Earth Explorer</label>
        <hr/>
        </center>

        <iframe 
            width={"100%"} 
            height={600} 
            border={0}  
            style={{padding:"0px", margin:"0px", border:"0px"}} 
            src={"https://iotblock.io/vr/earth.html"}>
        </iframe>
        
   </div>
    )
  }
}

/*

<div className={"row"}>
            <div className={"col-md-12"}>
                    <div className={"input-group"}>
                        <label className={"title3"}>URL:&nbsp;
                        </label>
                        <select className={"form-control m-input m-input--air"} id={"urls"}></select>
                        <input type={"text"} className={"form-control m-input m-input--air"} id={"url"} size={80} defaultValue={"Select example from dropdown or type URL"} />
                        <input type={"button"} className={"btn m-btn--pill m-btn--air         btn-outline-info"}  id={"crawl"} defaultValue={"Crawl"} />
                    </div>
                    <MapWithAMarker
                         lat={parseFloat(excursion.lat)}
                        lng={parseFloat(excursion.lng)}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                
                    The map knows about: "http://www.w3.org/2003/01/geo/wgs84_pos#long" and "http://www.w3.org/2003/01/geo/wgs84_pos#lat"
                <div>
                    <div id={"log"} style={{height:"200px"}}></div>
                </div>
            </div>
        </div>

*/