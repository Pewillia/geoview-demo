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
  Tooltip,
  List, ListItem,
  Stack
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useContext, useState, useReducer, useRef,useEffect, 
} from 'react';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash';
import PillsAutoComplete from './PillsAutoComplete';
import {aoiModified,eventLoopCounter,SwiperPackageOrientation,SwiperPackagekeyboardOffset,layerOptions,
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions, appBarOptions, mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST,
  corePackagesOptions,aoiDisplay,swiperDisplay, GEOVIEW_CORE_URL
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';
import { useSnackbar } from '@/providers/snackbarProvider';
import { transformExtent } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

export var URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/demos/`;

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
  const [isMapSizeValid, setMapSizeValid] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const displayGeocoreFileid = useRef(0);
  const [geocoreFileSelected, SetGeocoreFileSelected] = useState<boolean>(true); //toogle geocore file button
  const [geocoreId, setGecoreId] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAoiDisabled, setAoiIsDisabled] = useState(false);
  const [aoiChecked, setAoiChecked] = useState(false);
  const [swiperChecked, setSwiperChecked] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const displayLayers = useRef(0); 

   interface AoiFuncItem {
    id: number;
    title: string;
    url: string;
    extent: string;
    isChecked: boolean;
  }

  const aoiFuncs: AoiFuncItem[] = []
  const [aoiRecord, setAoiRecord] = useState(aoiFuncs);
  const [extentValue, setExtentValue] = useState('');
  const [extentError, setExtentError] = useState(false);
  const [aoiRecordIndex, setAoiRecordIndex] = useState(0);
  const [itemColor, setItemColor] = useState('#1976d2');

  useEffect(() => {
    if (document.getElementById(mapId) !== null) { 
      if (eventLoopCounter.current === 0) { // convert full screen in % to px on reinitialize
        setMapWidth((window.innerWidth - (435 +7)).toString() + "px");
        eventLoopCounter.current = 1;
      }
    };
  }, []);

  const handleChangeAoi = () => {
    setAoiChecked((prev) => !prev);
  };

  const handleChangeSwiper = () => {
    setSwiperChecked((prev) => !prev);
  };

  const _updateConfigProperty = (property: string, value: any) => {
    const newConfig = {...modifiedConfigJson};
    if (value === undefined) {
      _.unset(newConfig, property);
    } else {
      _.set(newConfig, property, value);
    }
    setModifiedConfigJson(newConfig);
    setIsModified(true);
  }

  // creates layer list from viewer files loaded
  const createLayerList = () => {
    if (cgpv.api.hasMapViewer(mapId)) {
      const myMap1 = cgpv.api.getMapViewer(mapId);
      const featureInfoLayerSet = myMap1.layer.featureInfoLayerSet.layerApi.legendsLayerSet.resultSet;
      let m = []; let i3 = 0;
      while (layerOptions.length > 0) {
        layerOptions.pop();
      }
      for (var i in featureInfoLayerSet) {
        m.push({ title: '', value: '', group: "" });
        if (featureInfoLayerSet.hasOwnProperty(i)) {
            m[i3].value = featureInfoLayerSet[i].layerPath;
            m[i3].title = featureInfoLayerSet[i].layerName;
            m[i3].group = "n";
            layerOptions.push(m[i3]);
            i3++;
         }
      }
    }
    forceUpdate;
  }

  const getProperty = (property: string, defaultValue = undefined) => {
    if (property === "corePackages") {
      let packages: any = _.get(configJson, property);
      for (var i in packages) {
        if (packages[i] === "swiper") {
          setTimeout(createLayerList, 5000);
          if (displayLayers.current === 0) {  // first time thru on reload
            displayLayers.current = 1;
            swiperDisplay.current = 1;
            setSwiperChecked(true);
          };
        };
      };
    };

    if (property === "appBar.tabs.core") {
      let packages: any = _.get(configJson, property);     
      for (var i in packages) { 

         if (packages[i] === "aoi-panel") {
           if ((displayLayers.current === 0)) { //works displays aoi list when ony swiper in a file   
            displayLayers.current = 1; //0 if loading from a file on iniial load
            aoiDisplay.current = 2;
            setAoiChecked(true); 
           }
           if (aoiModified.current === 0) { // like useRef, not modified if reloads  
             while (aoiFuncs.length > 0) {
              aoiFuncs.pop();
            }
            let i3 = 0;

            let maxlayerId: any = _.get(configJson, "corePackagesConfig[0].aoi-panel.aoiList");
           
            if (typeof maxlayerId !== "undefined") {

              let maxindex: any = maxlayerId.length;
              for (let i = 0; i < maxindex; i++) {

                let imageUrl = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].imageUrl';
                let title = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].aoiTitle';
                let extent = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].extent';

                let aoiImageUrl = (_.get(configJson, imageUrl));
                let aoiTitle = (_.get(configJson, title));
                let aoiExtent = (_.get(configJson, extent));

                aoiFuncs.push({ id: 0, title: '', url: "", extent: "", isChecked: false }); // added april 7 increse array
                aoiFuncs[i3].id = i3;       
                aoiFuncs[i3].title = aoiTitle;
                aoiFuncs[i3].url = aoiImageUrl;
                aoiFuncs[i3].extent = aoiExtent;
                aoiFuncs[i3].isChecked = false;
                i3++;
              } //for loop
            } // index is not  undefined       
          } //aoimodified
        };
      }; 
    };

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

  const loadGeocoreMap = (GeocoreId: string) => {
    let geocoreFound = false;
    let geocoreLayerName = "";
    const myMap1 = cgpv.api.getMapViewer(mapId);
    const featureInfoLayerSet = myMap1.layer.mapViewer.layer.featureInfoLayerSet.resultSet;
    for (var i in featureInfoLayerSet) {// test if loaded
      if (featureInfoLayerSet.hasOwnProperty(i)) {
        if (featureInfoLayerSet[i].layerPath.includes(GeocoreId)) {
          geocoreLayerName = featureInfoLayerSet[i].layerName;
          geocoreFound = true;
        }
      }
    }
    geocoreFound ? enqueueSnackbar('Geocore file loaded ' + geocoreLayerName) : enqueueSnackbar('Geocore ID not found ' + GeocoreId);
    displayGeocoreFileid.current = 0;
  }

  const handleApplyConfigChanges = () => {
    handleConfigJsonChange(modifiedConfigJson);
    setIsModified(false);
  }

  const handlePackageChange = (property: string, value: any, reason: any,selectedvalue: any) => {
    if ((selectedvalue === "swiper") && (reason !== "removeOption")) {  
      if (aoiDisplay.current === 2) {
        _.set(modifiedConfigJson, "corePackages", ["aoi-panel", "swiper"]);
      }
      else {
        _.set(modifiedConfigJson, "corePackages", ["swiper"]);
      }
      _.set(modifiedConfigJson, "corePackagesConfig[0].swiper.orientation", "vertical");
      _.set(modifiedConfigJson, "corePackagesConfig[0].swiper.layers", []);
      _.set(modifiedConfigJson, "corePackagesConfig[0].swiper.keyboardOffset", 10);
        setIsModified(true);
    }

    if ((selectedvalue === "swiper") && (reason !== "removeOption"))  {
      _.set(modifiedConfigJson, "corePackages", ["swiper"]);
      handleApplyConfigChanges(); 
    };

    if ((selectedvalue === "aoi-panel") && (reason !== "removeOption")) {   
      _.set(configJson, "corePackages", ["area-of-interest"]);
      _.set(configJson, "appBar.tabs.core[0]", ["aoi-panel"]);
      setIsModified(true);
    };
  }

  const handleChangeChecked = (event: any, id: number) => {
    const newItems = [...aoiRecord];
    aoiRecord[id].isChecked = event.target.checked;
    setAoiRecord(newItems);
    setIsModified(true);
  };

  function handleAdd() {
    const newList = aoiRecord.concat({
      id: aoiRecord.length + 1,
      isChecked: false, title: " undefined ",
      url: "http://  ",
      extent: " "
    });
    setAoiRecord(newList);
    forceUpdate();
    setIsModified(true);
  }

  function handleSave() {
    _.set(modifiedConfigJson, "corePackages", "aoi-panel");
   if (swiperDisplay.current === 1)
      _.set(modifiedConfigJson, "corePackages", ["aoi-panel","swiper"]);
   else
      _.set(modifiedConfigJson, "corePackages", ["aoi-panel"]);

    _.set(modifiedConfigJson, "corePackagesConfig[0].aoi-panel", "corePackagesConfig")
    _.set(modifiedConfigJson, "corePackagesConfig[0].aoi-panel", "aoiList")
    _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.isOpen', true);
    _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.version', "1.0");

    for (let i = 0; i < aoiRecord.length; i++) {
      _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].imageUrl', aoiRecord[i].url);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].aoiTitle', aoiRecord[i].title);

       let extentstring2 = aoiRecord[i].extent;

      if (typeof extentstring2 === "string") { // if edited type string else object
      extentstring2 = aoiRecord[i].extent.replaceAll("[", "").replaceAll("]", "");
      let extentstring3 = extentstring2.split(",").map(Number);
        _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].extent', extentstring3);
      }
      else {
        _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].extent', aoiRecord[i].extent);
      }
    }
    aoiModified.current = 0;
    setIsModified(true);

    if (aoiRecord.length === 0) {  // deleted last record 
      if (swiperDisplay.current === 1)
        _.set(modifiedConfigJson, "corePackages", ["swiper"]);
      else {
        let appbar = getProperty('appBar.tabs.core');
        let newappbar = appbar.filter((item: any) => item !== "aoi-panel");
        _.set(modifiedConfigJson, "appBar.tabs.core", newappbar); 
        _.set(modifiedConfigJson, "corePackages", "");
        aoiDisplay.current = 0;
      }
    }
    handleApplyConfigChanges();
  }

  function handleDelete() {
    let newItems = aoiRecord.filter((item) => item.isChecked !== true);   
    setAoiRecord([...newItems]);
    aoiModified.current = 1;
    forceUpdate();
    setIsModified(true);
  }

  const handleItemChangeTitle = (index: any, event: any) => {
    aoiModified.current = 1; 
    const newItems = [...aoiRecord];
    aoiRecord[index].title = event.target.value;
    setAoiRecord(newItems);
    setIsModified(true);
  };

  const handleItemChangeUrl = (index: any, event: any) => { //verify that image insists
    aoiModified.current = 1; 
    let imageError = false;
    var image = new Image();
    image.src = event.target.value;
    image.onload = function () {
      if (image.width > 0) {
        enqueueSnackbar('URL link exists image,record updated');
        imageError = true;
      }
    }
    image.onerror = function () {
      enqueueSnackbar('URL doesnt link to an image,record not updated');
      imageError = false;
      return;
    }

    if (!imageError) {
      const newItems = [...aoiRecord];
      aoiRecord[index].url = event.target.value;
      setAoiRecord(newItems);
      setIsModified(true);
    }
  };

  const handleItemChangeExtent = (index: number, event: any) => {
    aoiModified.current = 1; 
    setExtentValue(event.target.value);
    setAoiRecordIndex(index);
    aoiRecord[index].extent = event.target.value;  
    setIsModified(true);
  };

  const handleKeyDownExtent = (event: any) => {    // handle validation of extent fron return key
    if (event.key === 'Enter') {
      // Logic to execute when "return" is pressed
      let extendArr = extentValue.split(",");
      if ((extendArr.length === 4)) {
        const newItems = [...aoiRecord];
        //validate extent entered
        if (  extendArr[0].match(/^\s*[+-]?(?:\d+|\d{1,3}})(?:\.\d*)?$/)
          && extendArr[1].match(/^\s*[+-]?(?:\d+|\d{1,3}})(?:\.\d*)?$/)
          && extendArr[2].match(/^\s*[+-]?(?:\d+|\d{1,3}})(?:\.\d*)?$/)
          && extendArr[3].match(/^\s*[+-]?(?:\d+|\d{1,3}})(?:\.\d*)?$/)
        ) {
          setExtentError(false);
          aoiRecord[aoiRecordIndex].extent = extentValue;
          setAoiRecord(newItems);
          setIsModified(true);
          enqueueSnackbar('Extent is valid');
        } else {
          enqueueSnackbar('Extent invalid', { variant: 'error' });
          setExtentError(true);
        }
      }
      else if (extendArr.length < 4) {
        enqueueSnackbar('Extent missign a value');
        setExtentError(true);
      }
    }
  };

  const handleExtent = () => {
    const myMap = cgpv.api.getMapViewer(mapId);

    function initMap1(map : any) {
      // Init extent interactions
      const myMap = cgpv.api.getMapViewer(mapId); 
      const extent1 = myMap.initExtentInteractions();
      extent1.onExtentChanged((sender :any , payload : any) => {
        proj4.defs("EPSG:3978", "+proj=lcc +lat_0=49 +lon_0=-95 +lat_1=49 +lat_2=77 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
        register(proj4);
        proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
        register(proj4);
        const extentInLatLon = transformExtent(myMap.getView().calculateExtent(), "EPSG:3978", "EPSG:4326");
        aoiRecord[aoiRecordIndex].extent=extentInLatLon.toString()
        aoiModified.current = 1;   
        forceUpdate();
      });
    }
    cgpv.init(initMap1(myMap));
  }

  return(
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl component="fieldset" sx={{ mt: 1, gap: 3 }}>
        <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { const myMap = cgpv.api.getMapViewer(mapId);
           (isEn) ? myMap.setLanguage('fr', true) : myMap.setLanguage('en', true);
           setEn(!isEn);
          }}
        label="Change Language" placeholder="" />
      <SingleSelectComplete
          options={CONFIG_FILES_LIST}
          defaultValue={configFilePath}
          applyGrouping={true}
          onChange={(value) => {
             URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/demos/`
             for (let i = 0; i < CONFIG_FILES_LIST.length; i++) {
                if ((value === CONFIG_FILES_LIST[i].value) && ((CONFIG_FILES_LIST[i].group === 'Layer Types') || (CONFIG_FILES_LIST[i].group === 'Geocore')))
                   URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/layers/`;
              }
              handleConfigFileChange(value); }}
          label="Select Configuration File" placeholder="" />
      </FormControl>

      <FormGroup aria-label="position">
          <FormLabel component="legend" sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 3 }}>&nbsp;&nbsp;&nbsp;Map Size in px</FormLabel>
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
                   if (event.target.value.match(/^\d+$/)) {
                     setMapSizeValid(true);
                     setMapWidth(event.target.value + "px");
                   }
                   else {
                      setMapSizeValid(false);
                   }
                   setIsModified(true);
                  }
                }/>
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
             (isMapSizeValid) ? handleApplyStateToConfigFile() : enqueueSnackbar('Map size is invalid');
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

      <Button id="handleApplyStateToConfigFile" variant="contained" color="primary" size="small" onClick={handleApplyStateToConfigFile}>
        Apply State to Config File
      </Button>

        <Divider sx={{ my: 2 }} >Geocore Layer</Divider>
      <FormGroup aria-label="position">
      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 1}}>
      <FormControl> 
        <TextField
          style={{ maxWidth: '330px', maxHeight: '30px', minWidth: '330px', minHeight: '30px' }}
          error={!isMapSizeValid}
          size="small"
          id="geocore-id"
          label="Enter Geocore ID"
          onChange={(event) => {
            if (event.target.value.match(/[a-zA-Z0-9_-]{36}$/)) {
              SetGeocoreFileSelected(true);
              setGecoreId(event.target.value);
            }
            else {
              enqueueSnackbar("Geocore ID must be 36 characters");
             }
            }
           }
        />
          </FormControl>
          <FormControl>
        <Button variant="contained" color="primary" 
            style={{ maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px' }}
          onClick={(event) => {
            if (geocoreFileSelected){
              const myMap = cgpv.api.getMapViewer(mapId);
              myMap.layer.addGeoviewLayerByGeoCoreUUID(geocoreId);  
              setTimeout(() => loadGeocoreMap(geocoreId), 7000); //wait for file load
             }
          }} >
          ADD
            </Button>
          </FormControl>
          
        </Box>
        </FormGroup>

      <Divider sx={{ my: 2 }} >Map Configuration</Divider>

      <FormControl component="fieldset" sx={{ mt: 1, gap: 1 }}>

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
            placeholder=""/>
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
              onChange={(event) => handleSwitchChange(event, 'footerBar')}/>
          </FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('footerBar.tabs.core')}
            onChange={(value) => {
              updateArrayProperty('footerBar.tabs.core', value);            
             }
            }
            options={footerTabslist} label="Footer Options" placeholder="" />
        </FormGroup>

        <FormGroup aria-label="Appbar">
          <FormLabel component="legend">
            App Bar
            <Switch size="small" checked={isPropertyEnabled('appBar.tabs.core')}
              onChange={(event) => handleSwitchChange(event, 'appBar')}/>
          </FormLabel>
          <PillsAutoComplete
            defaultValue={getProperty('appBar.tabs.core')}
            onChange={(value: any, reason: any, selectedvalue: any) => {
            updateArrayProperty('appBar.tabs.core', value);
              if ((value.find((element: any) => element === "aoi-panel")) && (reason == "selectOption")) {
                displayLayers.current = 2;
                aoiDisplay.current = 2;
                setAoiChecked(true);
                setAoiIsDisabled(false);
              }
              else if ((selectedvalue === "aoi-panel") && (reason == "removeOption")) {
                displayLayers.current = 0;
                aoiDisplay.current = 0;
                aoiModified.current = 0;
                setAoiChecked(false);
                setAoiIsDisabled(true);
                forceUpdate;
                }
              }
            }
            options={appBarOptions} label="App-bar Options" placeholder="" />
        </FormGroup>

        <Divider sx={{ my: 2 }} >Packages</Divider>

        <FormGroup aria-label="Core Packages Options">
          <FormLabel component="legend">Core Packages</FormLabel>
          <PillsAutoComplete

            defaultValue={getProperty('corePackages')}
            onChange={(value: any, reason: any, selectedvalue: any) => {
              updateArrayProperty('corePackages', value);
              if ((selectedvalue === "swiper") && (reason == "selectOption")) {
                setIsModified(true);
                displayLayers.current = 1;
                swiperDisplay.current = 1;
                setSwiperChecked(true);
                createLayerList();
                handlePackageChange('corePackages', value, reason, selectedvalue);
              }
              else if((selectedvalue === "swiper") && (reason == "removeOption"))
              {
                //have to set color of swiper label or stays displayed even though disabled,unchecked
                setItemColor('white');
                displayLayers.current = 0;
                swiperDisplay.current = 0;
                _.set(configJson, "corePackages", []);
                setSwiperChecked(false); 
                setIsDisabled(true);
                if (aoiDisplay.current === 2) {
                  _.set(modifiedConfigJson, "corePackages", ["aoi-panel"]);
                }
                else {
                  _.set(modifiedConfigJson, "corePackages", []);
                }
                handleApplyConfigChanges();
              }
              setIsModified(true);
            }}
            options={corePackagesOptions}
            label="CorePackages Options" placeholder="" />

        </FormGroup>

       <FormGroup aria-label="Layer List"  >

          {swiperDisplay.current === 1 ?
            <label style={{ color: itemColor ,justifyContent: 'left',
              alignItems: 'left',}}>
            Swiper Config
            </label>
            : ''}

           {swiperDisplay.current === 1 ?
            <FormControlLabel id="swiper" sx={{
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              }}

              label=""
              disabled={isDisabled}
              control={<Switch checked={swiperChecked} onChange={handleChangeSwiper}
              sx={{
                      "& .MuiInputBase-root.Mui-disabled": {
                    },
                      "& .MuiFormLabel-root.Mui-disabled": {
                        color: "rgba(0, 0, 0,0.0)"
                    },
                      "&.Mui-disabled": {
                    },
                      '& .MuiFormControlLabel-label': {
                        color: itemColor,
                    },
                      '& .css-1nweas-MuiFormControlLabel-root.MuiFormControlLabel-label.Mui-disabled': {
                        color: 'rgba(0,0,0,0)',
                    },
                      '& .MuiFormControlLabel-root': {
                        color: itemColor,
                    },          
                      "&.MuiSwitch-root .MuiSwitch-switchBase": {
                    },
                      "& .MuiSwitch-thumb": {
                        color: itemColor
                    },
                      "& .MuiSwitch-track": {  // if dont sepecify is grey
                         backgroundColor: "white",// works is white when collapse
                    },
                  }}

                />}
               labelPlacement="start"/>
          : ''}

          <Collapse in={swiperChecked}>

            <SingleSelectComplete
              options={SwiperPackageOrientation}
              defaultValue={getProperty('corePackagesConfig[0].swiper.orientation')}
              onChange={(value) => {
                updateProperty('corePackagesConfig[0].swiper.orientation', value);
                _.set(configJson, "corePackagesConfig[0].swiper.orientation", value);
                handleApplyConfigChanges();
                }
              }
              label="Swiper Orientation" placeholder="" />

            <Divider sx={{ my: 2 }} />

            <SingleSelectComplete
              options={SwiperPackagekeyboardOffset}
              defaultValue={getProperty('corePackagesConfig[0].swiper.keyboardOffset')}
              onChange={(value) => {
                updateProperty('corePackagesConfig[0].swiper.keyboardOffset', value);
                _.set(configJson, "corePackagesConfig[0].swiper.keyboardOffset", value);
                handleApplyConfigChanges();
                }
              }
              label="Swiper Keyboard Offset" placeholder="" />

              <Divider sx={{ my: 2 }} />

              <PillsAutoComplete
                options={layerOptions}
                defaultValue={getProperty('corePackagesConfig[0].swiper.layers')}
                onChange={( value: any, reason: any,value2) => {
                  updateProperty('corePackagesConfig[0].swiper.layers', value);
                  if (reason === "selectOption") {
                    const myMap = cgpv.api.getMapViewer(mapId);
                    value.forEach((i : any) => myMap.plugins['swiper'].activateForLayer(i));              
                    updateArrayProperty('corePackagesConfig[0].swiper.layers', value);
                    setIsModified(true);
                    }
                  else if (reason === "removeOption") {
                    const myMap = cgpv.api.getMapViewer(mapId);
                    myMap.plugins['swiper'].deActivateForLayer(value2);
                    updateArrayProperty('corePackagesConfig[0].swiper.layers', value);
                  }
                }}
              label="Swiper Layer List" placeholder="" />

            </Collapse>
        </FormGroup>
        <FormGroup aria-label="Layer List"  >
        {aoiDisplay.current === 2 ? 
          <label style={{ color: itemColor ,justifyContent: 'left',
              alignItems: 'left',}}>
            Aoi Config
            </label>
            : ''}
         {aoiDisplay.current === 2 ? 

            <FormControlLabel  sx={{
              justifyContent: 'flex-end', color: itemColor,
              alignItems: 'baseline'
             }}
              label=""
              control={<Switch checked={aoiChecked} onChange={handleChangeAoi}
              disabled={isAoiDisabled}
              sx={{
                      "& .MuiInputBase-root.Mui-disabled": {
                    },
                      "& .MuiFormLabel-root.Mui-disabled": {
                        color: "rgba(0, 0, 0,0.0)"
                    },
                      "&.Mui-disabled": {
                    },
                      '& .MuiFormControlLabel-label': {
                        color: itemColor,
                    },
                      '& .css-1nweas-MuiFormControlLabel-root.MuiFormControlLabel-label.Mui-disabled': {
                        color: 'rgba(0,0,0,0)',
                    },
                      '& .MuiFormControlLabel-root': {
                        color: itemColor,
                    },
                      "&.MuiSwitch-root .MuiSwitch-switchBase": {
                    },
                      "& .MuiSwitch-thumb": {
                        color: itemColor
                    },
                      "& .MuiSwitch-track": {  // if dont sepecify is grey
                        backgroundColor: "white",// works is white when collapse
                    },
                  }}/> 
              }
              labelPlacement="start"/>
            : ''}

          <Collapse in={aoiChecked}>

            <Button onClick={handleAdd} 
              variant="contained" color="primary" size="small">
            Add
            </Button>

            <Tooltip title="Select item(s) using item checkbox">
              <Button onClick={handleDelete}
                variant="contained"
                color="primary"
                size="small">
                Delete
              </Button>
            </Tooltip>

            <Button onClick={handleSave}
              variant="contained" color="primary" size="small">
               Save
            </Button>
            <Tooltip title="zoom to location,press shift and hold, mouse cick to draw extent">
              <Button onClick={handleExtent}
               variant="contained"
               color="primary"
              size="small">
                Create extent
              </Button>
              </Tooltip>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: "1px solid #e1e1e1",
                overflow: 'auto', '&::-webkit-scrollbar': { width : 50 }
             }}>

              <Stack direction={{ xs: 'column', sm: 'column' }} spacing={3}>

                <List style={{ display: "flex", flexWrap: "wrap", flexDirection: "column",
                               borderCollapse: 'collapse'
                  }}>

                  {aoiRecord.map((item,index) => (

                     <ListItem key={index} style={{ display: 'flex', flexDirection: 'column',
                       border: '1px solid black', borderStyle: 'solid'
                      }}>

                       <input style={{ display: 'flex'  }}
                          type="checkbox"
                          className="form-check-input"
                          onChange = {(event)  => handleChangeChecked(event, index)}/>

                       <TextField style={{ display: 'flex', flexDirection: 'column',
                         borderStyle: 'solid',maxWidth: '30px', maxHeight: '40px', minWidth: '390px', minHeight: '40px' 
                         }}
                         label="Title"
                         value={item.title}
                         onChange={(event) => handleItemChangeTitle(index, event)} />

                       <Divider sx={{ my: 2 }}/>

                       <TextField style={{ display: 'flex', flexDirection: 'column', maxHeight: '40px',
                         minWidth: '390px', minHeight: '40px', borderStyle: 'solid'
                         }}
                         label="Url"
                         value={item.url}
                         onChange={(event) => handleItemChangeUrl(index, event)} />

                       <Divider sx={{ my: 2 }} />

                       <TextField style={{display: 'flex', flexDirection: 'column',maxHeight:'40px', minWidth: '390px', minHeight: '40px',
                         borderStyle: 'solid'
                         }}
                         label="Extent format [xmin, ymin, xmax, y max]"
                         value={item.extent}
                         error={extentError}
                         onKeyDown={handleKeyDownExtent}  // called when return key is pressed
                         onChange={(event) => handleItemChangeExtent(index, event)}/>

                       <br></br>
                     </ListItem>

                     ))}
                </List>
              </Stack>
            </Box>

          <Divider sx={{ my: 2 }} />

          </Collapse>

          </FormGroup>

      </FormControl>
    </Box>
  );
}