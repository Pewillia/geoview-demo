/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Button, Divider, FormControl, FormGroup, FormLabel, Switch, Tabs, Tab,TextField,Tooltip, List, ListItem, ListItemText, Stack } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useContext, useState, useReducer, useRef,useEffect, useCallback} from 'react';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash'; 
import PillsAutoComplete from './PillsAutoComplete';
import {aoiModified,
  SwiperPackageOrientation,SwiperPackagekeyboardOffset,layerOptions,panelSize,currentTab,appBarOptions2,
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions, appBarOptions, mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST,
 aoiDisplay,swiperDisplay, GEOVIEW_CORE_URL, Language,footerTabsList2, navBarOptions2, corePackagesOptions,DrawerPackageActiveGeometry,DrawerPackageGeometryTypes,
  drawerModified,drawerDisplay,drawerHideMeasurements,DrawerPackageVersion,colorClickedOutside,colorClickedOutside2
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';
import { useSnackbar } from '@/providers/snackbarProvider';
import React from 'react';
import { HexColorPicker } from "react-colorful";
import {Palette} from '@mui/icons-material';

export var URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/demos/`;

export function MapBuilder() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const { mapId } = cgpvContext;
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, 
    handleConfigJsonChange, configFilePath, mapWidth, mapHeight, setMapWidth, setMapHeight } = cgpvContext;
  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(structuredClone(configJson)); //changes reflected in configJson if no clone
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isEn, setEn] = useState<boolean>(Language.english);
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
  const [drawerChecked, setDrawerChecked] = useState(false);
  const drawerFuncs: drawerFuncItem[] = [];
  const [color, setColor] = useState("#aabbcc");
  const [ displayColorPicker1,setDisplayColorPicker1] = useState(false);
  const [ displayColorPicker2,setDisplayColorPicker2] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState(drawerFuncs);
  const popover = useRef<HTMLDivElement>(null);
  const popover5 = useRef<HTMLDivElement | null>(null);
  const [isOpen, toggle] = useState(true);
  const [isOpen2, toggle2] = useState(true);
  const close = useCallback(() => toggle(false), []);
  const close2 = useCallback(() => toggle2(false), []);
  const [fillColorError, setFillColorError] = useState(false);
  const [strokeColorError, setStrokeColorError] = useState(false);
  const [strokeWidthError, setStrokeWidthError] = useState(false);
  const [tabValue, setTabValue] = React.useState(0); //tab value
  const aoiFuncs: AoiFuncItem[] = [];
  const [aoiRecord, setAoiRecord] = useState(aoiFuncs);
  const [extentValue, setExtentValue] = useState('');
  const [extentError, setExtentError] = useState(false);
  const [aoiRecordIndex, setAoiRecordIndex] = useState(-1);
  const [itemColor, setItemColor] = useState('#1976d2');
  const mapWidth1= useRef<HTMLTextAreaElement>(null);
  const refAppply= useRef<HTMLButtonElement>(null);
  const { legendLayerStatusList } = cgpvContext;
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);

  interface AoiFuncItem {
    id: number;
    title: string;
    url: string;
    extent: string;
    isChecked: boolean;
  }

  interface drawerFuncItem {
    fillColor: string;
    strokeColor: string;
    strokeWidth: string;
    activeGeometry: string;
    geomTypes: string[];
    hideMeasurements :boolean;
    version: string;
  }

  useEffect(() => {
    setTabValue(currentTab.current);  // set tab value to last tab used in case of a save state reinitializatio
  }, []);

  useEffect(() => {
    if (swiperDisplay.current === 1) {
       setSwiperChecked(true);
       forceUpdate();
    }
  }, [swiperDisplay.current]);

  useEffect(() => {
     if (aoiDisplay.current === 2) {
      setAoiChecked(true); 
      forceUpdate();
     }
  }, [aoiDisplay.current]);

  useEffect(() => {
     if (drawerDisplay.current === 1) {
       setDrawerChecked(true); 
       forceUpdate();
     }
  }, [drawerDisplay.current]);

  useEffect(() => {
    if (cgpv.api.hasMapViewer(mapId)) {
      const myMap1 = cgpv.api.getMapViewer(mapId); //added jan 9 sue to non displau
      (Language.english ) ? myMap1.setLanguage('en', true) : myMap1.setLanguage('fr', true);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', function(event) {
      // Do nothing if `mousedown` or `touchstart`
    const myElement = document.getElementById('popover2');
    if (myElement || (myElement !== null)){
      const inputElement = event.target as HTMLInputElement;
      if ((!myElement!.contains(inputElement)) ) {
        if (colorClickedOutside.current) {
          myElement!.style.display = 'none';
          colorClickedOutside.current=false;
        }
      }
      else {
      colorClickedOutside.current=true;
      }
    }
    });
  }, [popover, close]);

  useEffect(() => {
    document.addEventListener('click', function(event) {
    // Do nothing if `mousedown` or `touchstart` started inside ref element
    const myElement2 = document.getElementById('popover3');
    if ( myElement2 || ( myElement2 !== null ) ){
      const inputElement2 = event.target as HTMLInputElement;
      if (( !myElement2!.contains(inputElement2) ) ) {
        if ( colorClickedOutside2.current ) { 
          myElement2!.style.display = 'none';
          colorClickedOutside2.current=false;
        }
       }
      else {
        colorClickedOutside2.current=true;
      }
    }
   });
  }, [popover5, close2]);

  const handleChangeDrawer = () => {
    setDrawerChecked((prev) => !prev);
  };

  const setFillColor= (color: string) => {
    displayLayers.current = 1;
    drawerModified.current = 1;
    inputRef3.current!.value = color;
    drawerRecord[0].fillColor = color;
    _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.fillColor', color);
    setIsModified(true);
  }

  const setStrokeColor= (color: string) => { 
    displayLayers.current = 1;
    drawerModified.current = 1;
    inputRef4.current!.value= color;
    drawerRecord[0].strokeColor = color;
    _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeColor', color);   
    setIsModified(true);
  }

  const handleChangeAoi = () => {  setAoiRecord(aoiFuncs);
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
          const LayerPathSet = myMap1.layer.getLayerEntryConfig(featureInfoLayerSet[i].layerPath);
          m[i3].value = featureInfoLayerSet[i].layerPath;
          m[i3].title = LayerPathSet.layerEntryProps.geoviewLayerConfig.geoviewLayerName+"/"+featureInfoLayerSet[i].layerPath; 
          layerOptions.push(m[i3]);
          i3++;
         }
      }
    }
    forceUpdate;
  }

  const getProperty = (property: string, defaultValue = undefined) => {
      if (property === "navBar") {
      let packages: any = _.get(configJson, property);
      for (var i in packages) {
         if (packages[i] === "drawer") {
          if (displayLayers.current === 0) {  // first time thru on reload
            drawerDisplay.current = 1; 
            drawerModified.current = 0;
          }
          if (drawerModified.current === 0) { // like useRef, not modified if reloads  
            while (drawerRecord.length > 0) {
              drawerRecord.pop();
            }
            let fillColor = 'corePackagesConfig[0].drawer.style.fillColor';
            let strokeColor = 'corePackagesConfig[0].drawer.style.strokeColor';
            let strokeWidth = 'corePackagesConfig[0].drawer.style.strokeWidth';
            let activeGeometry= 'corePackagesConfig[0].drawer.activeGeometry'
            let geomTypes= 'corePackagesConfig[0].drawer.geomTypes';
            let hideMeasurements = 'corePackagesConfig[0].drawer.hideMeasurements';
            let version = 'corePackagesConfig[0].drawer.version';
            drawerRecord.push({version:"", fillColor: "", strokeColor: '', strokeWidth: "", activeGeometry: "",geomTypes:[],hideMeasurements: false });
            drawerRecord[0].version = (_.get(configJson, version));
            drawerRecord[0].fillColor = (_.get(configJson, fillColor));
            drawerRecord[0].strokeColor = (_.get(configJson, strokeColor));
            drawerRecord[0].strokeWidth = (_.get(configJson, strokeWidth));
            drawerRecord[0].activeGeometry= (_.get(configJson, activeGeometry));
            drawerRecord[0].geomTypes =(_.get(configJson, geomTypes));
            drawerRecord[0].hideMeasurements = (_.get(configJson, hideMeasurements));
            drawerRecord[0].version = (_.get(configJson, version));
          };
       };
      };
    }; 

     if (property === "corePackages") 
      { let packages: any = _.get(configJson, property);
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
    if (property === "corePackages") {
      let packages: any = _.get(configJson, property);
      for (var i in packages) {
        if (packages[i] === "swiper") {
          displayLayers.current = 1;
          swiperDisplay.current = 1;
          setTimeout(createLayerList, 5000);
        };
      };
    };
   if (property === "appBar.tabs.core") { //changed works with corePackages
      let packages: any = _.get(configJson, property);
      for (var i in packages) {
         if (packages[i] === "aoi-panel") {
           let maxlayerId: any = _.get(configJson, "corePackagesConfig[0].aoi-panel.aoiList");
           if ((displayLayers.current === 0)) { //works displays aoi list when ony swiper in a file   
             displayLayers.current = 1; //0 if loading from a file on iniial load
             aoiDisplay.current = 2;
             setAoiRecordIndex(maxlayerId.length-1);
           }
           if (aoiModified.current === 0) { // like useRef, not modified if reloads  
             while (aoiRecord.length > 0) {
               aoiRecord.pop();
            }
            let i3 = 0;
            if (typeof maxlayerId !== "undefined") {
              let maxindex: any = maxlayerId.length;
              for (let i = 0; i < maxindex; i++) {
                let imageUrl = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].imageUrl';
                let title = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].aoiTitle';
                let extent = 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].extent';
                let aoiImageUrl = (_.get(configJson, imageUrl));
                let aoiTitle = (_.get(configJson, title));
                let aoiExtent = (_.get(configJson, extent));
                aoiRecord.push({ id: 0, title: '', url: "", extent: "", isChecked: false }); // added april 7 increse array
                aoiRecord[i3].id = i3;
                aoiRecord[i3].title = aoiTitle;
                aoiRecord[i3].url = aoiImageUrl;
                aoiRecord[i3].extent = aoiExtent;
                aoiRecord[i3].isChecked = false;
                i3++;
              } //for loop
            } // index is not  undefined    
          } //aoimodified
        };
      };
    };
    return _.get(modifiedConfigJson, property) ?? defaultValue;  //cchanged to modfiiedConfigJson for persistant change
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

  function handleDrawerSave() {  //hideMeasurement,activeGeom,GeomType set in form by updateProperty that modifies ModifiedCOnfigJson
   _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.fillColor', drawerRecord[0].fillColor);
   _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeColor', drawerRecord[0].strokeColor);
   _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeWidth',Number(drawerRecord[0].strokeWidth));
   drawerModified.current = 0;
   setIsModified(true);
   handleApplyConfigChanges();    
}

  const validateColor = ( color: any) => {
    return( Boolean( color.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
           || color.match(/^rgb\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\)$/)
           || color.match(/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)$/) ) );
 };

  const handleItemChangeFillColor = ( event: any) => {
      displayLayers.current = 1;
      drawerModified.current = 1;
      setFillColorError(true);
      if ((event.target.value.length > 4)) {
        if ( validateColor(event.target.value))
          {  setFillColorError(false);
             drawerRecord[0].fillColor = event.target.value;
             _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.fillColor', drawerRecord[0].fillColor);
             setIsModified(true);
             setIsModified(true);
             enqueueSnackbar('color is valid');
            };
           } else {
             enqueueSnackbar('color invalid', { variant: 'error' });
           }
  const newItems = [...drawerRecord];
    drawerRecord[0].fillColor = event.target.value;
    setDrawerRecord(newItems);
    setIsModified(true);
  };

  const handleItemChangeStrokeColor = ( event: any) => {
    displayLayers.current = 1;
    drawerModified.current = 1;
    setStrokeColorError(true);
    if ((event.target.value.length > 4)) {
      if (validateColor(event.target.value ))
        {  setStrokeColorError(false);
           drawerRecord[0].strokeColor = event.target.value;
           _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeColor', drawerRecord[0].strokeColor);
           setIsModified(true);
           setIsModified(true);
           enqueueSnackbar('color is valid');
        };
    } 
    else {
      enqueueSnackbar('color invalid', { variant: 'error' });
    }
    const newItems = [...drawerRecord];
    drawerRecord[0].strokeColor = event.target.value;
    setDrawerRecord(newItems);
    setIsModified(true);
  };

   const handleItemChangeStrokeWidth = (index:number, event: any) => {
    setStrokeWidthError(true);
    displayLayers.current = 1;
    drawerModified.current = 1;
    if (event.target.value.match(/^\d+(\.\d+)?$/))
      {  setStrokeWidthError(false);
         drawerRecord[0].strokeWidth = event.target.value;
        _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeWidth',Number(drawerRecord[0].strokeWidth));
        setIsModified(true);
        enqueueSnackbar('width is valid');
     }
     else {
        enqueueSnackbar('width invalid', { variant: 'error' });
    }
    const newItems = [...drawerRecord];
    drawerRecord[index].strokeWidth = event.target.value;
    setDrawerRecord(newItems);
    forceUpdate;
    setIsModified(true);
  };

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
    setAoiRecordIndex(aoiRecordIndex + 1);
  };

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
    let projection = myMap.getProjection();
    projection = projection.code_ as string;
    let webmerc = cgpv.api.utilities.projection.getProjectionFromString("EPSG:3857");
    let lcc = cgpv.api.utilities.projection.getProjectionFromString("EPSG:3978");
    let latlon = cgpv.api.utilities.projection.getProjectionFromString("EPSG:4326");
    let extentInLatLon : any = myMap.getView().getViewStateAndExtent().extent;
    if (projection.includes("EPSG:3857")) 
      extentInLatLon=cgpv.api.utilities.projection.transformExtentFromProj(extentInLatLon,webmerc,latlon);
    else if (projection.includes("EPSG:3978"))
      extentInLatLon=cgpv.api.utilities.projection.transformExtentFromProj(extentInLatLon,lcc,latlon);
    aoiRecord.filter(function(item) { if (item.isChecked === true){
    item.extent=extentInLatLon[0].toFixed(5).toString()+","+extentInLatLon[1].toFixed(5).toString()+","+extentInLatLon[2].toFixed(5).toString()+","+extentInLatLon[3].toFixed(5).toString();
   }});
   aoiModified.current = 1;
   forceUpdate();
  }

  return(
    <Box sx={{ display: 'flex', justifyContent: 'flex-start',flexDirection: 'column' ,overflow: "auto"}}>
      <ConfigSaveUploadButtons  />
      <FormControl component="fieldset" sx={{ mt: 1, gap: 3 ,align:"center"}}>

     <FormGroup aria-label="position">

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

        <Box textAlign='center'>
          <Button onClick={handleApplyConfigChanges}
            style={{ maxWidth: '200px', maxHeight: '30px', minWidth: '200px', minHeight: '30px',
            textAlign: 'center'}}
            disabled={!isModified}
            variant="contained" color="primary" size="small">
            Apply Config Changes
          </Button>
        </Box>
       <Box textAlign='center'>

        <Button id="handleApplyStateToConfigFile" variant="contained" color="primary" size="small" 
         onClick={handleApplyStateToConfigFile}
          style={{ maxWidth: '200px', maxHeight: '30px', minWidth: '200px', minHeight: '30px' ,
           textAlign: 'center' }}>
           Apply State to Config
        </Button>
       </Box>
    </Box>
 </FormGroup>

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

    <Divider sx={{ my: 1,border: 'none' }}> </Divider>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-start',textAlign: 'left'}}>
         <Tabs value={tabValue} onChange={(_event, newValue) => {setTabValue(newValue) ; currentTab.current= newValue;} } >
         <Tab style={{ minWidth: '50px',whiteSpace: 'pre-wrap' , display: 'flex', justifyContent: 'flex-start',textAlign: 'left' }} label=" Map  
 Settings" />
        <Tab  style={{ minWidth: '50px',whiteSpace: 'pre-wrap', display: 'flex', justifyContent: 'flex-start',textAlign: 'left'}} label="Layers" />
        <Tab style={{ minWidth: '50px',whiteSpace: 'pre-wrap' , display: 'flex', justifyContent: 'flex-start',textAlign: 'left'}} label="UI" />
        <Tab style={{  minWidth: '50px',whiteSpace: 'pre-wrap' , display: 'flex', justifyContent: 'flex-start',textAlign: 'left'}} label="Packages" />
        </Tabs>
      </Box>

        {tabValue === 0 && 
        <Box sx={{  mt: 1, gap: 3,borderBottom: 1, borderColor: 'divider' }}  // Map
        >

        <Divider sx={{ my: 2,border: 'none' }}> Initial View</Divider>

        <FormGroup aria-label="position">
          <FormLabel component="legend">Map Zoom Levels</FormLabel>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.minZoom')}
                onChange={(value) => updateProperty('map.viewSettings.minZoom', value)}
                label="Min Zoom" placeholder="" />
            </FormControl>

            <Divider sx={{ my: 4,border: 'none'  }} ></Divider>

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

      <Divider sx={{ my: 2,border: 'none'  }} >  BaseMap  </Divider>

      <Box sx={{ display: 'flex', flexDirection: 'column' ,overflow: "auto"}}>

      <FormControl component="fieldset" sx={{ mt: 1, gap: 2 }}>
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
          onChange={(value) => updateProperty('map.basemapOptions.shaded', JSON.parse(value))}
          label="Base Map Shaded" placeholder="" />

         <SingleSelectComplete
          options={basemapLabelling}
          defaultValue={Boolean(getProperty('map.basemapOptions.labeled')) ? 'true':'false' }
          onChange={(value) => updateProperty('map.basemapOptions.labeled', JSON.parse(value))}
          label="Base Map Labeled" placeholder="" />

       </FormControl>
        </Box>
      </Box>}

      {tabValue === 1 && <Box sx={{  mt: 1, gap: 3,borderBottom: 1, borderColor: 'divider' }} // Layers
      >
          <Divider sx={{ my: 2,border: 'none'  }} > Add Geocore File </Divider>

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
             <Box sx={{ p: 2 }}>
                 <Divider sx={{ my: 2,border: 'none'  }} >  Layer Status </Divider>

                  {legendLayerStatusList.length === 0 && <p>No layers found</p>}

                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {legendLayerStatusList.map((row, index) => (

                      <ListItem disableGutters disablePadding divider={true} key={`$legend_layer_status_index_${index}`}>
                        <ListItemText primary={row.layerName} secondary={row?.status} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
       </Box>
       }
          {tabValue === 2 && <Box sx={{  mt: 1, gap: 3,borderBottom: 1, borderColor: 'divider' }} // User Interface
          >
          <Divider sx={{ my: 2 }}/>

          <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { const myMap = cgpv.api.getMapViewer(mapId);
           (isEn) ? myMap.setLanguage('fr', true) : myMap.setLanguage('en', true);
           (isEn) ? Language.english = false : Language.english= true;
           setEn(!isEn);
          }}
          label="Change Language" placeholder="" />

           <Divider sx={{ my: 3 ,border: 'none' }}> Map Size in px</Divider>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <TextField inputRef={mapWidth1}
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

          <Button ref={refAppply}
           style={{ maxWidth: '30px', maxHeight: '40px', minWidth: '50px', minHeight: '40px' }}
           onClick={(event) => {
             (isMapSizeValid) ? handleApplyStateToConfigFile() : enqueueSnackbar('Map size is invalid');
           }
          }

        variant="contained" color="primary" size="small">
        Apply
        </Button>

         <Button 
           style={{ maxWidth: '30px', maxHeight: '40px', minWidth: '40px', minHeight: '40px' }}
           onClick={(event) => {
             if ( mapWidth1.current)  {  // update width text field,mapWidth is a hook and is a update delay
               panelSize.current.toString().includes('.') ?
                 mapWidth1.current!.value =(panelSize.current.toString().substring(0, panelSize.current.toString().indexOf('.')))
                 : mapWidth1.current!.value =(panelSize.current.toString()+"px");
             }
              setMapSizeValid(true)
              setMapWidth(mapWidth1.current!.value);
              setIsModified(true);
              setTimeout(() => {refAppply.current!.click()}, 1000);
             }
           }
          variant="contained" color="primary" size="small">
           Fit
         </Button>
         </Stack>

        <FormControl component="fieldset" sx={{ mt: 1, gap: 1 }}>

        <Divider sx={{ my: 2,border: 'none' } }>Map Components</Divider>

        <FormGroup >

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
            defaultValue={(getProperty('navBar') !== undefined) ? getProperty('navBar') : ['home', 'basemap-select', 'fullscreen']}  //removed zoom
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
        </FormControl>

        </Box>}

        {tabValue === 3 && <Box sx={{ p: 3 }}  // Packages
        >
        <Divider sx={{ my: 2 ,border: 'none'}} >Add Core Packages </Divider>
         <FormGroup >

        <FormGroup aria-label="Navigation Bar Options">
          <FormLabel component="legend">Navigation Bar</FormLabel>
          <PillsAutoComplete
            defaultValue={(getProperty('navBar') !== undefined) ? getProperty('navBar') : ['home', 'basemap-select', 'fullscreen']}  //removed zoom
            onChange={(value: any, reason: any, selectedvalue: any) => {
               updateArrayProperty('navBar', value)
                if((selectedvalue === "drawer") && (reason == "selectOption"))
              {
                //have to set color of swiper label or stays displayed even though disabled,unchecked
                setIsModified(true);
                drawerRecord.push({ fillColor: "", strokeColor: '', strokeWidth: "", activeGeometry: "",geomTypes:[],hideMeasurements: false,version:"" });
                displayLayers.current = 1;
                drawerDisplay.current = 1;
                setDrawerChecked(true);
                handlePackageChange('corePackages', value, reason, selectedvalue);
                forceUpdate;
              }
               else if ((selectedvalue === "drawer") && (reason == "removeOption")) {
                displayLayers.current = 0;
                drawerDisplay.current = 0;
                setDrawerChecked(false);
                setItemColor('white'); //erase switch label
                forceUpdate;
                }
              setIsModified(true);
            }}
            options={navBarOptions2}
            label="Options" placeholder="" />
        </FormGroup>

          <Divider sx={{ my: 2 ,border: 'none'}} />

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
                setItemColor('white'); //erase switch label
                setAoiChecked(false);
                setAoiIsDisabled(true);
                forceUpdate;
                }
              }
            }
            options={appBarOptions2} label="App-bar Options" placeholder="" />

        <Divider sx={{ my: 2,border: 'none' }}/>

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
                const myMap = cgpv.api.getMapViewer(mapId);
                 myMap.plugins['swiper'].deActivateAll();
                if (aoiDisplay.current === 2) {
                  _.set(modifiedConfigJson, "corePackages", ["aoi-panel"]);
                }
                else {
                  _.set(modifiedConfigJson, "corePackages", []);
                }
              }
              setIsModified(true);
            }}
            options={corePackagesOptions}
            label="CorePackages Options" placeholder="" />
        </FormGroup>

          <Divider sx={{ my: 2 ,border: 'none'}} />

          <FormGroup aria-label="Footer bar">
          <FormLabel component="legend">
            Footer Bar
            <Switch size="small" checked={isPropertyEnabled('footerBar.tabs.core')}
              onChange={(event) => handleSwitchChange(event, 'footerBar')}/>
          </FormLabel>

          <PillsAutoComplete
            defaultValue={getProperty('footerBar.tabs.core')}
            onChange={(value: any, reason: any, selectedvalue: any) => {
              updateArrayProperty('footerBar.tabs.core', value);
              setIsModified(true);
            }}
            options={footerTabsList2} label="Footer Options" placeholder=""/>

        </FormGroup>
        </FormGroup>
       </FormGroup>

       <FormGroup aria-label="Drawer Package"  >

          {drawerDisplay.current === 1 ?
            <label style={{ color: itemColor ,justifyContent: 'left',
              alignItems: 'left',}}>
              Drawer Config
            </label>
            : ''}

           {drawerDisplay.current === 1 ?
            <FormControlLabel id="swiper" sx={{
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              }}

              label=""
              disabled={isDisabled}
              control={<Switch checked={drawerChecked} onChange={handleChangeDrawer}
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
                         backgroundColor: itemColor// works is white when collapse
                    },
                  }}
                />}
               labelPlacement="start"/>
          : ''}

          <Collapse in={drawerChecked}>

            <Divider sx={{ my: 1 ,border:"none"}} /> 

            <Button onClick={(event) => {console.log("in drawer save");handleDrawerSave();}}
              variant="contained" color="primary" size="small">
               Save
            </Button>

            <Divider sx={{ my: 1 ,border:"none"}} /> 

            <Stack  justifyContent="flex-start"  alignItems="flex-start" direction="column"
              sx={{  display: 'flex', flexDirection: 'column', 
              justifyContent: 'flex-start' }}
              spacing={3} >

             <List style={{ flexDirection: "row",
                            borderCollapse: 'collapse',textAlign: 'left',
                            justifyContent: 'flex-start' 
                          }}>

              {drawerRecord.map((item,index) => (

                <ListItem key={index} style={{display: 'flex',flexDirection:'column',justifyContent:'flex-start' }}>

                 <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 2 }}>
                   <FormGroup>
                      <TextField inputRef={inputRef3} sx={{ 
                        display: 'flex', flexDirection: 'column', 
                        justifyContent: 'flex-start', borderStyle: 'solid',
                        maxHeight: '40px',
                        minWidth: '240px',
                        minHeight: '40px'}}
                        label="Fill Color"
                        value={item.fillColor}
                        error={fillColorError}
                       onChange={(event) => {
                        drawerModified.current = 1;
                        displayLayers.current = 1;
                        handleItemChangeFillColor( event);}} />
                   </FormGroup>

                   <FormControl>
                     {isOpen && 
                      <div className="popover" ref={popover} id="popover">
                      <Tooltip title="Color picker">
                      <Button sx={{border:"none" , maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px'}} 
                        variant="contained" startIcon={<Palette fontSize="small" sx={{color: 'orange' }} />}
                         onClick={() =>{
                           const myElement = document.getElementById('popover2');
                           myElement!.style.display = 'block';
                           setDisplayColorPicker1(!displayColorPicker1); }} >
                      </Button> 
                      </Tooltip>
                      </div>
                     }
               </FormControl>
               </Box>
            <Stack   direction="column" justifyContent="flex-start">

               <HexColorPicker id="popover2" color={color}
                 onChange={(color) =>{ drawerModified.current = 1;  // color picker hidder
                   setFillColor(color);
                   setColor(color);
                  }}
                 style={{ display: displayColorPicker1 ?  'flex': 'none'}}/> 

            <Divider sx={{ my: 2 ,border:"none"}} />
            </Stack>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <FormControl>
                 <TextField inputRef={inputRef4} sx={{ display: 'flex',
                        flexDirection: 'column', maxHeight: '40px', justifyContent: 'flex-start',
                        minWidth: '240px',
                        borderStyle: 'solid'}}
                        label="Stroke Color"
                        value={item.strokeColor}
                        error={strokeColorError}
                        onChange={(event) => {
                           displayLayers.current = 1;
                           drawerModified.current = 1;
                           handleItemChangeStrokeColor( event);}} />
                </FormControl>

               <FormControl>
                   {isOpen2 &&
                   <div className="popover" ref={popover5} id="popover4">
                   <Tooltip title="Color picker">
                   <Button sx={{border:"none" , maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px'}} 
                    variant="contained" startIcon={<Palette fontSize="small" sx={{ color: 'orange' }} />}
                    onClick={() => {
                         const myElement = document.getElementById('popover3');
                         myElement!.style.display = 'block';
                         setDisplayColorPicker2(!displayColorPicker2); }}>
                   </Button>
                  </Tooltip>
                   </div>
                 }
               </FormControl>
            </Box>

            <Stack  direction="column" justifyContent="flex-start">
              <HexColorPicker id="popover3"  color={color}
                 onChange={(color) =>{ drawerModified.current = 1;  // color picker hidder
                   setStrokeColor(color);
                   setColor(color);
                  }} 
                 style={{ display: displayColorPicker2 ?  'flex': 'none'}}/> 
              <Divider sx={{ my: 2 ,border:"none"}} /> 
             </Stack>
                <FormControl>
                  <TextField sx={{ display: 'flex', flexDirection: 'column', maxHeight:'40px', minWidth: '300px',minHeight: '40px'}}
                    label="Stroke Width"
                    value={item.strokeWidth}
                    error={strokeWidthError}
                    onChange={(event) => handleItemChangeStrokeWidth(index, event)} />
                 </FormControl>
          <FormControl component="fieldset" sx={{ mt: 1, gap: 1}}>

          <Divider sx={{ my: 1,border:"none"}} /> 
            <FormGroup aria-label="Hide Measurements"
                sx={{  display: 'flex', flexDirection: 'column', maxHeight:'40px', 
                        minWidth: '300px',minHeight: '40px',
                   }}>
              <SingleSelectComplete
                options={drawerHideMeasurements}
                defaultValue={Boolean(getProperty('corePackagesConfig[0].drawer.hideMeasurements')) ? 'true':'false' }
                onChange={(value) => {
                 displayLayers.current = 1;
                 drawerModified.current = 1;
                 updateProperty('corePackagesConfig[0].drawer.hideMeasurements', JSON.parse(value)); 
                 setIsModified(true);
                 }}
                label="Hide Measurements" placeholder="" />
             </FormGroup>
             </FormControl>
          <FormGroup aria-label="" sx={{ display: 'flex', flexDirection: 'column', maxHeight:'40px',  minWidth: '300px', minHeight: '40px'}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

             <FormControl component="fieldset" sx={{ mt: 2, gap: 1}}>
               <FormGroup aria-label="Active Geometry" sx={{display:'flex',flexDirection:'column',maxHeight:'40px'
                                                        ,minWidth:'300px',minHeight:'40px' }}>
                <SingleSelectComplete
                  options={DrawerPackageActiveGeometry}
                  defaultValue={getProperty('corePackagesConfig[0].drawer.activeGeom')}
                  onChange={(value) => {
                    displayLayers.current = 1;
                    drawerModified.current = 1;
                    updateProperty('corePackagesConfig[0].drawer.activeGeom',value);
                    setIsModified(true);
                  }}
                  label="Active Geometry" placeholder="" />
                </FormGroup>
             </FormControl>
            </Box>

          </FormGroup>

          <Divider sx={{ my: 2 ,border:"none"}} />  

          <FormGroup aria-label="Geom Types" sx={{display:'flex',flexDirection: 'column',maxHeight:'40px',minWidth:'300px', minHeight:'40px' }}>
            <PillsAutoComplete
              defaultValue={(getProperty('corePackagesConfig[0].drawer.geomTypes') )} 
              onChange={(value) => {
                displayLayers.current = 1;
                drawerModified.current = 1;
                updateArrayProperty('corePackagesConfig[0].drawer.geomTypes', value); 
                setIsModified(true);}}
              options={ DrawerPackageGeometryTypes}
              label="Geometry Types" placeholder="" />
           </FormGroup>

            <FormGroup aria-label="" sx={{ display: 'flex', flexDirection: 'column', maxHeight:'40px',  minWidth: '300px', minHeight: '40px'}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
             <FormControl component="fieldset" sx={{ mt: 8, gap: 10}}>

               <FormGroup aria-label="Vesrion" sx={{display:'flex',flexDirection:'column',maxHeight:'40px',minWidth:'300px',minHeight:'40px' }}>
                <SingleSelectComplete
                  options={DrawerPackageVersion}
                  defaultValue={getProperty('corePackagesConfig[0].drawer.version')}
                  onChange={(value) => {
                    displayLayers.current = 1;
                    drawerModified.current = 1;
                    updateProperty('corePackagesConfig[0].drawer.version',value);
                    setIsModified(true);
                  }}
                  label="Version" placeholder="" />
                </FormGroup>
             </FormControl>
            </Box>
          </FormGroup>
           <br></br>
          </ListItem>
          ))}
         </List>
       </Stack>
      </Collapse>
    </FormGroup>

       <FormGroup aria-label="Layer List"  >
          <Divider sx={{ my: 3,border:"none"}} />
          {swiperDisplay.current === 1 ?
            <label style={{ color: itemColor ,justifyContent: 'left',
              alignItems: 'left',}}>
            Swiper Config
            </label>
            : ''}
           {swiperDisplay.current === 1 ?

           <Tooltip title="Click to expand/hide Swiper records">
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
                         backgroundColor: itemColor// works is white when collapse
                    },
                      '& .Mui-checked + .MuiSwitch-track': {
                          backgroundColor: itemColor // Example: Orange color when checked
                    }
                  }}
                />}
               labelPlacement="start"/></Tooltip>
          : ''}

          <Collapse in={swiperChecked}>

            <SingleSelectComplete
              options={SwiperPackageOrientation}
              defaultValue={getProperty('corePackagesConfig[0].swiper.orientation')}
              onChange={(value) => {
                updateProperty('corePackagesConfig[0].swiper.orientation', value);
                _.set(configJson, "corePackagesConfig[0].swiper.orientation", value);
                 const myMap = cgpv.api.getMapViewer(mapId);
                 myMap.plugins['swiper'].setOrientation(value); 
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

        <Divider sx={{ my: 2 ,border:"none"}} />

        {aoiDisplay.current === 2 ? 
          <label style={{ color: itemColor ,justifyContent: 'left',
              alignItems: 'left',}} >
            Aoi Config
            </label>
            : ''}

         {aoiDisplay.current === 2 ? 

          <Tooltip title="Click to expand/hide Aoi records">
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
                        backgroundColor: itemColor// works is white when collapse
                    },
                      '& .Mui-checked + .MuiSwitch-track': {
                        backgroundColor: itemColor // Example: Orange color when checked
                    }
                  }}/> 
              }
              labelPlacement="start"/></Tooltip>
            : ''}

          <Collapse in={aoiChecked}>
           <Tooltip title="Click to add Aoi record">
      
            <Button onClick={(event) => {
              handleAdd();
            } }
              variant="contained" color="primary" size="small">
            Add
            </Button>
            </Tooltip>

            <Tooltip title="Select item(s) using item checkbox then click Delete">
              <Button onClick={handleDelete}
                variant="contained"
                color="primary"
                size="small">
                Delete
              </Button>
            </Tooltip>

            <Tooltip title="Click tp Save Aoi records">
              <Button onClick={handleSave}
              variant="contained" color="primary" size="small">
               Save
              </Button>
            </Tooltip>

            <Tooltip title="zoom to location,map window will be extent, click create extent button">
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
        </Box>}
      </Box>
    </FormControl>
   </Box>
  );
}