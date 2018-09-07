import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import * as web3Utils from "../../util/web3/web3Utils";
import {Springy, Graph, Node} from "springy";
var $ = require ('jquery');



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
export default class Explorer extends Component {
  constructor(props) {
    super(props)
    var self=this;

    this.state={
        transferAmt:1,
        isSmartKey:false,
        isBrowse:false,
        isWeb:false,
        isPool:false,
        
    }
    self.graph={}; 
    self.cursor=""
    self.cursor_subURL = "";
    self.facts=[];

  }
  
  
  parseCatalogue = (url, doc) => {
      var self=this;
      try {
          // store metadata for catalogue
          for (var i=0;i<doc['catalogue-metadata'].length;i++) {
              //console.log("CATL-FACT "+url+" "+doc['catalogue-metadata'][i].rel+" "+doc['catalogue-metadata'][i].val);
              self.origin=url
              self.subject=url
              self.predicate=doc['catalogue-metadata'][i].rel
              self.object= doc['catalogue-metadata'][i].val
          }
      } catch(e) {
          console.log(e);
      }
  
      try {
          // store metadata for items and expand any catalogues
          for (var i=0;i<doc.items.length;i++) {
              var item = doc.items[i];
              item.href = window.URI(item.href).absoluteTo(url).toString();    // fixup relative URL
              // store that catalogue has an item
              self.origin=url
              self.subject= url
              self.predicate= "urn:X-tsbiot:rels:hasResource"
              self.object= item.href

              for (var j=0;j<item['item-metadata'].length;j++) {
                  var mdata = item['item-metadata'][j];
                  //console.log("ITEM-FACT "+item.href+" "+mdata.rel+" "+mdata.val);
                  self.origin= url
                  self.subject=item.href
                  self.predicate= mdata.rel
                  self.object= mdata.val
              }
          }
      } catch(e) {
          console.log(e);
      }
  }
  


  explore = (url, cb) => {
      var self=this;

      self.fetch(url, '', function(err, doc) {
          if (err) {
                self.log("Error in "+url+" ("+err+")");
                cb(err); // done
          } else {
                self.parseCatalogue(url, doc);    // parse doc
                cb(null); // done
          }
      });
  }
  


  dumpGraph = (filterFunc) => {
      var self=this;
      self.graph.filterNodes(function(){return false});
    

      // draw edges and nodes
      for (var i=0;i<self.facts.length;i++) {
          if (!window.reachable(self.cursor, self.facts[i].subject, parseInt($('#baconism').val(),10)-1))
              continue;
          if (!window.reachable(self.cursor, self.facts[i].object, parseInt($('#baconism').val(),10)-1))
              continue;
          self.graph.addNodes(self.facts[i].subject);
  
          // If this does not look like a URI, make it a unique node
          var prefix = "";    // FIXME
          if (!self.facts[i].object.match("/^http/") && 
               self.facts[i].object.match("/^mqtt/") && 
              !self.facts[i].object.match(/"^urn:"/) && 
              !self.facts[i].object.match(/^\//))
              prefix = self.facts[i].subject+self.facts[i].predicate;
          var node = new Node(prefix+self.facts[i].object, {label:self.facts[i].object});
          self.graph.addNode(node);
          self.graph.addEdges([self.facts[i].subject, prefix+self.facts[i].object, {label:self.facts[i].predicate}]);
      }
  
      // decorate nodes
      for (var i=0;i<self.graph.nodes.length;i++) {
          if (self.subjectHasPredicateAndObject(self.graph.nodes[i].id, 'urn:X-tsbiot:rels:isContentType', 'application/vnd.tsbiot.catalogue+json'))
          self.graph.nodes[i].data.color = '#FFFF66';
          if (self.graph.nodes[i].id == self.cursor)
          self.graph.nodes[i].data.color = '#008000';
      }
  }
  
  updateSubscribeButton = () => {
      var self=this;
      $("#subscribe").attr("disabled", "disabled");
      for (var i=0;i<self.facts.length;i++) {
          if (self.facts[i].subject == self.cursor &&
              self.facts[i].predicate == "urn:X-tsbiot:rels:eventSource") {
              self.cursor_subURL = window.URI(self.facts[i].object).absoluteTo(self.cursor).toString();
              $("#subscribe").removeAttr("disabled");
              return;
          }
      }
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
  
  subjectHasPredicateAndObject = (s, p, o) => {
      
      var self=this;
      for (var i=0;i<self.facts.length;i++) {
          if (self.facts[i].subject == s &&
              self.facts[i].predicate == p &&
              self.facts[i].object == o) {
                  return true;
          }
      }
      return false;
}
  
subscribe = (url) => {
      var self=this;

      console.log("Subscribing to "+url);
      var source = new EventSource(url);
  
      source.addEventListener('message', function(e) {
          // turn item into a mini-catalogue
          var o = JSON.parse(e.data);
          o.href = window.URI(o.href).absoluteTo(url).toString();    // fixup relative URL
          var cat = {
              "item-metadata":[],
              items:[o]
          };

          // forget what we previously knew from this origin about this subject

          self.newfacts = [];
          for (var i=0;i<self.facts.length;i++) {
              if (!(self.facts[i].origin == self.cursor && self.facts[i].subject == o.href))
                  self.newfacts.push(self.facts[i]);
          }
          self.facts = self.newfacts;
          self.parseCatalogue(self.cursor, cat);
          self.dumpGraph();
      }, false);
  
      source.addEventListener('open', function(e) {
          console.log("Subscription opened");
      }, false);
  
      source.addEventListener('error', function(e) {
          if (e.readyState == EventSource.CLOSED)
              console.log("Subscription closed");
      }, false);
}
  
log = (msg) => {
    var log = $('#log');
    log.append(msg + "<br/>\n");
    //log.scrollTo('100%');
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
            self.log('<- ' + xhr.status + ' ' + xhr.statusText)
            cb(null, body, url) //xhr.getResponseHeader('Location'));
        },
        error: function(xhr, textStatus) {
            self.log('<- Error ' + xhr.status + ' ' + xhr.statusText)
        }
    });
}

parseLinks = () => {
    var self=this;
    var url='https://iotblock.io/cat';
        
    //alert(url);
    self.fetch(url, $('#key').val(), function(err, doc, location) {
        var urls=[url];
    
        try {
            for (var i=0;i<doc.items.length;i++) {

                var item = doc.items[i];
                item.href = window.URI(item.href).absoluteTo(url).toString()
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
    /*
    var self=this;
    self.parseLinks();

    $('#urls').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        $('#url').val(this.value);
        self.cursor = this.value;
        self.explore(this.value, function() {
            self.log('explore complete');
            self.dumpGraph();
            self.updateSubscribeButton();
        });
    });

    $("#go").click(function() {
        self.cursor = $('#url').val();
        self.explore($('#url').val(), function() {
        self.log('explore complete');
        self.dumpGraph();
        self.updateSubscribeButton();
        });
    });

    $("#clear").click(function() {
        
        self.facts = [];
        self.dumpGraph();
        
    });

    $("#subscribe").click(function() {
    self.subscribe(self.cursor_subURL);
    });

    $("#inc_baconism").click(function() {
        $('#baconism').val(parseInt($('#baconism').val(),10) + 1);
        self.dumpGraph();
    });
    
    $("#dec_baconism").click(function() {
        var n = parseInt($('#baconism').val(),10);
        if (n > 1) {
            $('#baconism').val(n - 1);
            self.dumpGraph();
        }
    });


    self.graph = new Graph({stiffness:10000, repulsion:10000, damping:2.0});
    self.springy = window.jQuery('#graph').springy({
        graph: self.graph,
        nodeSelected: function(node) {
            if (self.subjectHasPredicateAndObject(node.data.label, 'urn:X-tsbiot:rels:isContentType', 'application/vnd.tsbiot.catalogue+json')) {
            self.cursor = node.data.label;
                self.explore(node.data.label, function() {
                self.log('explore complete');
                self.dumpGraph();
                self.updateSubscribeButton();
                });
            }
        }
      });
  
      self.canvas = document.querySelector('canvas');
      self.fitToContainer(self.canvas);
      
      */
  }
  
  render() {
    return(
    <div id={"explorerkeyinfo"} >
        <iframe width={"100%"} height={600} border={0} style={{padding:"0px", margin:"0px", border:"0px"}} src={"https://iotblock.io/vr/nodemap.html"} />

         
        
    </div>

    )
  }
}

/*

        <p>
        Interactive catalogue explorer. Click a <span className={"yellow"}>yellow</span> catalogue node to expand. The <span className={"green"}>green</span> node is the current self.cursor.
        </p>
    <div className={"row"}>
    <div className={"col-md-12"}>
                
                <div className={"input-group"}>
                <label className={"title3"}>
                URL:&nbsp;
                </label><select id={"urls"} className={"form-control m-input m-input--air"} ></select>
                <input className={"form-control m-input m-input--air"} type="text" id={"url"} size={80} defaultValue={"Enter a URL"} />
                <input type="button"  className={"btn m-btn--pill m-btn--air         btn-outline-info"}  className={"go"} defaultValue={"Go"} />
                </div>

        </div>
    </div>
    <div className={"row"}>
        <div className={"col-md-12"}>

            <div className={"canvascontainer"}>
                <canvas id={"graph"}/>
            </div>
                    <div className={"input-group"}>
                    <label className={"title3"}>Number of hops to show:&nbsp;</label>
                    <input type="button" className={"dec_baconism"} defaultValue={"-"} />
                    <input type="text" className={"baconism"} size={4} defaultValue={"3"} />
                    <input type="button" className={"inc_baconism"} defaultValue="+" />
                    </div>

                <div>
                    <div className={"log"}></div>
                </div>
            </div>
        </div>


*/