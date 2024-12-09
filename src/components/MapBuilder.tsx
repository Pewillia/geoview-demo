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
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions,appBarOptions,mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST, corePackagesOptions
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';

export function MapBuilder() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }
 
  const { mapId } = cgpvContext;
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, handleConfigJsonChange, configFilePath, mapWidth, mapHeight, setMapWidth, setMapHeight } = cgpvContext;

  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(configJson);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isEn, setEn] = useState<boolean>(true);


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

  const getProperty = (property: string, defaultValue?: any) => {
    return _.get(configJson, property) ?? defaultValue;
  };
  
  return(
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

       

      <ConfigSaveUploadButtons />

      <Divider sx={{ my: 2 }} />
      
      <Button variant="contained" color="primary" size="small" onClick={handleApplyStateToConfigFile}>
        Apply State to Config File
      </Button>

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
        
        <Divider sx={{ my: 1 }} >Map configuration</Divider>

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
        
        <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { 
           (isEn) ? cgpv.api.maps[mapId].setLanguage('fr') : cgpv.api.maps[mapId].setLanguage('en');
           setEn(!isEn);
          }}
          label="Map Language" placeholder="" />

        <SingleSelectComplete
          options={themeOptions}
          defaultValue={getProperty('theme','geo.ca')}
          onChange={(value) => updateProperty('theme', value)}
          label="Display Theme" placeholder="" />

        <SingleSelectComplete
          options={mapInteractionOptions}
          defaultValue={getProperty('map.interaction','dynamic')}
          onChange={(value) => updateProperty('map.interaction', value)}
          label="Map Interaction" placeholder="" />
        
        <Divider sx={{ my: 1 }}>Base map</Divider>

        <SingleSelectComplete
          options={basemapOptions}
          defaultValue={getProperty('map.basemapOptions.basemapId','transport')}  
          onChange={(value) => updateProperty('map.basemapOptions.basemapId', value)}
          label="Base Map" placeholder="" />
        
        <SingleSelectComplete
          options={basemapShading}
          defaultValue={Boolean(getProperty('map.basemapOptions.shaded')) ? 'true':'false' }
          onChange={(value) => { updateProperty('map.basemapOptions.shaded', JSON.parse(value))}}
          label="Base Map Shaded" placeholder="" />
        
         <SingleSelectComplete
          options={basemapLabelling}
          defaultValue={Boolean(getProperty('map.basemapOptions.labeled')) ? 'true':'false' }
          onChange={(value) => updateProperty('map.basemapOptions.labeled', JSON.parse(value))}
            label="Base Map Labeled" placeholder="" />
          
        <FormGroup aria-label="position">
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl>
              <SingleSelectComplete
              options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.minZoom', 0)}
                onChange={(value) => updateProperty('map.viewSettings.minZoom', value)}
                label="Min Zoom" placeholder="" />
            </FormControl>

            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.maxZoom', 50)}
                onChange={(value) => updateProperty('map.viewSettings.maxZoom', value)}
                label="Max Zoom" placeholder="" />
            </FormControl>
          </Box>
        </FormGroup>

        <FormGroup aria-label="map projection">
          <SingleSelectComplete
            options={mapProjectionOptions}
            defaultValue={ getProperty('map.viewSettings.projection',3978)}
            onChange={(value) => updateProperty('map.viewSettings.projection', value)}
            label="Map Projection" placeholder="" />
        </FormGroup>
      
        <Divider sx={{ my: 1 }} >Map components</Divider>

        <FormGroup aria-label="Components">
          <FormLabel component="legend">Components</FormLabel>
          <PillsAutoComplete
            defaultValue={ getProperty('components', ['north-arrow', 'overview-map'])}
            onChange={(value) => updateArrayProperty('components', value)}
            options={componentsOptions}
            label="Components Options"
            placeholder=""
          />
        </FormGroup>

        <FormGroup aria-label="Navigation Bar Options">
          <FormLabel component="legend">Navigation Bar</FormLabel>
          <PillsAutoComplete
            onChange={(value) => updateArrayProperty('navBar', value)}
            defaultValue={((getProperty('navBar') !== undefined) && (Array.from(getProperty('navBar')!).length) === 0) ? ['zoom'] : getProperty('navBar', ['zoom', 'home', 'basemap-select', 'fullscreen'])} 
            options = { navBarOptions }
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
            defaultValue={getProperty('appBar.tabs.core',["geolocator"])}
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

      </FormControl>
    </Box>
 
  );
  
}
