import React, { Component } from 'react'
import * as web3Utils from "../../util/web3/web3Utils";
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import ContractFormDAO from '../../util/web3/ContractFormDAO'
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'
import BigNumber from 'bignumber.js';
import createKeccak from 'keccak';

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
var eth1_amount=1000000000000000000;


export default class MapDataDAO extends Component {
  constructor(props, context) {
    super(props)
    //this.drizzleState=context.drizzle.store.getState()
    //this.contracts = context.drizzle.contracts

    this.state={
        loading:true,
        lat:props.lat,
        lng:props.lng,
        zoom:7
    }
    var self=this;

    
  }

componentDidMount() {
    /*
    var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(this.props.contract));
    var events=[];
    var web3=web3Utils.get_web3();
    var drizzle=this.context.drizzle;
    //this.setState({loading:false})
    //context.drizzle.addContract({cfg, events})
    this.props.addContract(drizzle, cfg, events, web3) 
    */
    this.setState({loading:false})    
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
                //refs.map.fitBounds(bounds);
              },
              onZoomChanged: () => {
                  console.log(refs.map.getZoom())
                self.setState({zoom:refs.map.getZoom()})
                //onZoomChange(refs.map.getZoom())
              }
              
            })
          },
        }),
        withScriptjs,
        withGoogleMap
      )(props =>
        <GoogleMap
          ref={props.onMapMounted}
          defaultZoom={self.state.zoom}
          onClick={props.onClick}
          center={props.center}
          mapTypeId = {window.google.maps.MapTypeId.HYBRID}
          onBoundsChanged={props.onBoundsChanged}
          onZoomChanged={props.onZoomChanged}
          
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
    } 
    if (this.state.saving) {
        return (
            <div id={"location_save_loading"}>
                Saving Map Data. Please Confirm ETH Transactions...
            </div>
        )
    }
        return(
            <div className={"row"} id={"location_map"}>
            <div className={"col-md-12"}>
                    <MapWithASearchBox />
                    {!this.props.viewOnly ?  
                    <ContractFormDAO 
                        contract={this.props.contract}
                        mapEdit={true}
                        lat={this.state.lat}
                        lng={this.state.lng}
                        mdata={this.props.mdata}
                        setLat={(lat)=> {
                            self.setState({lat:lat});
                        }}
                        setLng={(lng)=> {
                            self.setState({lng:lng});
                        }}
                    />
                    :
                    null}

            </div>
        </div>
       
        )
    
  }
}

