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
import {Palette} from '@mui/icons-material';
//import IconButton from '@mui/material/IconButton';


import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useContext, useState, useReducer, useRef,useEffect, useCallback
} from 'react';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash';
import PillsAutoComplete from './PillsAutoComplete';
import {aoiModified,eventLoopCounter,SwiperPackageOrientation,SwiperPackagekeyboardOffset,layerOptions,
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions, appBarOptions, mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST,
  corePackagesOptions,aoiDisplay,swiperDisplay, GEOVIEW_CORE_URL, Language,DrawerPackageActiveGeometry,DrawerPackageGeometryTypes,
  DrawerPackageVersion,drawerModified,drawerDisplay,drawerHideMeasurements,fillColor3,strokeWidth3,colorClickedOutside,colorClickedOutside2,strokeColor3
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';
import { useSnackbar } from '@/providers/snackbarProvider';
import { HexColorPicker } from "react-colorful";

export var URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/demos/`;

export function MapBuilder() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const { mapId } = cgpvContext;
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, handleConfigJsonChange, configFilePath, mapWidth, mapHeight, setMapWidth, setMapHeight } = cgpvContext;
  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(structuredClone(configJson));
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
 

   interface drawerFuncItem {
    fillColor: string;
    strokeColor: string;
    strokeWidth: string;
    activeGeometry: string;
    geomTypes: string[];
    hideMeasurements :boolean;
    version: string;
  }

   interface AoiFuncItem {
    id: number;
    title: string;
    url: string;
    extent: string;
    isChecked: boolean;
  }

  const drawerFuncs: drawerFuncItem[] = [];

  //const drawerFuncs: drawerFuncItem[] = [{ fillColor:"1", strokeColor:"",  strokeWidth:"",  activeGeometry:"", geomTypes:[], hideMeasurements:false}]

  /*
  let drawerFuncs: drawerFuncItem[] =[
    drawerFuncs[0].fillColor ="" ,
    drawerFuncs[0].strokeColor= "",
    drawerFuncs[0].strokeWidth= "",
    drawerFuncs[0].activeGeometry= [],
    drawerFuncs[0].geomTypes= [],
    drawerFuncs[0].hideMeasurements =false
  ]
  */
   
  const aoiFuncs: AoiFuncItem[] = []
  const [aoiRecord, setAoiRecord] = useState(aoiFuncs);
  const [extentValue, setExtentValue] = useState('');
  const [extentError, setExtentError] = useState(false);
  const [aoiRecordIndex, setAoiRecordIndex] = useState(-1);
  const [itemColor, setItemColor] = useState('#1976d2');
  const [color, setColor] = useState("#aabbcc");
  const [ displayColorPicker1,setDisplayColorPicker1] = useState(false);
  const [ displayColorPicker2,setDisplayColorPicker2] = useState(false);
 //  const [strokeColor, setStrokeColor2] = useState(strokeColor3.current);

  const [strokeColor, setStrokeColor2] = useState("#123");
  const [fillColor, setFillColor2] = useState("#123");
  const [strokeWidth, setStrokeWidth] = useState(strokeWidth3.current);

  const [drawerRecord, setDrawerRecord] = useState(drawerFuncs);

   //const [ fillColor,setFillColor] = (0);
  //const popover = useRef<HTMLElement | null>(null);
  //const popover = useRef<React.LegacyRef<HTMLDivElement> | null>(null);

   const popover = useRef<HTMLDivElement>(null);
  //const popover = useRef();
    const popover5 = useRef<HTMLDivElement | null>(null);
  const [isOpen, toggle] = useState(true);
   const [isOpen2, toggle2] = useState(true);
 
    const close = useCallback(() => toggle(false), []);
     const close2 = useCallback(() => toggle2(false), []);
      const [fillColorError, setFillColorError] = useState(false);
        const [strokeColorError, setStrokeColorError] = useState(false);
         const [strokeWidthError, setStrokeWidthError] = useState(false);
 //  let startedInside = false;
///    let startedWhenMounted = false;
 // const [ colorClickedOutside,setColorClickedOutside] = useState(false);

  //const useClickOutside = (ref, handler) => {
  useEffect(() => {
     let startedInside = true;
    let startedWhenMounted = false;


    const listener = (event) => {
  //    console.log("user effect 1111111111111111111111111111111111111111111111");
        const myElement = document.getElementById('popover');
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) {
   //     console.log("ckicjed iutside  11111111111111",myElement!.contains(event.target));
        //    console.log("ckicjed iutside  1", myElement);
   
        return;
      }
   
      // Do nothing if clicking ref's element or descendent elements
     // if (!popover.current || popover.current.contains(event.target)) return;
        if ( !myElement!.contains(event.target)) {
    //    console.log("ckicjed iutside  11111111111111111 1");
       close();
      return;}
 
      close;
    };

  
    const validateEventStart = (event) => {
  //    startedWhenMounted = popover.current;
  //    startedInside = popover.current && popover.current.contains(event.target);
    };

  //  document.addEventListener("mousedown", validateEventStart);
      document.addEventListener('click', function(event) {
      // Do nothing      // Do nothing if `mousedown` or `touchstart` started inside ref element
      const myElement = document.getElementById('popover2');
  
    // 3. Check if the clicked element (event.target) is contained within myElement
     const inputElement = event.target as HTMLInputElement;
      if ((!myElement!.contains(inputElement)) ) {
   
   // if ((!myElement!.contains(inputElement))&& (fillColor !== ("#123") )) {
    //  if   (fillColor !== ("#123")) { 
      if   (colorClickedOutside.current) { 
   //     console.log("iding colo1111111111111111111111");
         //setDisplayColorPicker1(!displayColorPicker1);
         myElement!.style.display = 'none';
         colorClickedOutside.current=false;
        }

   //   console.log('Clicked outside the element 11111111111!',colorClickedOutside);
       //myElement!.style.display = 'none';
    } else {
    //  console.log('Clicked inside the element.111111111111111111111111');
      colorClickedOutside.current=true;
  } });
 //   document.addEventListener("toucart", validateEventStart);
 //   document.addEventListener("click", listener);

  //   return () => {
  //    document.removeEventListener("mousedown", validateEventStart);
  //    document.removeEventListener("touchstart", validateEventStart);
  //    document.removeEventListener("click", listener);
    
  }, [popover, close]);
//};
  
//------------------------------------------------------------------------------------------------
  useEffect(() => {
     let startedInside = true;
    let startedWhenMounted = false;


  
    const listener = (event) => {
   //   console.log("user effect 1111111111111111111111111111111111111111111111");
        const myElement2 = document.getElementById('popover4');
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) {
        console.log("ckicjed inside  2222",myElement2!.contains(event.target));
        //    console.log("ckicjed iutside  1", myElement);
   
        return;
      }
   
      // Do nothing if clicking ref's element or descendent elements
     // if (!popover.current || popover.current.contains(event.target)) return;
        if ( !myElement2!.contains(event.target)) {
        console.log("ckicjed iutside   2222");
       close2();
      return;}
 
      close2;
    };

  
    const validateEventStart = (event) => {
  //    startedWhenMounted = popover.current;
  //    startedInside = popover.current && popover.current.contains(event.target);
    };

  //  document.addEventListener("mousedown", validateEventStart);
      document.addEventListener('click', function(event) {
      // Do nothing      // Do nothing if `mousedown` or `touchstart` started inside ref element
      const myElement2 = document.getElementById('popover3');
  
    // 3. Check if the clicked element (event.target) is contained within myElement
     const inputElement2 = event.target as HTMLInputElement;
      if ((!myElement2!.contains(inputElement2)) ) {
   
   // if ((!myElement!.contains(inputElement))&& (fillColor !== ("#123") )) {
    //  if   (fillColor !== ("#123")) { 
      if   (colorClickedOutside2.current) { 
           console.log("iding color  222222222222222");
         //setDisplayColorPicker1(!displayColorPicker1);
         myElement2!.style.display = 'none';
         colorClickedOutside2.current=false;
        }

      console.log('Clicked outside the frist element22222!',colorClickedOutside2);
       //myElement!.style.display = 'none';
    } else {
      console.log('Clicked inside the second element2222.');
      colorClickedOutside2.current=true;
  } });
 //   document.addEventListener("toucart", validateEventStart);
 //   document.addEventListener("click", listener);

  //   return () => {
  //    document.removeEventListener("mousedown", validateEventStart);
  //    document.removeEventListener("touchstart", validateEventStart);
  //    document.removeEventListener("click", listener);
    
  }, [popover5, close2]);
  
// const inputRef1 = useRef<HTMLInputElement>(null);
 // const inputRef2 = useRef<HTMLInputElement>(null);
   const inputRef3 = useRef<HTMLInputElement>(null);
    const inputRef4 = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
   
    if (document.getElementById(mapId) !== null) { 
      if (eventLoopCounter.current === 0) { // convert full screen in % to px on reinitialize
        setMapWidth((window.innerWidth - (435 +7)).toString() + "px");
        eventLoopCounter.current = 1;
      }
    };
  }, []);

  useEffect(() => {
    if (cgpv.api.hasMapViewer(mapId)) {
      const myMap1 = cgpv.api.getMapViewer(mapId);
      (Language.english ) ? myMap1.setLanguage('en', true) : myMap1.setLanguage('fr', true);
    };
  }, []);

  const handleChangeAoi = () => {
    setAoiChecked((prev) => !prev);
  };

  const handleChangeSwiper = () => {
    setSwiperChecked((prev) => !prev);
  };

  const handleChangeDrawer = () => {
    setDrawerChecked((prev) => !prev);
  };

 const setFillColor= (color: string) => {
   {

      inputRef3.current!.value = color;
      drawerRecord[0].fillColor = color;
       setFillColor2(color)
  
     setIsModified(true);
           
    console.log("fill color =",color);
  
  };
}

const setStrokeColor= (color: string) => {
   {
    inputRef4.current!.value= color;
     drawerRecord[0].strokeColor = color;
       setFillColor2(color)
      setStrokeColor2(color);
     setIsModified(true);
     //    updateProperty('corePackagesConfig[0].drawer.style.strokeColour',inputRef2.current!.value.toString());
   
    console.log("stroke color =",color)
 //   setDrawerChecked((prev) => !prev);
  };
}


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
 //   (typeof drawerFuncs[0] === "undefined") ? console.log("fill color undefined") : console.log("fill color is defined",drawerFuncs[0].fillColor);
   // console.log("in get property");
  //  if (property === "corePackages") 
       if (property === "navBar") 
      {
       //       console.log("core packagers in get propoerties")
      
      let packages: any = _.get(configJson, property);
      for (var i in packages) {

         if (packages[i] === "drawer") {
       //       console.log("drawer1 in get propoerties")
        
          
         // setTimeout(createLayerList, 5000);
          if (displayLayers.current === 0) {  // first time thru on reload
            displayLayers.current = 1;
            drawerDisplay.current = 1;
            setDrawerChecked(true);
         //  forceUpdate()
        //     console.log("drawer in get propoerties");
          };
            if (drawerModified.current === 0) { // like useRef, not modified if reloads  
           //  drawerModified.current = 1;
      //        drawerDisplay.current = 1;
       //    // forceUpdate()
          //   console.log("drawer2 in get propoerties")
             while (drawerFuncs.length > 0) {
               drawerFuncs.pop();
            }
            let i3 = 0;
                console.log("setting drawer func values from config json");
                let fillColor = 'corePackagesConfig[0].drawer.style.fillColor';
                let strokeColor = 'corePackagesConfig[0].drawer.style.strokeColor';
                 //let strokeColor = 'corePackagesConfig[0].drawer.style.strokeColor';
                let strokeWidth = 'corePackagesConfig[0].drawer.style.strokeWidth';
                let activeGeometry= 'corePackagesConfig[0].drawer.activeGeometry';
                let geomTypes= 'corePackagesConfig[0].drawer.geomTypes';
                let hideMeasurements = 'corePackagesConfig[0].drawer.hideMeasurements';
                let version = 'corePackagesConfig[0].drawer.version';
               
                drawerFuncs.push({version:"", fillColor: "", strokeColor: '', strokeWidth: "", activeGeometry: "",geomTypes:[],hideMeasurements: false }); // added april 7 increse array
                drawerFuncs[0].version = (_.get(configJson, version));
                drawerFuncs[0].fillColor = (_.get(configJson, fillColor));

                //  if no hooks no too many refresh problem


            //    setFillColor2(_.get(configJson, fillColor));
                fillColor3.current=(_.get(configJson, fillColor));
             
                console.log("setting fill color values from config json",fillColor,drawerFuncs[0].fillColor);
              
                drawerFuncs[0].strokeColor = (_.get(configJson, strokeColor));
            //   setStrokeColor2(_.get(configJson, strokeColor));

                strokeColor3.current =(_.get(configJson, strokeColor));
                console.log("setting stroke color from config json",strokeColor,drawerFuncs[0].strokeColor);

                drawerFuncs[0].strokeWidth = (_.get(configJson, strokeWidth));

             //   setStrokeWidth(_.get(configJson, strokeWidth));
                 strokeWidth3.current=(_.get(configJson, strokeWidth));
             
                drawerFuncs[0].activeGeometry= (_.get(configJson, activeGeometry));
                drawerFuncs[0].geomTypes =(_.get(configJson, geomTypes));
                drawerFuncs[0].hideMeasurements = (_.get(configJson, hideMeasurements));

          //    drawerModified.current =1; // feb 5 in not to exceed reat refreshes
              
        //    } // index is not  undefined    
        //  } //aoimodified
        };
      };

      };
    }; 

     if (property === "corePackages") 
   //    if (property === "navBar") 
      {
              console.log("core packagers in get propoerties")
      
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
           let maxlayerId: any = _.get(configJson, "corePackagesConfig[0].aoi-panel.aoiList");
           if ((displayLayers.current === 0)) { //works displays aoi list when ony swiper in a file   
            displayLayers.current = 1; //0 if loading from a file on iniial load
            aoiDisplay.current = 2;
            setAoiChecked(true);
            setAoiRecordIndex(maxlayerId.length-1);
           }
           if (aoiModified.current === 0) { // like useRef, not modified if reloads  
             while (aoiFuncs.length > 0) {
               aoiFuncs.pop();
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

 function handleAddDrawer() {//feb 9 changed to frawer record
    drawerRecord.push({ fillColor: "", strokeColor: '', strokeWidth: "", activeGeometry: "",geomTypes:[],hideMeasurements: false ,version:"1.0"}); // added april 7 increse array
    console.log("  added drawer fields");
    getProperty('corePackagesConfig[0].drawer.style.strokeWidth')
    forceUpdate();//feb 9
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

    function handleDrawerSave() {

      console.log("-----in drawer Save");
  //  _.set(modifiedConfigJson, "corePackages", "drawer");
 //  if (swiperDisplay.current === 1)
  //    _.set(modifiedConfigJson, "corePackages", ["drawer","swiper"]);
   // else if (drawerDisplay.current === 1)
   //   _.set(modifiedConfigJson, "corePackages", ["drawer"]);
   //else
   //   _.set(modifiedConfigJson, "corePackages", ["drawer"]);

   // _.set(modifiedConfigJson, "corePackagesConfig[0].drawer", "corePackagesConfig")
   // _.set(modifiedConfigJson, "corePackagesConfig[0].drawer", "drawer")

   // _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style', true);
     _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.fillColor', drawerRecord[0].fillColor);
     _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeColor', drawerRecord[0].strokeColor);
     _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.style.strokeWidth',Number(drawerRecord[0].strokeWidth));
    //  _.set(modifiedConfigJson, 'corePackagesConfig[0].drawer.version',drawerRecord[0].version);  //commented out 9 mar
     let activeGeometry=(_.get(modifiedConfigJson, 'corePackagesConfig[0].drawer.activeGeom'));
        let geomeTypes=(_.get(modifiedConfigJson, 'corePackagesConfig[0].drawer.geomTypes'));
       let hideMeasurements=(_.get(modifiedConfigJson, 'corePackagesConfig[0].drawer.hideMeasurements'));
      console.log("in save Jsons=",configJson,modifiedConfigJson);
         
           console.log("in save actiegeomry=",activeGeometry);
              console.log("in save actiegeometry2et=",_.get(modifiedConfigJson, 'corePackagesConfig[0].drawer.activeGeom'));
       //       _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.activeGeom", activeGeometry);
     //  _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.geomTypes", geomeTypes);
       _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.hideMeasurements", hideMeasurements); //added feb 9
       _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.hideMeasurements", Boolean(false)); //added feb 9

_.set(modifiedConfigJson, "corePackagesConfig[0].drawer.hideMeasurements", Boolean(false)); //added feb 9

   //   _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.activeGeometry", drawerFuncs[0].activeGeometry);
     //  _.set(modifiedConfigJson, "corePackagesConfig[0].drawer.GeomTypes", drawerFuncs[0].geomTypes);
     //  _.set(modifiedConfigJson, "corePackagesConfig[0].drawer..hideMeasurements", drawerFuncs[0].hideMeasurements);

   
    drawerModified.current = 0;
    setIsModified(true);

     handleApplyConfigChanges();


  }

  function handleSave() {
    _.set(modifiedConfigJson, "corePackages", "aoi-panel");
   if (swiperDisplay.current === 1)
      _.set(modifiedConfigJson, "corePackages", ["aoi-panel","swiper"]);
    else if (drawerDisplay.current === 1)
      _.set(modifiedConfigJson, "corePackages", ["aoi-panel"]);
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


  const handleItemChangeFillColor = (index: any, event: any) => {
      console.log("in handle item change fill color",event.target.value,event.target.value.length);
      setFillColorError(true);
      if ((event.target.value.length > 4)) {

        if ( event.target.value.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
           || event.target.value.match(/^rgb\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\)$/)
           || event.target.value.match(/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)$/)
          ) {
             setFillColorError(false);
             drawerRecord[0].fillColor = event.target.value;
             setIsModified(true);
             setIsModified(true);
             enqueueSnackbar('color is valid');
            };
           } else {
             enqueueSnackbar('color invalid', { variant: 'error' });
           } 
    const newItems = [...drawerRecord];
    console.log("stoke color",event.target.value);
    drawerRecord[0].fillColor = event.target.value;
    setDrawerRecord(newItems);
    setIsModified(true);
  };

   const handleItemChangeStrokeColor = (index: any, event: any) => {
      console.log("in handle item change fill color",event.target.value,event.target.value.length);
      setStrokeColorError(true);
      if ((event.target.value.length > 4)) {

        if ( event.target.value.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
           || event.target.value.match(/^rgb\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\)$/)
           || event.target.value.match(/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)$/)
          ) {
             setStrokeColorError(false);
             drawerRecord[0].strokeColor = event.target.value;
             setIsModified(true);
             setIsModified(true);
             enqueueSnackbar('color is valid');
            };
           } else {
             enqueueSnackbar('color invalid', { variant: 'error' });
           } 
    const newItems = [...drawerRecord];

    drawerRecord[0].strokeColor = event.target.value;
    setDrawerRecord(newItems);
    setIsModified(true);
  };

   const handleItemChangeStrokeWidth = (index: any, event: any) => {
      console.log("in handle item change fill color",event.target.value,event.target.value.length);
      setStrokeWidthError(true);
      if ((event.target.value.length >= 1)) {

        if ( event.target.value.match(/^\d+(\.\d+)?$/)
           ) {
             setStrokeWidthError(false);
             drawerRecord[0].strokeWidth = event.target.value;
             setIsModified(true);
          
             enqueueSnackbar('width is valid');
            };
           } else {
             enqueueSnackbar('width invalid', { variant: 'error' });
           } 
    const newItems = [...drawerRecord];
    drawerRecord[0].strokeWidth = event.target.value;
    setDrawerRecord(newItems);
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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl component="fieldset" sx={{ mt: 1, gap: 3 }}>
        <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { const myMap = cgpv.api.getMapViewer(mapId);
           (isEn) ? myMap.setLanguage('fr', true) : myMap.setLanguage('en', true);
           (isEn) ? Language.english = false : Language.english= true;
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
            console.log("shaded value afer update =",configJson);
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
               else if((selectedvalue === "drawer") && (reason == "selectOption"))
              {
                //have to set color of swiper label or stays displayed even though disabled,unchecked
                setIsModified(true);
                 drawerRecord.push({ fillColor: "", strokeColor: '', strokeWidth: "", activeGeometry: "",geomTypes:[],hideMeasurements: false }); // added april 7 increse array
   
                displayLayers.current = 1;
                drawerDisplay.current = 1;
                setDrawerChecked(true);
               // createLayerList();
                handlePackageChange('corePackages', value, reason, selectedvalue);
              //  handleApplyConfigChanges();
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
                         backgroundColor: "white",// works is white when collapse
                    },
                  }}

                />}
               labelPlacement="start"/>
          : ''}

          <Collapse in={drawerChecked}>

            <Divider sx={{ my: 4 ,border:"none"}} />  

              <Button onClick={handleAddDrawer} 
              variant="contained" color="primary" size="small">
            Add
            </Button>

            <Tooltip title="Select item(s) using item checkbox">
              <Button onClick={(event) => {
             //   console.log("value of fille color of delete", drawerFuncs[0].fillColor);
              //    console.log("value of fill color of delete", inputRef3.current!.value )
              }}
                variant="contained"
                color="primary"
                size="small">
                Delete
              </Button>
            </Tooltip>

            <Button onClick={(event) => {console.log("in drawer save");handleDrawerSave();}}
              variant="contained" color="primary" size="small">
               Save
            </Button>

              <Divider sx={{ my: 2 ,border:"none"}} /> 

           <Stack  justifyContent="flex-start"  alignItems="flex-start" direction="column"
                sx={{  display: 'flex', flexDirection: 'column', 
                justifyContent: 'flex-start' }}
         // direction="column"
       //  sx={{ display: 'flex', flexDirection: 'row' }}
        //  direction={{ xs: 'column', sm: 'column' }} 
                spacing={3}
               >

                <List style={{  flexDirection: "row",
                               borderCollapse: 'collapse',textAlign: 'left',
                               justifyContent: 'flex-start'
              // , width: '100%' 
                }}>

                  {drawerRecord.map((item,index) => (

<ListItem key={index}style={{display: 'flex',flexDirection:'column',justifyContent:'flex-start'  
                      // feb 9 commented out below
                   //    border: '1px solid black',
                   //     borderStyle: 'solid'
                      }}>

 
     
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 2 }}>
            <FormGroup>
                       <TextField inputRef={inputRef3} sx={{ 
                        display: 'flex', flexDirection: 'column', 
                        justifyContent: 'flex-start', borderStyle: 'solid',
                       //  maxWidth: '30px',
                          maxHeight: '40px',
                      //     minWidth: '360px',
                          minWidth: '240px',
                          minHeight: '40px'}}
                         label="Fill Color"
                         value={item.fillColor}
                         error={fillColorError}
                         onChange={(event) => handleItemChangeFillColor(index, event)} />
                    </FormGroup>

                <FormControl>
                    {isOpen && 
                   <div className="popover" ref={popover} id="popover">

                <Button sx={{border:"none" , maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px'}} 
                  variant="contained" startIcon={<Palette fontSize="small" sx={{ color: 'orange' }} />}
                  onClick={() =>   { 
                   const myElement = document.getElementById('popover2');

                    myElement!.style.display = 'block';
                 setDisplayColorPicker1(!displayColorPicker1);  }} >
                </Button> 
                 </div>
                 }

               </FormControl>
               </Box>
               
              
            < Stack   direction="column" justifyContent="flex-start">

               <HexColorPicker id="popover2" color={color} onChange={(color) =>{ drawerModified.current = 1;  // color picker hidder
                setFillColor(color);
                setColor(color);
                // drawerFuncs[0].fillColor = color;
              }} 
              
              style={{ display: displayColorPicker1 ?  'flex': 'none'}}/> 

                <Divider sx={{ my: 2 ,border:"none"}} /> 
    
              </Stack>
                < Divider sx={{ my: 1 ,border:"none"}} />  

                     <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        
                <FormControl>

                       <TextField inputRef={inputRef4} sx={{ display: 'flex',
                        flexDirection: 'column', maxHeight: '40px', justifyContent: 'flex-start',
                    
                            minWidth: '240px',
                      //  minHeight: '40px', 
                        borderStyle: 'solid'}}
                         label="Stroke Color"
                         value={item.strokeColor}
                          error={strokeColorError}
                         onChange={(event) => handleItemChangeStrokeColor(index, event)} />
                      
                       </FormControl>

               <FormControl>
                   {isOpen2 && 
                   <div className="popover" ref={popover5} id="popover4">

                <Button sx={{border:"none" , maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px'}} 
                  variant="contained" startIcon={<Palette fontSize="small" sx={{ color: 'orange' }} />}
                  onClick={() =>   { 
                      const myElement = document.getElementById('popover3');

                         myElement!.style.display = 'block';
                         setDisplayColorPicker2(!displayColorPicker2);  }} >
                </Button> 
                 </div>
                 }

               </FormControl>
                </Box>

                < Stack   direction="column" justifyContent="flex-start">

               <HexColorPicker id="popover3"  color={color} onChange={(color) =>{ drawerModified.current = 1;  // color picker hidder
              
                setStrokeColor(color);
                setColor(color);
                // drawerFuncs[0].fillColor = color;
              }} 
              
              style={{ display: displayColorPicker2 ?  'flex': 'none'}}/> 

                <Divider sx={{ my: 2 ,border:"none"}} /> 
    
              </Stack>
           
                <FormControl>
                       <TextField sx={{ 
                       display: 'flex', flexDirection: 'column', 
                    //    justifyContent: 'flex-start',
                       maxHeight:'40px', 
                        minWidth: '300px',
                    //  minWidth: '420px',
                        minHeight: '40px',
                 //       borderStyle: 'solid'
                       }}
                         label="Stroke Width"
                         value={item.strokeWidth}
                        // error={extentError}
                        // onKeyDown={handleKeyDownExtent}  // called when return key is pressed
                                error={strokeWidthError}
                         onChange={(event) => handleItemChangeStrokeWidth(index, event)} />

                           </FormControl>
                          
                            <Divider sx={{ my: 2 ,border:"none"}} /> 

              <FormGroup aria-label="Hide Measurements" sx={{ 
                       display: 'flex', flexDirection: 'column', 
                    //    justifyContent: 'flex-start',
                       maxHeight:'40px', 
                      minWidth: '300px',
                        minHeight: '40px',
                  //      borderStyle: 'solid'
                       }}>

                          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      
           <FormControl component="fieldset" sx={{ mt: 1, gap: 1 ,
            // maxWidth: '400px', maxHeight: '20px', 
            /// minWidth: '400px', 
           //  minHeight: '20px'
             }}>
              
               <FormGroup aria-label="Active Geometry" sx={{ 
                       display: 'flex', flexDirection: 'column', 
                    //    justifyContent: 'flex-start',
                       maxHeight:'40px', 
                      minWidth: '300px',
                        minHeight: '40px',
                  //      borderStyle: 'solid'
                       }}>
          

      
         <SingleSelectComplete
          options={DrawerPackageActiveGeometry}
          defaultValue={getProperty('corePackagesConfig[0].drawer.activeGeom')}
          onChange={(value) => {
          updateProperty('corePackagesConfig[0].drawer.activeGeom',value);
         //   updateProperty('corePackupdatePropertyagesConfig[0].drawer.', JSON.parse(value); 
             setIsModified(true);
           // console.log("shaded value afer update =",configJson,modifiedConfigJson);
          }}
          label="Hide Measurements" placeholder="" />
          </FormGroup>
            </FormControl>
             </Box>

         


          </FormGroup>
          <Divider sx={{ my: 2 ,border:"none"}} />  
            <FormGroup aria-label="Geom Types" sx={{ 
                       display: 'flex', flexDirection: 'column', 
                    //    justifyContent: 'flex-start',
                       maxHeight:'40px', 
                      minWidth: '300px',
                        minHeight: '40px',
                  //      borderStyle: 'solid'
                       }}>
          <PillsAutoComplete
            defaultValue={(getProperty('corePackagesConfig[0].drawer.geomTypes') )} 
            onChange={(value) => {updateArrayProperty('corePackagesConfig[0].drawer.geomTypes', value);  setIsModified(true);}}
            options={ DrawerPackageGeometryTypes}
            label="Geometry Types" placeholder="" />
      </FormGroup>


           <FormControl component="fieldset" sx={{ mt: 1, gap: 1 ,
            // maxWidth: '400px', maxHeight: '20px', 
            /// minWidth: '400px', 
           //  minHeight: '20px'
             }}>
              
              <Divider sx={{ my: 2 ,border:"none"}} /> 

               <FormGroup aria-label="Hide Measurements" sx={{ 
                       display: 'flex', flexDirection: 'column', 
                    //    justifyContent: 'flex-start',
                       maxHeight:'40px', 
                      minWidth: '300px',
                        minHeight: '40px',
                  //      borderStyle: 'solid'
                       }}>

            <SingleSelectComplete
          options={drawerHideMeasurements}
          defaultValue={Boolean(getProperty('corePackagesConfig[0].drawer.hideMeasurements')) ? 'true':'false' }
          onChange={(value) => {
            updateProperty('corePackagesConfig[0].drawer.hideMeasurements', JSON.parse(value)); 
             setIsModified(true);
           // console.log("shaded value afer update =",configJson,modifiedConfigJson);
          }}
          label="Hide Measurements" placeholder="" />
         
          
        </FormGroup>
            </FormControl>
           
                       <br></br>
                     </ListItem>

                     ))}
                </List>
              </Stack>

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

                       <TextField sx={{ display: 'flex', flexDirection: 'column', borderStyle: 'solid', maxWidth: '30px', maxHeight: '40px', minWidth: '390px', minHeight: '40px', '& .MuiInputBase-input': { textAlign: 'left' } }}
                         label="Title"
                         value={item.title}
                         onChange={(event) => handleItemChangeTitle(index, event)} />

                       <Divider sx={{ my: 2 }}/>

                       <TextField sx={{ display: 'flex', flexDirection: 'column', maxHeight: '40px', minWidth: '390px', minHeight: '40px', borderStyle: 'solid', '& .MuiInputBase-input': { textAlign: 'left' } }}
                         label="Url"
                         value={item.url}
                         onChange={(event) => handleItemChangeUrl(index, event)} />

                       <Divider sx={{ my: 2 }} />

                       <TextField sx={{ display: 'flex', flexDirection: 'column', maxHeight:'40px', minWidth: '390px', minHeight: '40px', borderStyle: 'solid', '& .MuiInputBase-input': { textAlign: 'left' } }}
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