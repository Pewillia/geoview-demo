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
import { useContext, useState, useEffect } from 'react';
import { useSnackbar } from '@/providers/snackbarProvider';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash';
import PillsAutoComplete from './PillsAutoComplete';
import { eventLoopCounter,
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
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, handleConfigJsonChange, configFilePath, mapWidth,mapHeight, setMapWidth, setMapHeight } = cgpvContext;
  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(configJson);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isEn, setEn] = useState<boolean>(true);
  const [isMapSizeValid, setMapSizeValid] = useState(true);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (document.getElementById(mapId) !== null) { 
      if (eventLoopCounter.current === 0) { // convert full screen in % to px on reinitialize
        setMapWidth((window.innerWidth - (435 +7)).toString() + "px");
        eventLoopCounter.current = 1;
      }
    };
  }, []);

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

  const getProperty = (property: string, defaultValue = undefined) => {
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
  
  return(
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <FormControl component="fieldset" sx={{ mt: 1, gap: 3 }}>
      
        <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { 
           (isEn) ? cgpv.api.maps[mapId].setLanguage('fr') : cgpv.api.maps[mapId].setLanguage('en');
           setEn(!isEn);
          }}
        label="Change Language" placeholder="" />
       
      <SingleSelectComplete
          options={CONFIG_FILES_LIST}
          defaultValue={configFilePath}
          applyGrouping={true}
          onChange={(value) => handleConfigFileChange(value)}
          label="Select Configuration File" placeholder="" />
        
      </FormControl>

      <FormGroup aria-label="position">
          <FormLabel component="legend"sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 3 }}>&nbsp;&nbsp;&nbsp;Map Size in px</FormLabel>

          <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 4 }}>
            <FormControl>
            <TextField
                style={{ maxWidth: '120px', maxHeight: '30px', minWidth: '120px', minHeight: '30px' }}
      
                error={!isMapSizeValid}
                size="small"
                id="map-width"
                label="Width"
                defaultValue={mapWidth.substring(0, mapWidth.length - 2)}  
                onChange={(event) => {
                  // setMapSizeValid(true);
                   if (event.target.value.match(/^\d+$/)) {
                     setMapSizeValid(true);
                     setMapWidth(event.target.value + "px");
                   }
                   else {
                      setMapSizeValid(false);
                  }
                   setIsModified(true);
                  }
                } 
            />
            </FormControl>
          <FormControl>
            
            <TextField
                style={{ maxWidth: '120px', maxHeight: '30px', minWidth: '90px', minHeight: '30px' }}
      
                error={!isMapSizeValid}
                size="small"
                id="map-height"
                label="Height"
                defaultValue={mapHeight.substring(0, mapHeight.length - 2)}
                onChange={(event) => {
                   if (event.target.value.match(/^\d+$/)) {         
                     setMapSizeValid(true);
                     setMapHeight(event.target.value + "px");
                   }
                   else {
                     setMapSizeValid(false);
                   }
                    setIsModified(true);
                  }
                }
             />
                </FormControl>
          <FormControl>
          <Button 
           style={{ maxWidth: '30px', maxHeight: '40px', minWidth: '100px', minHeight: '40px' }}
           onClick={(event) => {
              (isMapSizeValid )? handleApplyStateToConfigFile() : enqueueSnackbar('Map size is invalid');
        }
          }

        variant="contained" color="primary" size="small">
        apply size
        </Button>  
            </FormControl>
        </Box>
            
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <ConfigSaveUploadButtons />

      <Divider sx={{ my: 2 }} />
      
      <Button onClick={handleApplyConfigChanges}
        disabled={!isModified}
        variant="contained" color="primary" size="small">
        Apply Config Changes
      </Button>

      <Divider sx={{ my: 2 }} />
      
      <Button variant="contained" color="primary" size="small" onClick={handleApplyStateToConfigFile}>
        Apply State to Config File
      </Button>

      <FormControl component="fieldset" sx={{ mt: 4, gap: 3 }}>

       

      

       
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
          options={basemapOptions}
          defaultValue={getProperty('map.basemapOptions.basemapId')}
          onChange={(value) => updateProperty('map.basemapOptions.basemapId', value)}
          label="Base Map" placeholder="" />
        
        <SingleSelectComplete
          options={basemapShading}
          defaultValue={Boolean(getProperty('map.basemapOptions.shaded')) ? 'true':'false' }
          onChange={(value) => {
            updateProperty('map.basemapOptions.shaded', JSON.parse(value)); 
          }}
          label="Base Map Shaded" placeholder="" />
        
         <SingleSelectComplete
          options={basemapLabelling}
          defaultValue={Boolean(getProperty('map.basemapOptions.labeled')) ? 'true':'false' }
          onChange={(value) => updateProperty('map.basemapOptions.labeled', JSON.parse(value))}
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
            defaultValue={((getProperty('navBar') !== undefined) && (Array.from(getProperty('navBar')!).length) === 0) ? ['zoom'] : ['zoom', 'home', 'basemap-select', 'fullscreen']} 
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

      </FormControl>
    </Box>
 
  );
  
}