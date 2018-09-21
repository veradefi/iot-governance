import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import RoomIcon from '@material-ui/icons/Room';
import ReportIcon from '@material-ui/icons/Report';
import {Link} from 'react-router'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: "100%",
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    //height: '100vh',
    overflow: 'auto',
  },

});


class Nav extends Component {
    state = {
        mobileOpen: false,
      };
    
      handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
      };

      
    get_nav = ()=> {
            var nav_menu = [
            {
                href: 'key',
                name: 'Smart Key',
                selected: true
            },
            {
                href: 'browser',
                name: 'Browse Catalogue',
                selected: false,
            },
            
            {
                href: 'editor',
                name: 'Update Catalogue',
                selected: false,
            },            
           /*
            {
                href: 'explorer',
                name: 'VR Catalogue Explorer',
                selected: false,
            },
            */
            {
                href: 'map',
                name: 'VR Earth Explorer',
                selected: false,
            },
            {
              href: 'http://iotblock.readthedocs.io/en/latest/',
              name: 'Documentation',
              selected: false,
              target: '_newwindow'
            },
          {
                href: 'pool',
                name: 'Smart Pool Key',
                selected: false,
            },
            /*
            {
                href: 'crawler.html',
                name: 'Crawler',
                selected: false,
            },
            */
            ];    
            nav_menu.map(link => {
                 if (window.location.pathname.match(link.href)) {
                     link.selected=true;
                 } else {
                     link.selected=false;
                }

                if (window.location.pathname == "/" || window.location.pathname == "/iotpedia" || window.location.pathname == "/iotpedia/")
                    if (link.href=='key') 
                        link.selected=true;
            });
            return nav_menu;
    }

  render() {
    var nav=this.get_nav();
    const { classes, theme } = this.props;

    var drawer = (
      <div  style={{    
        flexGrow: 1,
        height: "100%",
        zIndex: 1,

        }}>
        <div className={classes.toolbar}/>
        <Divider />
        <List>
            <div>
            <ListItem button>
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Smart Key" />
            </ListItem>
            <ListItem button>
            <ListItemIcon>
                <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Browse Catalogue" />
            </ListItem>
            <ListItem button>
            <ListItemIcon>
                <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Update Catalogue" />
            </ListItem>
            <ListItem button>
            <ListItemIcon>
                <RoomIcon />
            </ListItemIcon>
            <ListItemText primary="VR Earth Explorer" />
            </ListItem>
            </div>
        
        </List>
        <Divider />
        <List>
            <div>
            <ListItem button>
            <ListItemIcon>
                <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Documentation" />
            </ListItem>
            <ListItem button>
            <ListItemIcon>
                <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="VR Catalogue Explorer" />
            </ListItem>
            <ListItem button>
            <ListItemIcon>
                <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Smart Pool Key" />
            </ListItem>
        </div>
        </List>
      </div>
    );

    drawer = (
        <div>
        { nav.map(item => { 
                            
            return <a href={item.href} key={item.href} target={item.target} >

                    <div style={{
                        width:"100%",
                        height: "65px",
                        textAlign: "left",
                        backgroundColor:  item.selected ?  "#4a90e2":"#ffffff",
                        boxShadow: item.selected ? "inset 0 0 6px 0 rgba(103, 103, 103, 0.5)" :  "inset 0 0 0px 0 rgba(63, 63, 63, 0.5)"
                        }}
                        className={"nav_menu" }>
                        <span style={{
                            paddingLeft: "16px",
                            position: "relative",
                            top: "40%",
                            transform: "translateY(-50%)"
                        }}
                        className={"nav_menu_item " + (item.selected ? " primary-item" : " secondary-item nav-title")}>
                                {item.name}
                        </span>
                </div>
                </a>
        })}
        </div>
    )

    return(

        <div className={classes.root}>
         <AppBar
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar className={classes.toolbar}>
            
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
            {nav.map(link => {
                 if (window.location.pathname.match(link.href)) {
                     return link.name;
                 } 
            })}
            {window.location.pathname == "/" || window.location.pathname == "/iotpedia" || window.location.pathname == "/iotpedia/"  ? 'Smart Key' : null}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content} style={{background:'white'}}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
         {/*
        <div className={"m-portlet__head"} 
             style={{
                    
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginTop: "0px",
                    minHeight: "100%",
             }}>
            <div style={{
                            backgroundColor: "#ffffff",  
                        
                        }} >
                <div 
                    style={{
                        borderRadius:"0px",
                        padding: "0px",
                        textAlign:"left",
                        height: "100%",
                        minWidth:"200px"
                    }}
                    id={"nav_left"}>

                            { nav.map(item => { 
                            
                                return <a href={item.href} key={item.href} target={item.target} >

                                        <div style={{
                                            width:"100%",
                                            height: "70px",
                                            textAlign: "left",
                                            backgroundColor:  item.selected ?  "#4a90e2":"#ffffff",
                                            boxShadow: item.selected ? "inset 0 0 6px 0 rgba(103, 103, 103, 0.5)" :  "inset 0 0 0px 0 rgba(63, 63, 63, 0.5)"
                                            }}
                                            className={"nav_menu" }>
                                            <span style={{
                                                paddingLeft: "16px",
                                                position: "relative",
                                                top: "40%",
                                                transform: "translateY(-50%)"
                                            }}
                                            className={"nav_menu_item " + (item.selected ? " primary-item" : " secondary-item nav-title")}>
                                                    {item.name}
                                            </span>
                                    </div>
                                    </a>
                            })}
                </div>
            </div>
        </div>    								
                        */}
      </div>

       
    )
  }
}
       

Nav.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles, { withTheme: true })(Nav);