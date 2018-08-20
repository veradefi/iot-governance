import React, { Component } from 'react'

export default class Nav extends Component {
    
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
            {
                href: 'http://iotblock.readthedocs.io/en/latest/',
                name: 'Documentation',
                selected: false,
                target: '_newwindow'
            },
           
            {
                href: 'explorer',
                name: 'VR Catalogue Explorer',
                selected: false,
            },
            {
                href: 'map',
                name: 'VR Earth Explorer',
                selected: false,
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
            });
            return nav_menu;
    }

  render() {
    var nav=this.get_nav();
    return(
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
    )
  }
}
       