import Dialog from 'react-toolbox/lib/dialog';
import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";

import '../../App.css'

var $ = require ('jquery');

const stateToProps = state => {
    return {
      web3:state.web3.web3Instance,
      dialogShowing:state.items.dialogShowing2,
      dialogTitle:state.items.dialogTitle2,
      dialogContent:state.items.dialogContent2,
      dialogSize:state.items.dialogSize2,
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
        showDialog2: (show, content) => {
            dispatch(actions.showDialog2(show, content));
        },
        closeDialog2: () => {
            dispatch(actions.closeDialog2());
        },
    };
};

@connect(stateToProps, dispatchToProps)
export default class ShowDialog extends Component {
    static propTypes = {
        showDialog2:PropTypes.func.isRequired,
        closeDialog2:PropTypes.func.isRequired,
    };
  
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  constructor(props) {
    super(props);

    this.state = {
        /*
        active: false,
        actions : [],
            { label: "Cancel", onClick: this.handleToggle },
            { label: "Save", onClick: this.handleToggle }
          ];
          */

    };
    this._isMounted = false;
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  componentDidMount() {
    this._isMounted = true;
  }
  render() {
    return(
      
     <div>
        <Dialog
          actions={this.state.actions}
          active={this.props.dialogShowing}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={this.props.dialogTitle}
          type={this.props.dialogSize}
        >
            {this.props.dialogContent}
        </Dialog>
      </div>
    )
  }
}

