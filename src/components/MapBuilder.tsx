/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
} from '@mui/material';
import { useContext, useState } from 'react';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash';
import PillsAutoComplete from './PillsAutoComplete';
import {
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, navBarOptions, appBarOptions,mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST, corePackagesOptions
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';
import { CollectionsBookmarkOutlined } from '@mui/icons-material';
// below added aas a test ti see f can stop from rerendering
import { memo,useMemo } from "react";



//export function MapBuilder() {
 
export function MapBuilder() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const { configJson, handleConfigFileChange,
    handleConfigJsonChange, configFilePath, mapWidth, mapHeight, setMapWidth, setMapHeight } = cgpvContext;

  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(configJson);
  const [isModified, setIsModified] = useState<boolean>(false);

  const _updateConfigProperty = (property: string, value: any) => {
    const newConfig = { ...modifiedConfigJson };
    if (value === undefined) {
      _.unset(newConfig, property);
    } else {
      _.set(newConfig, property, value);
    }
    setModifiedConfigJson(newConfig);
    setIsModified(true);

  }

  //losash returns  boolen in json, returns a value that is not a string,oct 15
  //need string for mapbuilder panel but not to write to file

  //do you get boolean in get priperty for map.basemapOptions.shaded = true
  //need tur fase button type
  
  ////////////////////////////////////////////////////////////////////////////////////////
  //have to test if map loaded befeor looking for undefined
  // cycles thru multiple time with  undefined because json isnt loadedd right away
  
  //change type of button that accetps tru false for shaed or laeled

  const selectedItem = useMemo(() => (isModified), [
        isModified
      ]);

  
  
  const getProperty = (property: string, defaultValue = undefined) => {
    console.log(property, "=", _.get(configJson, property));
     
    if (property == 'map.basemapOptions.shaded')
    {
      console.log(" shaded  1 property=");
      console.log(" shaded  1 property type=",typeof (_.get(configJson, property)));
      //if (_.get(configJson, property) == false) { console.log(" shaded000000"); return ('false'); }
    //  else return ('true');
    };

  //  if (property == 'map.basemapOptions.labeled')
    if (property == 'map.basemapOptions.labelled')
    {
      console.log(" labeled 2 property=");
      console.log(" labeled 2 property type=",typeof (_.get(configJson, property)));
    //  if (_.get(configJson, property) == false) { console.log(" labeled000000"); return ('false'); }
     //  else return ('true');
    };

    if (property == 'navBar') {

      console.log(" looking for navbar");
      if (typeof (_.get(configJson, property)) == 'undefined') {

//have to add to configJson, by returning values only update ui adn not the file

         console.log("nav bar undefined -----------------------");
        var b = {
          map: {
            navbar: ['zoom', "fullscreen", "home", "basemap-select"]
          }
        };

        //_.assign(a, b); // extend
     //   _.assign(configJson, b); // extend
        //  _.merge(configJson, b); // extend

     //      _.defaultsDeep(configJson, b); // works
      
        // updateArrayProperty('navBar', "zoom");
      //  console.log("map.navbar  zoom e=", (_.get(configJson, "map.navBar.zoom")));
      //  console.log("map.navbar  zoom e=", (_.get(configJson, "zoom")));
    
        return (['zoom', "fullscreen", "home", "basemap-select"]); // will appear in json file written if modify one of these
      }
      
    };

    if (property == 'appBar.tabs.core') {
         
      //have to add to configJson, by returning values only update ui adn not the file

      console.log(" looking for appbar");
      if (typeof (_.get(configJson, property)) == 'undefined') {
         console.log("appbar undefined -----------------------");
        var c = {
          appbar: {
            tabs: {
              core:['geolocator']
            } 
          }
        };

        //_.assign(a, b); // extend
     //   _.assign(configJson, b); // extend
       //  _.merge(configJson, b); // extend
      //  _.defaultsDeep(configJson, c); // works
      
        // updateArrayProperty('navBar', "zoom");
      //  console.log("map.navbar  zoom e=", (_.get(configJson, "map.navBar.zoom")));
      //  console.log("map.navbar  zoom e=", (_.get(configJson, "zoom")));
    
        return (['geolocator']);
      }
    }


    //console.log(" shaded  1 property=",);
    //  console.log(" shaded  1 property type=",typeof (_.get(configJson, property)));
     // if (_.get(configJson, property) == false) { console.log(" shaded000000"); return ('false'); }
   // }//
    return _.get(configJson, property) ?? defaultValue;
  };

  const updateProperty = (property: string, value: any) => {
    _updateConfigProperty(property, value);
  };

  const updateArrayProperty = (property: string, value: any) => {
    _updateConfigProperty(property, value);
  }

  const toggleOffProperty = (property: string) => {
    _updateConfigProperty(property, undefined);
  }

  const isPropertyEnabled = (property: string) => {
    return getProperty(property) !== undefined;
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, property: string) => {
    if (!event.target.checked) {
      toggleOffProperty(property);
    }
  }

  const handleApplyConfigChanges = () => {
    handleConfigJsonChange(modifiedConfigJson);
    setIsModified(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <ConfigSaveUploadButtons />

      <Divider sx={{ my: 2 }} />

      <Button onClick={handleApplyConfigChanges}
        disabled={!isModified}
        variant="contained" color="primary" size="small">
        Apply Config Changes
      </Button>

      <FormControl component="fieldset" sx={{ mt: 4, gap: 3 }}>

        <SingleSelectComplete
          options={CONFIG_FILES_LIST}
          defaultValue={configFilePath}
          applyGrouping={true}
          onChange={(value) => handleConfigFileChange(value)}
          label="Select Configuration File" placeholder="" />

        <FormGroup aria-label="position">
          <FormLabel component="legend">Map Size</FormLabel>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl>
              <TextField
                size="small"
                id="map-width"
                label="Width"
                defaultValue={mapWidth}
                onChange={(event) => { setMapWidth(event.target.value); setIsModified(true); }}
                helperText="e.g. 100% or 500px"
                variant="outlined" />
            </FormControl>
            <FormControl>
              <TextField
                size="small"
                id="map-height"
                label="Height"
                defaultValue={mapHeight}
                onChange={(event) => { setMapHeight(event.target.value); setIsModified(true); }}
                helperText="e.g. 100% or 500px"
                variant="outlined" />
            </FormControl>
          </Box>
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <SingleSelectComplete
          options={themeOptions}
          defaultValue={getProperty('theme')}
          onChange={(value) => updateProperty('theme', value)}
          label="Display Theme" placeholder="" />

        <SingleSelectComplete
          options={mapInteractionOptions}
          defaultValue={getProperty('map.interaction')}
          onChange={(value) => updateProperty('map.interaction', value)}
          label="Map Interaction" placeholder="" />

        
        <SingleSelectComplete
          options={basemapShading}
          defaultValue={Boolean(getProperty('map.basemapOptions.shaded')) ? 'true':'false' }
          onChange={(value) => {
            updateProperty('map.basemapOptions.shaded', JSON.parse(value)); 
            console.log("value of unshaded=",value,"boolean=", JSON.parse(value));
          }}
          label="Base Map Shaded" placeholder="" />
        
         <SingleSelectComplete
          options={basemapLabelling}
          defaultValue={getProperty('map.basemapOptions.labeled')}
          onChange={(value) => updateProperty('map.basemapOptions.labeled', value)}
          label="Base Map Labeled" placeholder="" />
        
        <FormGroup aria-label="position">
          <FormLabel component="legend">Zoom Levels</FormLabel>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.minZoom')}
                onChange={(value) => updateProperty('map.viewSettings.minZoom', value)}
                label="Min Zoom" placeholder="" />
            </FormControl>
            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.maxZoom')}
                onChange={(value) => updateProperty('map.viewSettings.maxZoom', value)}
                label="Max Zoom" placeholder="" />
            </FormControl>
          </Box>
        </FormGroup>

        <FormGroup aria-label="map projection">
          <SingleSelectComplete
            options={mapProjectionOptions}
            defaultValue={getProperty('map.viewSettings.projection')}
            onChange={(value) => updateProperty('map.viewSettings.projection', value)}
            label="Map Projection" placeholder="" />
        </FormGroup>

        <FormGroup aria-label="Components">
          <FormLabel component="legend">Components</FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('components')}
            onChange={(value) => updateArrayProperty('components', value)}
            options={componentsOptions}
            label="Components Options"
            placeholder=""
          />
        </FormGroup>

        <FormGroup aria-label="Navigation Bar Options">
          <FormLabel component="legend">Navigation Bar</FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('navBar')}
            onChange={(value) => updateArrayProperty('navBar', value)}
            options={navBarOptions}
            label="Options" placeholder="" />
        </FormGroup>

        <FormGroup aria-label="Footer bar">
          <FormLabel component="legend">
            Footer Bar
            <Switch size="small" checked={isPropertyEnabled('footerBar.tabs.core')}
              onChange={(event) => handleSwitchChange(event, 'footerBar')}
            />
          </FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('footerBar.tabs.core')}
            onChange={(value) => updateArrayProperty('footerBar.tabs.core', value)}
            options={footerTabslist} label="Footer Options" placeholder="" />
        </FormGroup>

        <FormGroup aria-label="Appbar">
          <FormLabel component="legend">
            App Bar
            <Switch size="small" checked={isPropertyEnabled('appBar.tabs.core')}
              onChange={(event) => handleSwitchChange(event, 'appBar')}
            />
          </FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('appBar.tabs.core')}
            onChange={(value) => updateArrayProperty('appBar.tabs.core', value)}
            options={appBarOptions} label="App-bar Options" placeholder="" />
        </FormGroup>

        <FormGroup aria-label="Core Packages Options">
          <FormLabel component="legend">Core Packages</FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('corePackages')}
            onChange={(value) => updateArrayProperty('corePackages', value)}
            options={corePackagesOptions}
            label="CorePackages Options" placeholder="" />
        </FormGroup>
 <div> {selectedItem} </div>
      </FormControl>
    </Box>
 
  );
  
}
//export default memo(MapBuilder);
// export  memo(MapBuilder);


