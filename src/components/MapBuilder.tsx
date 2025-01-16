/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  breadcrumbsClasses,
  Button,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
} from '@mui/material';
import { useContext, useState, useEffect, useRef } from 'react';
import { useSnackbar } from '@/providers/snackbarProvider';
import { CGPVContext } from '@/providers/cgpvContextProvider/CGPVContextProvider';
import _ from 'lodash';
import PillsAutoComplete from './PillsAutoComplete';
import { eventLoopCounter,SwiperPackageOrientation,SwiperPackagekeyboardOffset, SwiperPackageLayers,layerOptions,
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions,appBarOptions,mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST, corePackagesOptions
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';


export function MapBuilder() {

// const window;
//  const geoviewPlugin= "";
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }
  let corePackages = [];

  const { mapId } = cgpvContext;
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, handleConfigJsonChange, configFilePath, mapWidth,mapHeight, setMapWidth, setMapHeight } = cgpvContext;
  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(configJson);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isEn, setEn] = useState<boolean>(true);
  const [isMapSizeValid, setMapSizeValid] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [swiper, setSwiper] = useState<boolean>(false);

  const displayLayers = useRef(0);

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
    console.log("new config", property,value);
    if (value === undefined) {
      _.unset(newConfig, property);
    } else {
      _.set(newConfig, property, value);
    }
    setModifiedConfigJson(newConfig);
    console.log("new config", newConfig);
    setIsModified(true);
  }

   const getProperty = (property: string, defaultValue = undefined) => {
 
  // const getProperty = (property: string, defaultValue = undefined) => {
    // console.log('property=', property, _.get(configJson, property));
    if (property === "corePackages") {
      let packages: any = _.get(configJson, property);
      console.log("packages=", packages, typeof packages);
      //  console.log("packages", typeof packages, packages, property);
      // if (packages.find(x => x === "swiper")) {
      // if (packages.contains["swiper"]){
      //   Object.keys(packages).forEach(function eachKey(key) {
    //  if (Object.values(packages).indexOf(["swiper"])) {
        // alert(key);
        // setSwiper(true);
        // if (packages(0)  === 'swiper') {
  //      console.log('has swiper');
  //    }
      //  
      // 
       
      for (var i in packages) {
        //   Object.values(packages);
        if (packages[i]  === "swiper") { 
          //  setSwiper(true);
             displayLayers.current = 1;
          console.log(" display.layer=", displayLayers.current);
        console.log(" swiper tureeeeee=", i, packages[i], Object.values(packages));
        };
      };

      
      console.log(" package=", packages);
      
     // if (packages    === "swiper") { 
          //  setSwiper(true);
      //       displayLayers.current = 1;
          console.log(" display.layer=", displayLayers.current);
      //  console.log(" swiper tureeeeee=", i, packages[i], Object.values(packages));
    //    };


        //  console.log(" swiper tureeeeee=",Object.keys(packages));
   //   };
        // alerts key) find(x => x === "swiper")){
    //    setSwiper(true);
     //     console.log(" swiper tureeeeee");
   //  }
    };
    //  if (packages.find((o => o ==="swiper"))) {
   //     setSwiper(true);
   //          }
    
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

  const activateLayer = () => {
     console.log("acticated layer --------------------  1");
    setSwiper(true);
    
    //deb 21 2025 to un commetn out
   //   updateArrayProperty("corePackages", ["swiper"]);
   //  // setTimeout(cgpv.api.maps[mapId].plugins['swiper'].activateForLayer("esriFeatureLYR4/0"), 55000);
 console.log("acticated layer");
  
  }

 //const removeLayer = () => {
 //    console.log("acticated layer --------------------  1");
  //  setSwiper(true);
    
    //deb 21 2025 to un commetn out
   //   updateArrayProperty("corePackages", ["swiper"]);
   //  // setTimeout(cgpv.api.maps[mapId].plugins['swiper'].activateForLayer("esriFeatureLYR4/0"), 55000);
 //console.log("acticated layer");
  
  //}



  const handlePackageChange = (property: string, value: any, reason: any) => {
    //  setIsModified(false);
    console.log("property=", property, value, reason);
    console.log("map id=", mapId);
    const featureInfoLayerSet = cgpv.api.maps[mapId].layer.featureInfoLayerSet.resultSet;
    console.log("feature info=", featureInfoLayerSet);
    corePackages = value;
    console.log("corepackages=", corePackages);
      
    setSwiper(true);
    if (reason !== "removeOption") {
     
      displayLayers.current = displayLayers.current + 1;
    }
    else {
      displayLayers.current = 0;
      console.log("settinf off display layer=", displayLayers.current);
    
    }
    // ._get ddoes get values of a json array on have o specify wtihan index._
    //   console.log('map values=', _.mapValues(configJson,'map.listOfGeoviewLayerConfig[0].geoviewLayerName'));
   
      
    ////  console.log('map values=', _.mapValues(configJson, 'map.listOfGeoviewLayerConfig.geoviewLayerName'));
    console.log("get =", _.get(configJson, 'map.listOfGeoviewLayerConfig[].geoviewLayerName'));
    //  console.log("get =", _.get(configJson, 'map.listOfGeoviewLayerConfig[1].geoviewLayerName'));
    //console.log("get =", _.get(configJson, 'map.listOfGeoviewLayerConfig[2].geoviewLayerName'));
     
    let m = [
     /* { title?: '', value: '' ,group:""}
       { title: '', value: '' ,group:""},
       { title: '', value: '' ,group:""},
       { title: '', value: '',group:"" },
       { title: '', value: '' ,group:""},
       { title: '', value: '' ,group:""}, 
       { title: '', value: '' ,group:""},
               
       { title: '', value: '' ,group:""},

       { title: '', value: '',group:"" },

       { title: '', value: '' ,group:""},
       { title: '', value: '',group:"" },
*/


    ];
    /*
    for (let i = 0; i < 10; i++){      
    
      let layer = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerName';
       //  let geoviewlayerName = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerName';
    let geoviewlayerId = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerId';
        let layerId = 'map.listOfGeoviewLayerConfig[' + i + '].listOfLayerEntryConfig[0].layerId';
   console.log("layer=", _.get(configJson, layer),layer);

      m.push({ title: '', value: '', group: "" }); // added april 7 increse array

      m[i].value = (_.get(configJson, layer)); //use i instead of 0
         m[i].value = (_.get(configJson, geoviewlayerId)+"/"+_.get(configJson, layerId)); //use i instead of 0
     
     // m[i].value = geoviewlayerId + "/" + layerId;
      m[i].title = (_.get(configJson, layer)); //use i instead of 0
      m[i].group = "n";
     console.log("m =", m[i]);
    if ((typeof m[i].value) === "undefined") break; 
   //  layerOptions.push(m[i]);
     console.log("layerOptions =", layerOptions);
 
    }
    */
      
    console.log(" ----------------- beofe loop layerOptions=", layerOptions);
      
    // Object.keys(layerOptions).forEach(key => delete layerOptions[key]);

  //  console.log(" -----------------after delete layerOptions=", layerOptions);
    layerOptions.splice(0, 5);
    
   for (let i = 0; i < 5; i++) {
      layerOptions.splice(0,i);
     delete layerOptions[i];
     //  delete layerOptions[i]?.title;
     // delete layerOptions[i]?.value;
    //  delete layerOptions[i]?.group;
    }
 console.log(" -----------------after delete layerOptions=", layerOptions);
      
      let count = 0; let id = "";
      let layer2 = "";
      for (let i = 0; i < 10; i++) {
      
        let layer = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerName';
        //  let geoviewlayerName = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerName';
        let geoviewlayerId = 'map.listOfGeoviewLayerConfig[' + i + '].geoviewLayerId';
      
          for (let i2 = 0; i2 < 10; i2++) {

       // let layerId = 'map.listOfGeoviewLayerConfig[' + i + '].listOfLayerEntryConfig[0].layerId';
        let layerId = 'map.listOfGeoviewLayerConfig[' + i + '].listOfLayerEntryConfig['+ i2 +'].layerId';
     
        console.log("layer=", _.get(configJson, layer), layer);
        console.log("layer=", _.get(configJson, layer), layer,"layerID=",_.get(configJson, layerId));

        m.push({ title: '', value: '', group: "" }); // added april 7 increse array

        //m[i].value = (_.get(configJson, layer)); //use i instead of 0
            
            layer2 = _.get(configJson, geoviewlayerId);
            id = _.get(configJson, layerId);

            if ((typeof layer2 !== 'undefined') && (typeof id !== 'undefined')) {

              m[i].value = (_.get(configJson, geoviewlayerId) + "/" + _.get(configJson, layerId)); //use i instead of 0
       
              // m[i].value = geoviewlayerId + "/" + layerId;
              // m[i].title = (_.get(configJson, layer)); //use i instead of 0
              m[i].title = (_.get(configJson, geoviewlayerId) + "/" + _.get(configJson, layerId)); //use i instead of 0
              //use i instead of 0
      
              m[i].group = "n";
               
            }
            else break;
            
           console.log("m =", m[i]);
         
            if ((m[i].value) === 'undefined/undefined') {
              console.log("in break-------", m[i].value);
              break;
            };
                // added april 8
             if (m[i].value.includes('undefined')) {
              console.log("in break-------", m[i].value);
              break;
            };
        if ((typeof m[i].title) === undefined) {
          break;
            }
            
            
            if ((typeof m[i].value !== 'undefined') && (typeof m[i].title !== "undefined" ))  
        {
       //  if ((m[i].value.search("undefined")=== -1) && (m[i].title.search('undefined')=== -1) ){
            //if ((m[i].value) !== 'undefined/undefined') {

                       console.log("---------value of type=",typeof m[i].value );
 console.log("---------------------------------value of type=", typeof m[i].title);

           
          //  console.log("---------------------------------value of incldue=",(!m[i].value.includes('undefined')));
 //console.log("---------------------------------value of incldue=",(!m[i].title.includes('undefined')));
    console.log("wrting to layeroptions =", m[i].value, m[i].title,i);
              layerOptions.push(m[i]);
                 console.log("layerOptions =", layerOptions);
               //   layerOptions.push(m[count]);
             // count = count + 1;
          
            // console.log("wrting to layeroptions =", m[count].value,m[count].title,count);
       
            }

        console.log("layerOptions =", layerOptions);
        
         } //end inner loop
      }
    
 //     for (let i = 0; i < 10; i++) {
  //      if (m[i].title === "") {
  //        delete m[i]; console.log("-------------compacting array");
   //     }
  //   }
//console.log("win plugin value=", window.geoviewPlugins['swiper']);
    
   console.log("before call");
// from loading_packages.html
  //      cgpv.api.plugin.addPlugin('swiper', 'sandboxMap', window.geoviewPlugins['swiper'], {
   //        mapId:'sandboxMap',layerPaths:['nonmetalmines/5']
  //       }); 
      
   //        cgpv.api.plugin.addPlugin('swiper', 'sandboxMap', window.packages['swiper'], {
    //       mapId: 'sandboxMap',
   //      }); 
         console.log("afte call");
  //windows[geoviewPlugins];
//        cgpv.api.plugin.addPlugin('swiper', mapId ,window.geoviewPlugins['swiper'], {
 //          mapId: mapId,layerPaths:['nonmetalmines/5']
   //   });
 //   
  //  cgpv.api.plugin.addPlugin('swiper', mapId,      window.geoviewPlugins['swiper'], {
  //         mapId: mapId,
   //  }); 
  
     // let configUrl = document.getElementById(mapId)?.getAttribute(');
    //  let configUrl = (document.getElementsByName('data-config-url') as HTMLInputElement).value;
      
      //configUrl.setAttribute("", "");
      //let configUrl2 =(document.getElementsByName('data-config-url') as HTMLInputElement).value
      //document.getElementsByName('data-config-url').setAttribute('data-config-url', "default-config-swiper');
     
      let configUrl = (document.getElementById(mapId) as HTMLInputElement).value;
      //configUrl!.setAttribute('data-config-url', "");
      
      
      // works
     document.getElementById(mapId)!.setAttribute("data-config-url","default-config-swiper");
         // (document.getElementById(mapId) as HTMLInputElement).value = "default-config-swiper";
  

      // configUrl.setAttribute('data-config-url','default-config-swiper");

      //configUrl!. = "default-config-swiper.json";

      //document.getElementById(mapId).getAttribute('data-config-url').innerHtml="default-config-swiper.json"

      console.log("--- datacnfigurl=", configUrl );
      cgpv.init(async () => {
        
        console.log("map viweer =", cgpv.api.getMapViewer(mapId));
        return;
          // getMapViewer(mapId).map.getView();
        },
      
      );
//console.log("map viweer =",cgpv.api.getMapViewer(mapId));
      // 

          console.log("map viweer =", cgpv.api.maps[mapId]);
  //    const viewer = cgpv.api.maps[mapId];
 //const mapContainerDiv = document.getElementById('sandboxMapContainer');
    //   cgpv.api.plugin.addPlugin('swiper', mapId, window.geoviewPlugins['swiper'], {
       //     mapId: mapId, viewer:99,layerPaths:["esriFeatureLYR4/0"]
  
  
      //   });


      // to undo feb 21 2025
    //  _.set(modifiedConfigJson , "corePackages", ["swiper"]);
      if (reason !== "removeOption") {
     
        _.set(configJson, "corePackages", ["swiper"]);   // here this changes it
      }

     //_.set(configJson, "corePackagesConfig", []);   // here this changes it
     
  //    _.set(configJson, "corePackagesConfig", ["swiper","aoi"]);   // here this changes it
   //    _.set(configJson, "corePackagesConfig", );   // here this changes it
    
        _.set(configJson, "corePackagesConfig[0].swiper.orientation", "vertical");   // here this changes it
        _.set(configJson, "corePackagesConfig[0].swiper.layers", ["esriFeatureLYR4/0"]);   // here this changes it
         _.set(configJson, "corePackagesConfig[0].swiper.keyboardOffset", "10");   // here this changes it
      
      //   _.set(configJson, "corePackagesConfig.aoi.orientation", "vertical");   // here this changes it
     
    
     
      setIsModified(true);

     //  "corePackagesConfig": [
     //   {
       //     "swiper": {
       //         "orientation": "horizontal",
       //         "keyboardOffset": 10,
       //         "layers": [
        //            "esriFeatureLYR4/0"
         //       ]
          //  }
      //  }
  //  ]
      if (reason !== "removeOption") {
      //  updateArrayProperty("corePackages", ["swiper"]);  // not here
        //handleConfigJsonChange;
        handleApplyConfigChanges(); //workss
      }
      else {
       // updateArrayProperty("corePackages", []);
           _.set(configJson, "corePackages", []);   // here this changes it
    
     //   cgpv.api.maps[mapId].plugins['swiper'].deActivateAll(value);
         handleApplyConfigChanges(); //workss
      }

      // handleApplyStateToConfigFile();
     
      // document.getElementById("handleApplyConfigChanges").click();
      console.log('value =',value);
   
   //   if (value.find((element: any) => element === "swiper"))
  //    { //handleApplyConfigChanges(); 
   //     console.log("");}
      
      //document.getElementById("handleApplyStateToConfigFile").click();
      
     // handleApplyStateToConfigFile();
      
        setTimeout( () => { setSwiper(true);} , 55000);
      //cgpv.api.maps[mapId].plugins['swiper'].activateForLayer("esriFeatureLYR4/0");

         console.log("after updating json config",getProperty('corePackages'));
/*
      if (value.find((element: any)=> element ==="area-of-interest")) {
        cgpv.api.plugin.addPlugin('aoi-panel', mapId, window.geoviewPlugins['aoi-panel'], {
          mapId: mapId,
        });
      }
      if (value.find((element: any) => element ==="geochart")) {
        cgpv.api.plugin.addPlugin('geochart', mapId, window.geoviewPlugins['geochart'], {
          mapId: mapId,
        });
      }
        
      if (value.find((element: any) => element ==="time-slider")) {
        cgpv.api.plugin.addPlugin('time-slider', mapId, window.geoviewPlugins['time-slider'], {
          mapId: mapId,
        });
      }
      if (value.find((element: any) => element === "basemap-panel")) {
            cgpv.api.plugin.addPlugin('basemap-panel', mapId, window.geoviewPlugins['basemap-panel'], {
                mapId: mapId,
              });
      }
   */   
     //   cgpv.api.plugin.addPlugin('swiper', mapId ); 
      setTimeout(activateLayer, 5000);
      console.log("1 active layers=", cgpv.api.maps[mapId].layer.featureInfoLayerSet.resultSet);

  cgpv.init(
        () => {
          // write some code ...
        },
       
      );

// setTimeout(cgpv.api.maps[mapId].plugins['swiper'].activateForLayer('nonmetalmines/5'), 95000);
     
  //    cgpv.api.maps[mapId].plugins['swiper'].activateForLayer('nonmetalmines/5');

    ///////////////////////////////////////////////////////////
      // commented ou april 8  window.geoviewPlugins = window.geoviewPlugins || {};
      
     // console.log(' added windows object',mapId,);
  
    //  console.log("swiper=", cgpv.api.maps[mapId].plugins['swiper']);
      
    //  console.log("1 mapId=", cgpv.api.maps[mapId]);
     //  cgpv.api.maps[mapId].plugins['swiper'].activateForLayer('nonmetalmines/5');
    
    
      // consolle.log("swiper=",cgpv.api.maps[mapId].plugins['swiper']);

  //  cgpv.api.maps[mapId].plugins['swiper'].deActivateAll();
  ////  cgpv.api.maps[mapId].plugins['swiper'].activateForLayer('nonmetalmines/5');
    //   setSwiper(true);
  }
  
  return(
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  <FormGroup aria-label="position">
          <FormLabel component="legend">Map Size in px</FormLabel>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
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
      
      <Button id="handleApplyStateToConfigFile" variant="contained" color="primary" size="small" onClick={handleApplyStateToConfigFile}>
        Apply State to Config File
      </Button>

      <FormControl component="fieldset" sx={{ mt: 4, gap: 3 }}>

        <SingleSelectComplete
          options={CONFIG_FILES_LIST}
          defaultValue={configFilePath}
          applyGrouping={true}
          onChange={(value) => handleConfigFileChange(value)}
          label="Select Configuration File" placeholder="" />

      

         <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { 
           (isEn) ? cgpv.api.maps[mapId].setLanguage('fr') : cgpv.api.maps[mapId].setLanguage('en');
           setEn(!isEn);
          }}
        label="Change Language" placeholder="" />

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
            onChange={(value: any, reason: any) => {
              updateArrayProperty('corePackages', value);
              console.log("calling handle package change",typeof value,value);
              if ((value === "swiper")&& (reason == "selectOption")) {
                console.log("settin gto display layers");
                displayLayers.current = 1;
              }
                handlePackageChange('corePackages', value,reason);
               console.log("calling handle package change reson=",reason);
           
            
              //  handleApplyStateToConfigFile();
            }}
            options={corePackagesOptions}
            label="CorePackages Options" placeholder="" />
        </FormGroup>

         <Divider sx={{ my: 2 }} />
      
        <FormGroup aria-label="Layer List"  >
          {displayLayers.current === 1 ?
          
            <SingleSelectComplete
            options={SwiperPackageOrientation}
            defaultValue={getProperty('corePackagesConfig[0].swiper.orientation')}
              onChange={(value) => {
                updateProperty('corePackagesConfig[0].swiper.orientation', value);
                _.set(configJson, "corePackagesConfig[0].swiper.orientation", value);   // here this changes it
                 handleApplyConfigChanges();
              }}
              label="Swiper Orientation" placeholder="" />
            
            
       
          
            : ''}
          
           <Divider sx={{ my: 2 }} />
          
          {displayLayers.current === 1 ?
          
            <SingleSelectComplete
            options={SwiperPackagekeyboardOffset}
            defaultValue={getProperty('corePackagesConfig[0].swiper.keyboardOffset')}
              onChange={(value) => {
                updateProperty('corePackagesConfig[0].swiper.keyboardOffset', value);
                _.set(configJson, "corePackagesConfig[0].swiper.keyboardOffset", value);   // here this changes it
                 handleApplyConfigChanges();
              }}
              label="Swiper Orientation" placeholder="" />
            
            
       
          
            : ''}
          
          <Divider sx={{ my: 2 }} />
          {
            //  corePackages.some(el => el.value === 'swiper') ?
                   displayLayers.current === 1 ?
            //  swiper ?  refreshe to much
           
            
            //   <SingleSelectComplete
              <PillsAutoComplete
              options={layerOptions}
              //       defaultValue={ _.mapValues( configJson, 'geoviewLayerNa')}
       //      defaultValue={ _.mapValues( configJson, 'geoviewLayerId')}
          defaultValue={ layerOptions}
                //  multiple = "true"
               
                onChange={( value: any, reason: any) => {
         //            console.log("onchange event=" ,event);
     console.log("onchange value=" ,value);

              console.log("onchange reason=" ,reason);

          //          if (reason === 'remove-option') {
        //      console.log(detail.option);
        //    };
                //  console.log("props=", props);
                  updateProperty('map.listOfGeoviewLayerConfig[].geoviewLayerId', value);
                  console.log('laysers=', getProperty('map.listOfGeoviewLayerConfig.geoviewLayerName'));
                  //  cgpv.api.maps[mapId].plugins['swiper'].activateForLayer('nonmetalmines/5');
                  console.log("selceted file value for plugin=",event, value);
                 //   console.log("selceted  value for selected=", target.checked);
               
         /*         value.forEach((element: any) => {
                    let index = layerOptions.indexOf(element);
                    console.log("layer index=", index);
                    if (index !== -1) {
                      if (layerOptions[index].group === "n") {
                        layerOptions[index].group = "y";
                      }
                      else { layerOptions[index].group = "n";
                    }
                    }
                    if (reason === "selectOption") {
                      cgpv.api.maps[mapId].plugins['swiper'].activateForLayer(element);
                    }
                    else if (reason === "removeOption") {
                      console.log('deactivating layer=',element)
                      cgpv.api.maps[mapId].plugins['swiper'].deActivateForLayer(element);
                    }
                  });
               */ 
                   if (reason === "selectOption") {
                     cgpv.api.maps[mapId].plugins['swiper'].activateForLayer(value);
                       _.set(configJson, "corePackagesConfig[0].swiper.layers[0]", value);   // here this changes it
       
                    }
                    else if (reason === "removeOption") {
                      console.log('deactivating layer=',value)
                     cgpv.api.maps[mapId].plugins['swiper'].deActivateForLayer(value);
                            _.omit(configJson, "corePackagesConfig[0].swiper.layers["+value+"]");   // here this changes it
       
                    }


                }}
              
              label="Swiper Layer List" placeholder="" /> 
            //: ''
             : ''
          }
        </FormGroup>

      </FormControl>
    </Box>
     // :''    ,  put this before  //  { getProperty('layerOptions') === 'swiper' ?

  );
  
}