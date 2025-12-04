import React, { useContext, useEffect, useReducer, useRef} from 'react';
import { AppBar, CssBaseline,   Button,
  FormGroup,  Switch,
  IconButton, Toolbar, Typography , Menu , MenuItem, Link} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CGPVContext } from '../providers/cgpvContextProvider/CGPVContextProvider';
import { MapRenderer } from './MapRenderer';
import { useSearchParams } from "react-router-dom";
import { DEFAULT_CONFIG_FILE, DEFAULT_LEFT_PANEL_MIN_WIDTH, DEFAULT_LEFT_PANEL_MAX_WIDTH, DEFAULT_LEFT_PANEL_WIDTH ,
  DEFAULT_RIGHT_PANEL_MIN_WIDTH, DEFAULT_RIGHT_PANEL_MAX_WIDTH, DEFAULT_RIGHT_PANEL_WIDTH
} from '@/constants';
import {  ImperativePanelHandle,Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import DrawerTabs from './DrawerTabs';
import FormControlLabel from '@mui/material/FormControlLabel';
import { GEOVIEW_CORE_URL } from "@/constants";
import {panelSize} from '@/constants';



interface GeoViewMapProps {
  showConfigEditor?: boolean;
  children?: React.ReactNode;
  top?: React.ReactNode;
  codeSnippet?: string;
  bottom?: React.ReactNode;
}

 let mapWidth2=0;



function GeoViewMap(props: GeoViewMapProps) {
  const cgpvContext = useContext(CGPVContext);
  const [searchParams, setSearchParams] = useSearchParams();

 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
   
  
  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const {  handleApplyStateToConfigFile
     } = cgpvContext;

  const { configFilePath, initializeMap, isInitialized } = cgpvContext;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [isClosing, ] = React.useState(false);

  const {setMapWidth} = cgpvContext;
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

   const [panelExpanded, setPanelOpen] = React.useState(false);

   const [itemColor,] = useState('#1976d2');

    const mapWidthRef= useRef<HTMLButtonElement>(null);

  const handlePanel1Resize = (size : any) => {
    panelSize.current = (window.innerWidth - (435 +7))* (size*.01);
  };

  const {
    children
  } = props;

  useEffect(() => {
      // commendted dec 3   setMapWidth((window.innerWidth - (435 +7)).toString() + "px");
        console.log("window width=",window.innerWidth - (435 +7));
        forceUpdate();
  }, [mapWidth2]);

  useEffect(() => {
    if(!isInitialized) {
      const fPath = searchParams.get('config') ?? DEFAULT_CONFIG_FILE;
      initializeMap(fPath, true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (configFilePath && configFilePath.length > 0) {
      setSearchParams({ config: configFilePath });
    } else if(isInitialized) {
      setSearchParams({ config: ''});
    }
  }, [configFilePath]);

  const handleChangePanel = () => {
     setPanelOpen(!panelExpanded);
      leftPanelRef.current!.isCollapsed() ?  leftPanelRef.current!.expand() :  leftPanelRef.current!.collapse() ;
    if ( leftPanelRef.current!.isCollapsed()) {
       rightPanelRef.current!.resize(100) ; 
      mapWidthRef.current!.click();
      setTimeout(() => { mapWidthRef.current!.click() }, 10000);  //works, must resize pabnel before ?
    }
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
  
    <PanelGroup direction="horizontal"  >
       <Panel  style={{overflowY: 'auto',  height: '119vh' } }
          collapsible
          minSize={DEFAULT_LEFT_PANEL_MIN_WIDTH}
          maxSize={DEFAULT_LEFT_PANEL_MAX_WIDTH}
          defaultSize={DEFAULT_LEFT_PANEL_WIDTH} // panel size
          ref={leftPanelRef} 
          onResize={ (number)=> { console.log("left panel resized to:", number) ;
               setMapWidth((window.innerWidth - (435 +7)).toString() + "px");
               mapWidth2 = (window.innerWidth - (435 +7));
               panelSize.current = (window.innerWidth - (435 +7));
               forceUpdate();
           } }
   
       >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

       <DrawerTabs />

       <CssBaseline />
         <AppBar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

         </AppBar>
      </Panel> 

       <PanelResizeHandle  style={{ display: 'flex', flexDirection: 'column', gap: 2, border: "1px solid #141313ff",width : 5 }}/> 
       <Panel 
         collapsible
         minSize= {DEFAULT_RIGHT_PANEL_MIN_WIDTH }
         maxSize= {DEFAULT_RIGHT_PANEL_MAX_WIDTH}
         ref= {rightPanelRef} 
         onResize= {handlePanel1Resize}
         defaultSize= {DEFAULT_RIGHT_PANEL_WIDTH}
       >

        <Toolbar  sx={{backgroundColor: 'rgb(25, 118, 210 )'
          }}>
      {children}
       <FormGroup aria-label="Layer List"  >
                 <label style={{ color: itemColor ,
                 justifyContent: 'left',
              alignItems: 'left',}}>
     
         </label>
           <FormControlLabel id="swiper" sx={{ justifyContent: 'flex-end', alignItems: 'baseline',}}
              label=""
              control={<Switch checked={panelExpanded} onChange={ handleChangePanel}
              sx={{
                    "& .MuiInputBase-root.Mui-disabled": {
                    },
                    "& .MuiFormLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0,0.0)"
                    },
                       "&.Mui-disabled": {
                    },
                    '& .MuiFormControlLabel-label': {
                       color: itemColor
                    },
                     '& .css-1nweas-MuiFormControlLabel-root.MuiFormControlLabel-label.Mui-disabled': {
                    },
                    '& .MuiFormControlLabel-root': {
                         color: itemColor
                    },          
                    "&.MuiSwitch-root .MuiSwitch-switchBase": {
                    },
                    "& .MuiSwitch-thumb": {
                        color: itemColor
                    },
                      "& .MuiSwitch-track": {  // if dont sepecify is grey
                         backgroundColor: "white",// works is white when collapse
                    },
                      '& .Mui-checked + .MuiSwitch-track': {
                         backgroundColor: "white" // Example: Orange color when checked
                    }
                }}
               />}
              labelPlacement="start"/>
              <Button ref={mapWidthRef} variant="contained" 
                            style={{ maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px',color:itemColor,display:"none"}}
                            onClick={(event) => {  setMapWidth( window.innerWidth.toString() + "px");
                              setTimeout(() => {handleApplyStateToConfigFile() }, 5000);  //works with the d   handleApplyStateToConfigFile();
              }} >
              </Button>
    </FormGroup>
      <img src={`${GEOVIEW_CORE_URL}/img/Logo.png`} alt="GeoView" 
      style={{ height: 0, marginRight: 16 }} />{/* Adjust height and margin as needed */}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1,color: 'white'}}>
        Canadian Geospatial Platform (CGP) - GeoView
      </Typography>
      <IconButton
        size="large" 
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
      <SettingsIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} href="https://github.com/Canadian-Geospatial-Platform/geoview-demo" target="_blank"> GitHub</MenuItem>
        <MenuItem component={Link} href="https://canadian-geospatial-platform.github.io/geoview-demo/"  target="_blank"> Demo</MenuItem>
        <MenuItem component={Link} href="https://github.com/Canadian-Geospatial-Platform/geoview"  target="_blank"> Geoview Github</MenuItem>
      </Menu>

      </Toolbar>
        {props.top}
        {children}
          <MapRenderer />
        {props.bottom}
       </Panel>
  </PanelGroup>
  );
}

export default GeoViewMap
