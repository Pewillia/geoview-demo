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
import  { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import{ timeSliderModified,timeSliderDisplay,timeSliderFiltering,timeSliderTemporalDimensionSingleHandle,
  timeSliderTemporalDimensionNearestValue,
  timeSliderTemporalDimensionDisplayTimePrecision,timeSliderDelay,sliderLocked,
  timeSliderTemporalDimensionMinRange,timeSliderDatePrecision,
  SliderReversed,
  aoiModified,eventLoopCounter,SwiperPackageOrientation,SwiperPackagekeyboardOffset,layerOptions,
  componentsOptions, basemapShading, basemapLabelling, footerTabslist, languageOptions, navBarOptions, basemapOptions, appBarOptions, mapInteractionOptions, mapProjectionOptions, zoomOptions, themeOptions, CONFIG_FILES_LIST,
  corePackagesOptions,aoiDisplay,swiperDisplay, GEOVIEW_CORE_URL, Language
} from '@/constants';
import SingleSelectComplete from './SingleSelectAutoComplete';
import { ConfigSaveUploadButtons } from './ConfigSaveUploadButtons';
import { useSnackbar } from '@/providers/snackbarProvider';
import  { Dayjs } from 'dayjs';

export var URL_TO_CONFIGS = `${GEOVIEW_CORE_URL}/configs/navigator/demos/`;

interface timeSliderFuncItem {
    id: number;
    title: string;
    description: string;
    delay:number;
    filtering:boolean;
    locked: boolean;
    reversed: boolean;
    layerPath: string[]; //chnaged from string to array
    isChecked: boolean;  //internal to telll if selected
    tempDimField: String;
  // tempDimDefault1: ListOptionType;  //setp 17
  
    tempDimDefault1: string;  //setp 17
   
    tempDimDefault2: string; 
    
    tempDimDisplayDatePrecision: string,  //setpt 10
    tempDimDisplayTimePrecision : string,  //sept 10
    tempDimUnitSymbol:string,
    tempDimRangeType: String;
    tempDimRange:[],  //added sept 15 to add range t items so can select from pull down list
 
    tempDimRangeStart: string;
    tempDimRangeEnd: string;
    tempDimNearestValues: string;
    tempDimSingleHandle: boolean;
  }

 export   const timeSliderFuncs: timeSliderFuncItem[] = [
  ]

export function MapBuilder() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const { mapId } = cgpvContext;
  const { configJson, handleApplyStateToConfigFile, handleConfigFileChange, handleConfigJsonChange, configFilePath, mapWidth, mapHeight, setMapWidth, setMapHeight } = cgpvContext;
  const [modifiedConfigJson, setModifiedConfigJson] = useState<object>(configJson);
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
  const [aoiRecordIndex, setAoiRecordIndex] = useState(-1);
  const [itemColor, setItemColor] = useState('#1976d2');
 


    const [timeSliderRecord, setTimeSliderRecord] = useState(timeSliderFuncs);
  const [checked, setChecked] = useState(false);
  //const [extentValue, setExtentValue] = useState('');
  //const [extentError, setExtentError] = useState(false);
  const [timeSliderRecordIndex, setTimeSliderRecordIndex] = useState(-1);
  const [open, setOpen] = useState(false);  // added for time diension test
  const [noDisplay, setDisplay] = useState(false);  // added for time diension test
  const [timeSliderChecked, setTimeSliderChecked] = useState(false);
  //const [defaultDate, setDefaultDate] = useState("");

   const [componentKey, setComponentKey] = useState(0);

   //const [componentKey, setComponentKey] = useState(0);
   const [componentKeyCount, setComponentKeyCount] = useState(0);
 

  var m : any =[];  // sept 8var

  // const [value, setValue] = useState<Dayjs | null>(null); //has to be this to work else does get minutes

  function DateTime(field:any) {  // shrink the label

   const [value, setValue] = useState<Dayjs | null>(null); //has to be this to work else does get minute
  
   const handleAccept = (value:any ) => {
    let newMonth=value.month()+1;
      let defaultDate = value.year().toString().padStart(4, '0') + "-" + newMonth.toString().padStart(2, '0') + "-" +
      value.date().toString().padStart(2, '0') + "T" + value.hour().toString().padStart(2, '0') + ":" +
      value.minute().toString().padStart(2, '0')+":"+ value.second().toString().padStart(2, '0')+"Z";
     
     console.log("Dateparameter=",field,field.newValue);
       console.log("defaultDate=",defaultDate);
    eval(field.field.toString()+"="+"defaultDate");
            //        eval(field.field.toString()+"="+"value");
    // forceUpdate();
  //   console.log("datetime value of default=",timeSliderFuncs[2].tempDimDefault1);
     console.log("datetime value of default=",timeSliderRecord[0].tempDimDefault1);
    //  timeSliderRecord[0].tempDimDefault2='1900-01-01T05:00:00Z ';
  let index=0;
      for (let i = 0; i < timeSliderRecord.length; i++) {
        if (timeSliderRecord[i].isChecked) {index= i;break;}
        };
                    let m2 : any =[];
//
         m2.push({ title: '', value: '', group: '' }); // add range
                      m2[0].value = defaultDate;
                      m2[0].title = defaultDate;
                   //   console.log("i3=",i3,"i4=",i4,"tempdim value=",m2[i4].value);
                    //  timeSliderFuncs[i3].tempDimRange.push(m2[i4]);
                      timeSliderRecord[index].tempDimRange.push(m2[0] as never);
              //
    
     //timeSliderRecord[0].tempDimDefault2="";
      const newItems = [...timeSliderRecord];

    //aoiRecord[index].title = event.target.value;

    setTimeSliderRecord(newItems);
      //  setTimeSliderChecked(false);

      // setComponentKey(prevKey => prevKey + 1);
    //setComponentKey(5);  // changes it once 
    setComponentKey(componentKeyCount); 
    setComponentKeyCount(prevCount => prevCount + 1);
    //componentKey =1;
    setIsModified(true);
    forceUpdate();
   }

    const handleOnChange = (value: any) => {
     console.log("Dateparameter=",field,checked,noDisplay);
     eval(field.field.toString()+"="+"value");
     console.log("datetime value of default=",timeSliderFuncs[0].tempDimDefault1);

      let newMonth=value.month()+1;
      let defaultDate1 = value.year().toString().padStart(4, '0') + "-" + newMonth.toString().padStart(2, '0') + "-" +
      value.date().toString().padStart(2, '0') + "T" + value.hour().toString().padStart(2, '0') + ":" +
      value.minute().toString().padStart(2, '0')+":"+ value.second().toString().padStart(2, '0')+"Z";
      console.log("handle on change value=", defaultDate1);
      console.log("time slider record=", timeSliderRecord);
      setValue(value);
    };

    // was just datetime picer bt unable to select minutes  was on eor the other 
      //  <DemoContainer components={['DateTimeRangePicker']}>
    return (
      <LocalizationProvider 
        dateAdapter={AdapterDayjs} 
        adapterLocale="de"
      >
      <DateTimePicker 
          onAccept={ handleAccept}
        value={value}
        onChange={(newValue: any) => {    console.log("datefield=",field);
             console.log("calling variablename=",eval(field));
          setValue(newValue);
           console.log("date change=",newValue);
          handleOnChange(newValue);
        //  forceUpdate();
         }}
        slotProps={{
            layout: {     },
            textField:{  sx: {  //maxHeight: '40px',
               "& fieldset": { border: 'none' }, //removes border works nov 7
            backgroundColor: 'transparent',
            maxWidth: '20px', maxHeight: '0px' , //added nov 10
            '&.Mui-focused fieldset': { border: 'none' },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", 
                   },
                "& .MuiPickersInputBase-root": {
                  border: "none",
                } ,
              '& .MuiInputBase-root': {  display: 'none',
                width: 0,
                overflow: 'hidden',
                padding: 0,
              },
              '& .MuiInputLabel-root': {  display: 'none',
              },
              // Center the icon within the remaining space
              '& .MuiInputAdornment-root': { // display: 'none', // remove icon
                backgroundColor: 'transparent',
                border: 0,
                margin: 0,
                position: 'absolute',
             
                left:10,
                transform: 'translate(-50%, -50%)'
              },
           } }
        }} />
      </LocalizationProvider>
    );
}

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
    //  let m = [];  m defined sa global
      let i3 = 0;
      while (layerOptions.length > 0) {
        layerOptions.pop();
      }
      for (var i in featureInfoLayerSet) {

      try {
           let tempdim = myMap1.layer.getGeoviewLayers()[i3].getTimeDimension();  // changed sept 12

          for (let i4=0; i4 < myMap1.layer.getGeoviewLayers().length ; i4++) //order of getview layer differs from featureset
            { 
              let m= featureInfoLayerSet[i].layerPath;
             if((m.includes(myMap1.layer.getGeoviewLayers()[i4].getLayerPath())))  
              {
                tempdim = myMap1.layer.getGeoviewLayers()[i4].getTimeDimension();
                break;}
            }
           m.push({ title: '', value: '', group: "",range:"" }); // add range
        if (featureInfoLayerSet.hasOwnProperty(i)) {

          if ((typeof (featureInfoLayerSet[i].layerPath ) !== "undefined")
          && (featureInfoLayerSet[i].layerPath.length  !== 0)){

            m[i3].value = featureInfoLayerSet[i].layerPath;
            m[i3].title = featureInfoLayerSet[i].layerName;
          
             m[i3].group = tempdim.default;
            m[i3].range = tempdim.rangeItems.range
            layerOptions.push(m[i3]);
            i3++;
          }
        }
      }
      catch(err) {
  
      }
      forceUpdate;
     }
   } 
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

    if (property === "footerBar.tabs.core") {
      let packages: any = _.get(configJson, property);

      for (var i in packages) { 
        //   Object.values(packages);
        if (packages[i] === "time-slider") {
          // setChecked(true);  // added may 28
          createLayerList();
          if (displayLayers.current === 0) {
            displayLayers.current = 1;
            timeSliderDisplay.current = 1;
            setTimeSliderChecked(true);
            setChecked(true);  // added may 28
           }
           if (timeSliderModified.current === 0) { // like useRef, not modified if reloads

            while (timeSliderFuncs.length > 0) {
              timeSliderFuncs.pop();
            }
              
            let i3 = 0;
        
            let maxlayerId: any = _.get(configJson, "corePackagesConfig[0].time-slider.sliders");

            if (typeof maxlayerId !== "undefined") {
              let maxindex: any = maxlayerId.length;
              for (let i = 0; i < maxindex; i++) {
                let title = 'corePackagesConfig[0].time-slider.sliders[' + i + '].title';
                let description = 'corePackagesConfig[0].time-slider.sliders[' + i + '].description';
                let locked =      'corePackagesConfig[0].time-slider.sliders[' + i + '].locked';
                let reversed =    'corePackagesConfig[0].time-slider.sliders[' + i + '].reversed';
                let layerPath = 'corePackagesConfig[0].time-slider.sliders[' + i + '].layerPaths';
  
                let delay = 'corePackagesConfig[0].time-slider.sliders[' + i + '].delay';
                let filtering = 'corePackagesConfig[0].time-slider.sliders[' + i + '].filtering';
            

                let tempDimField = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.field';
                let tempDimDefaultT1= 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.default[0]';
                let tempDimDefaultT2= 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.default[1]';
                let tempDimFieldUnitSymbol = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.unitSymbol';
                let tempDimRangeType = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.rangeItems.type';
                let tempDimRangeStart = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.rangeItems.range[0]';
                let tempDimRangeEnd = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.rangeItems.range[1]';
                let tempDimNearestValues = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.nearestValues';
                let tempDimSingleHandle = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.singleHandle';
                 
                let  tempDimDisplayDatePrecision = 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.displayPattern[0]';  //setpt 10
                let tempDimDisplayTimePrecision= 'corePackagesConfig[0].time-slider.sliders[' + i + '].timeDimension.displayPattern[1]';  //sept 10
     
            
                let timeSliderJsonTitle = (_.get(configJson,title));
                let timeSliderJsonDescription = (_.get(configJson, description));
                let timeSliderJsonLocked = (_.get(configJson, locked));
                let timeSliderJsonReversed = (_.get(configJson, reversed));
                let timeSliderJsonLayerPath = (_.get(configJson, layerPath));
                let numLayers = timeSliderJsonLayerPath.length;
 
                let timeSliderJsonDelay = (_.get(configJson, delay));
                let timeSliderJsonFiltering = (_.get(configJson, filtering));
              
              
                let timeSliderJsonTempDimField = (_.get(configJson, tempDimField));
                let timeSliderJsonTempDimDefaultT1 = (_.get(configJson, tempDimDefaultT1));
                let timeSliderJsonTempDimDefaultT2 = (_.get(configJson, tempDimDefaultT2));
            
                let timeSliderJsonTempDimUnitSymbol = (_.get(configJson, tempDimFieldUnitSymbol));

                let timeSliderJsonTempDimRangeType = (_.get(configJson, tempDimRangeType));
                let timeSliderJsonTempDimRangeStart = (_.get(configJson, tempDimRangeStart));
                let timeSliderJsonTempDimRangeEnd = (_.get(configJson, tempDimRangeEnd));
           
                let timeSliderJsonTempDimNearestValues = (_.get(configJson, tempDimNearestValues));
                let timeSliderJsonTempDimSingleHandle = (_.get(configJson, tempDimSingleHandle));
                let  timeSliderJsonTempDimDisplayDatePrecision = (_.get(configJson, tempDimDisplayDatePrecision));
                let timeSliderJsontempDimDisplayTimePrecision= (_.get(configJson, tempDimDisplayTimePrecision));

                timeSliderFuncs.push({
                  id: 0, 
                  title :'', description: "", delay:0,
                  filtering:false,
                  locked: false,
                  reversed: false,
                  layerPath:[] ,
                  isChecked: false,
                  tempDimField: "",
                 
                  tempDimDefault1: "" ,
                  tempDimDefault2: "",               
                  tempDimUnitSymbol:"",

                  tempDimRangeType: "",
                  tempDimRangeStart: "",
                  tempDimRangeEnd: "",
             
                  tempDimRange: [],  
                  tempDimNearestValues: "",
                  tempDimSingleHandle: false,
                  tempDimDisplayDatePrecision: "",  
                  tempDimDisplayTimePrecision: "",  

                }); // added april 7 increse array
          
                //add temporarl dimension fields
                timeSliderFuncs[i3].id = i3;
              
                timeSliderFuncs[i3].title = timeSliderJsonTitle;
                timeSliderFuncs[i3].description = timeSliderJsonDescription;
                timeSliderFuncs[i3].locked = timeSliderJsonLocked;
                timeSliderFuncs[i3].reversed =  timeSliderJsonReversed;
                 timeSliderFuncs[i3].delay = timeSliderJsonDelay;
                 timeSliderFuncs[i3].filtering = timeSliderJsonFiltering;
               for (let i = 0; i < numLayers; i++) {
                timeSliderFuncs[i3].layerPath[i]  = timeSliderJsonLayerPath[i] ;
           }   
                //add temporarl dimension fields

                (timeSliderJsonTempDimField === "undefined") ? console.log("tempdim field is undefined") :
                 timeSliderFuncs[i3].tempDimField = timeSliderJsonTempDimField;
                timeSliderFuncs[i3].tempDimDefault1 = timeSliderJsonTempDimDefaultT1;
                timeSliderFuncs[i3].tempDimDefault2 = timeSliderJsonTempDimDefaultT2;
                timeSliderFuncs[i3].tempDimUnitSymbol = timeSliderJsonTempDimUnitSymbol;

                timeSliderFuncs[i3].tempDimRangeType = timeSliderJsonTempDimRangeType;
              
                timeSliderFuncs[i3].tempDimRangeStart = timeSliderJsonTempDimRangeStart;
                timeSliderFuncs[i3].tempDimRangeEnd = timeSliderJsonTempDimRangeEnd;
              
                timeSliderFuncs[i3].tempDimNearestValues = timeSliderJsonTempDimNearestValues;
                timeSliderFuncs[i3].tempDimSingleHandle = timeSliderJsonTempDimSingleHandle;

                timeSliderFuncs[i3].tempDimDisplayDatePrecision = timeSliderJsonTempDimDisplayDatePrecision;  //setpt 10
                timeSliderFuncs[i3].tempDimDisplayTimePrecision = timeSliderJsontempDimDisplayTimePrecision; //sept 10
          
                //  add right and left handles (default values) and upper and lower range values from json file temp dim

                for (let i = 0; i < m.length; i++) {
         //        console.log("time slider layerpath-",timeSliderFuncs[i3].layerPath[0]);
                  
                   // layer path  in feature set set the range adn handles
                  if (m[i].value.includes(timeSliderFuncs[i3].layerPath[0])){ // take 1 st layer path if multiple
                    let m2 : any =[];
                    for (let i4 = 0; i4 < m[i].range.length; i4++) {
                      m2.push({ title: '', value: '', group: '' }); // add range
                      m2[i4].value = m[i].range[i4];
                      m2[i4].title = m[i].range[i4];
                      timeSliderRecord[i3].tempDimRange.push(m2[i4] as never);
                     }
                      m2.push({ title: '', value: '', group: '' }); 
                      // add default values and range to pull down list maybe not in range vakues or
                      //  is not selecteable
                      let index= Number(m[i].range.length );
                      m2[index].value = timeSliderFuncs[i3].tempDimDefault1;
                      m2[index].title = timeSliderFuncs[i3].tempDimDefault1;
                      timeSliderRecord[i3].tempDimRange.push(m2[index] as never);
                      m2.push({ title: '', value: '', group: '' }); 
 
                      index= index+1;
                      m2[index].value = timeSliderFuncs[i3].tempDimDefault2;
                      m2[index].title = timeSliderFuncs[i3].tempDimDefault2;
                      timeSliderRecord[i3].tempDimRange.push(m2[index] as never); 

                      m2.push({ title: '', value: '', group: '' }); 
                   
                      index= index+1;
                      m2[index].value = timeSliderFuncs[i3].tempDimRangeStart;
                      m2[index].title = timeSliderFuncs[i3].tempDimRangeStart;
                       timeSliderRecord[i3].tempDimRange.push(m2[index] as never);
                      m2.push({ title: '', value: '', group: '' }); 

                      index= index+1;
                      m2[index].value = timeSliderFuncs[i3].tempDimRangeEnd;
                      m2[index].title = timeSliderFuncs[i3].tempDimRangeEnd;
                      timeSliderRecord[i3].tempDimRange.push(m2[index] as never);

                      let timesliderrange : any = timeSliderRecord[i3].tempDimRange.filter(
                        (obj :any, index, self) => {  // remove duplicate values from pull down list
                        return index === self.findIndex((o :any) => o.value === obj.value);
                       });
                          timeSliderRecord[i3].tempDimRange =timesliderrange; 
                  }
                }
                i3++;

              } //for loop
            } // index is not  undefined
          } //aoimodified
    
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


   const handleChangeCheckedTimeSlider = (event: any, id: number) => {
    setChecked(event.target.checked);
    console.log("checked handlechange check");
    const newItems = [...timeSliderRecord];
    setTimeSliderRecordIndex(id);
    timeSliderRecord[id].isChecked = event.target.checked;
    setTimeSliderRecord(newItems);
    // have to write record back to the array of loi  write all records back or just changed depending on index
    setIsModified(true);
   };
  

  function handleAddTimeSlider() {
 
   const newList : timeSliderFuncItem[] = timeSliderFuncs.concat({
      id: timeSliderRecord.length + 1,
      isChecked: false,
      title: " ",
      description: " ",
      delay:0,
      filtering:false,
      reversed: false,
      locked: false,
      layerPath: "",
      tempDimField:"time",
      tempDimDefault1: [],
      tempDimDefault2:"",              
      tempDimUnitSymbol:"",
      tempDimRangeStart:"",
      tempDimRangeEnd:'',
      tempDimNearestValues:'',
      tempDimSingleHandle: false,
      tempDimDisplayDatePrecision: '',
      tempDimDisplayTimePrecision:'', //sept 10
      tempDimRangeType:'' ,// sept 10
      tempDimRange:[]// sept 17 to save range from time deimension not display
    } as any);  
    setTimeSliderRecord(newList);
    forceUpdate();
    setIsModified(true);
    setTimeSliderRecordIndex(timeSliderRecordIndex + 1);
  }
  
  function handleSaveTimeSlider() {
    setIsModified(true);
    _.set(modifiedConfigJson, "corePackages", ["time-slider"]);   // here this changes it
    console.log("time slider recrod length=",timeSliderRecord.length);
    _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders',"");// added aug 8,left over trace of 3rd record
    for (let i = 0; i < timeSliderRecord.length; i++) {
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].title', timeSliderRecord[i].title);
      console.log("save title=",i,timeSliderRecord[i].title,_.get(modifiedConfigJson,'corePackagesConfig['+ i +'].time-slider.sliders[i].title'));
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].description', timeSliderRecord[i].description);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].delay', timeSliderRecord[i].delay);
       _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].filtering', timeSliderRecord[i].filtering);   
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].locked', timeSliderRecord[i].locked);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].reversed', timeSliderRecord[i].reversed);
     
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].layerPaths', timeSliderRecord[i].layerPath);
     
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.default[0]', timeSliderRecord[i].tempDimDefault1);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.default[1]', timeSliderRecord[i].tempDimDefault2);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.field', timeSliderRecord[i].tempDimField);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.unitSymbol',timeSliderRecord[i].tempDimUnitSymbol);

      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.rangeItems.type',timeSliderRecord[i].tempDimRangeType);
    
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.rangeItems.range[0]',timeSliderRecord[i].tempDimRangeStart);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.rangeItems.range[1]',timeSliderRecord[i].tempDimRangeEnd);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.nearestValues', timeSliderRecord[i].tempDimNearestValues);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.singleHandle', timeSliderRecord[i].tempDimSingleHandle);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.displayPattern[0]', timeSliderRecord[i].tempDimDisplayDatePrecision);
      _.set(modifiedConfigJson, 'corePackagesConfig[0].time-slider.sliders['+ i +'].timeDimension.displayPattern[1]', timeSliderRecord[i].tempDimDisplayTimePrecision); //sept 10
    };
      timeSliderModified.current = 0;  //changed 10 of june or test 
      handleApplyConfigChanges();
    }

  function handleDeleteTimeSlider() {
    let newItems = timeSliderRecord.filter((item) => item.isChecked !== true);
    console.log("delete new items=", newItems);
    for (let i = 0; i < newItems.length; i++) {
      timeSliderFuncs[i] = newItems[i];
      console.log("timeSliderFuncs index=", i, timeSliderFuncs[i]);
             //     _.set(modifiedConfigJson, 'corePackagesConfig[0].aoi-panel.aoiList[' + i + '].aoiTitle', aoiRecord[i].title);
      };
       //setTimeSliderRecord([]);             // aug 8 works otherwise 
      setTimeSliderRecord([...newItems]);
      setTimeSliderRecordIndex(timeSliderRecordIndex-1);
    
      timeSliderModified.current = 1;
      forceUpdate();
      setIsModified(true);
      console.log("time slider record deleted=", timeSliderRecord);
    }

    const handleItemChangeTitleTimeSlider = (index: any, event: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change ,index=", index, event.target.value);
      timeSliderRecord[index].title = event.target.value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };
  
  const handleItemChangeDescriptionTimeSlider = (index: any, event: any,) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change ,index=", index, event.target.value);
      timeSliderRecord[index].description = event.target.value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };

   const handleItemChangeFilteringTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change ,index=", index, value);
      timeSliderRecord[index].filtering = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
  };

 const handleItemChangeDelayTimeSlider = ( index: any,value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change ,index=", index,value);
      timeSliderRecord[index].delay = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index,value, timeSliderRecord);
  };


   const handleItemChangeDimDefault1TimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change ,index=", index, value);
      timeSliderRecord[index].tempDimDefault1 = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
     // console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };

   const handleItemChangeDimDefault2TimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
     // console.log("handle item change ,index=", index, event.target.value);
      timeSliderRecord[index].tempDimDefault2 = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
     // console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };

  const handleItemChangeRangeTypeTimeSlider = (index: any, event: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
      console.log("handle item change range type ,index=", index, event.target.value);
      timeSliderRecord[index].tempDimRangeType = event.target.value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };

    const handleItemChangeRangeStartTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
    //  console.log("handle item change ,index=", index, value);
      timeSliderRecord[index].tempDimRangeStart = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
     // console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };

  const handleItemChangeRangeEndTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      const newItems = [...timeSliderRecord];
    //  console.log("handle item change ,index=", index, value);
      timeSliderRecord[index].tempDimRangeEnd = value;
      setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
     // console.log("setting title, index=", index, event.target.value, timeSliderRecord);
  };
  
  const handleItemChangeLockedTimeSlider = (index: any, value: any) => {
    timeSliderModified.current = 1;
    //  const newItems = [...timeSliderRecord];
    // console.log("handle item change locked ,index=", index, event);
      // console.log("handle item change locked ,index=", index, event.target.value);
    
     timeSliderRecord[index].locked = value;//(event === "locked") ? true : false;
   
      //setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
    
  };
  const handleItemChangeNearestValueTimeSlider = (index: any, value: any) => {
    timeSliderModified.current = 1;
    //  const newItems = [...timeSliderRecord];
    // console.log("handle item change locked ,index=", index, event);
      // console.log("handle item change locked ,index=", index, event.target.value);
     timeSliderRecord[index].tempDimNearestValues = value;//(event === "locked") ? true : false;
      //setTimeSliderRecord(newItems);
      // have to write record back to the array of loi  write all records back or just changed depending on index
      setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
    
  };
  
  const handleItemChangeReversedTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      timeSliderRecord[index].reversed = value;//(event === "locked") ? true : false;
      setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
    };

     const handleItemChangeDatePrecisionTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      timeSliderRecord[index].tempDimDisplayDatePrecision = value;//(event === "locked") ? true : false;
      setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
    };

     const handleItemChangeTimePrecisionTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
       timeSliderRecord[index].tempDimDisplayTimePrecision = value;//(event === "locked") ? true : false;
       setIsModified(true);
      console.log("setting title, index=", index, value, timeSliderRecord);
    };

    const handleItemChangeSingleHandleTimeSlider = (index: any, value: any) => {
      timeSliderModified.current = 1;
      timeSliderRecord[index].tempDimSingleHandle = value;//(event === "locked") ? true : false;
      setIsModified(true);
     };


     const handleItemChangeFileTimeSlider = (index: any, event: any) => {
      timeSliderModified.current = 1;
      timeSliderRecord[index].layerPath = event.target.value;
      forceUpdate();
      setIsModified(true);
  };

  const handleChangeTimeSlider = () => {
    console.log(" in handle change");
    setChecked((prev) => !(prev));
    setTimeSliderChecked((prev) => !(prev));

  };
           
  return(
    <Box sx={{ display: 'flex', flexDirection: 'column'        // enable both horizontal and vertical resize
       }}>
      <FormControl component="fieldset" sx={{ mt: 1, gap: 3 }}>
        <SingleSelectComplete
          options={languageOptions}
          defaultValue={(isEn) ? 'en' : 'fr'}
          onChange={(event) => { const myMap = cgpv.api.getMapViewer(mapId);
           (isEn) ? myMap.setLanguage('fr', true) : myMap.setLanguage('en', true);
           (isEn) ? Language.english = false : Language.english= true;
           setEn(!isEn);
          }}
        label="Change Language" placeholder="" 
        disable={false} />
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
          label="Select Configuration File" placeholder=""
          disable={false} />
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
          label="Display Theme" placeholder=""
          disable={false} />

        <SingleSelectComplete
          options={mapInteractionOptions}
          defaultValue={getProperty('map.interaction')}
          onChange={(value) => updateProperty('map.interaction', value)}
          label="Map Interaction" placeholder="" 
          disable={false}/>

        <SingleSelectComplete
          options={basemapOptions}
          defaultValue={getProperty('map.basemapOptions.basemapId')}
          onChange={(value) => updateProperty('map.basemapOptions.basemapId', value)}
          label="Base Map" placeholder="" 
          disable={false}/>

        <SingleSelectComplete
          options={basemapShading}
          defaultValue={Boolean(getProperty('map.basemapOptions.shaded')) ? 'true':'false' }
          onChange={(value) => {
            updateProperty('map.basemapOptions.shaded', JSON.parse(value)); 
          }}
          label="Base Map Shaded" placeholder=""
          disable={false} />

         <SingleSelectComplete
          options={basemapLabelling}
          defaultValue={Boolean(getProperty('map.basemapOptions.labeled')) ? 'true':'false' }
          onChange={(value) => updateProperty('map.basemapOptions.labeled', JSON.parse(value))}
          label="Base Map Labeled" placeholder=""
          disable={false} />

        <FormGroup aria-label="position">
          <FormLabel component="legend">Zoom Levels</FormLabel>

            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.minZoom')}
                onChange={(value) => updateProperty('map.viewSettings.minZoom', value)}
                label="Min Zoom" placeholder="" 
                disable={false}
                />
            </FormControl>
            <FormControl>
              <SingleSelectComplete
                options={zoomOptions}
                defaultValue={getProperty('map.viewSettings.maxZoom')}
                onChange={(value) => updateProperty('map.viewSettings.maxZoom', value)}
                label="Max Zoom" placeholder="" 
                disable={false}/>
            </FormControl>
         </FormGroup>

        <FormGroup aria-label="map projection">
          <SingleSelectComplete
            options={mapProjectionOptions}
            defaultValue={getProperty('map.viewSettings.projection')}
            onChange={(value) => updateProperty('map.viewSettings.projection', value)}
            label="Map Projection" placeholder=""
            disable={false} />
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

                if ((selectedvalue === "time-slider") && (reason == "selectOption")) {
                  setIsModified(true);
                  setChecked(true);
                  console.log(" selected time slider");
                  displayLayers.current = 1;
                  console.log("display layers=",displayLayers.current);
                  createLayerList();
                  handlePackageChange('corePackages', value, reason, selectedvalue);
                  setChecked(true);
                }
                else if ((selectedvalue === "time-slider") && (reason == "removeOption")) {
                  displayLayers.current = 0;
                   _.set(modifiedConfigJson, "corePackages", []);   
                   _.set(configJson, "corePackages", []);   
                  setChecked(false);
                  setIsDisabled(true);
                 }
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
                 disable={false}
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
              disable={false}
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
            <Tooltip title="zoom to location,map window will be extent, click create extent button">
              <Button onClick={handleExtent}
               variant="contained"
               color="primary"
              size="small">
                Create extent
              </Button>
              </Tooltip>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: "1px solid #e1e1e1",
           //     overflow: 'auto',
                 '&::-webkit-scrollbar': { width : 50 }
             }}>

              <Stack direction={{ xs: 'column', sm: 'column' }} spacing={3}>

                <List style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", borderCollapse: 'collapse'}}>

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
 
             <FormGroup aria-label="Layer List"  >
          {timeSliderDisplay.current === 1 ?
               
              <FormControlLabel sx={{
                justifyContent: 'flex-end',
                alignItems: 'baseline', color: 'primary'
              }}
                label="Time Slider List"
                control={<Switch checked={timeSliderChecked} onChange={handleChangeTimeSlider} />}
                labelPlacement="start"
              />
              : ''}
            
            <Collapse in={timeSliderChecked}>
              <Button onClick={handleAddTimeSlider}
                variant="contained" color="primary" size="small"
              >
                Add
              </Button>
            
              <Tooltip title="Select item(s) using item checkbox">               
                 <Button onClick={handleDeleteTimeSlider}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Delete
                </Button>
              </Tooltip>

              <Button onClick={handleSaveTimeSlider}
                variant="contained" color="primary" size="small"
              >
                Save
              </Button>
          
              <Box justifyContent="flex-start" sx={{alignItems: 'left',width: "320px",
                display: 'flex', flexDirection: 'column', gap: 0, border: "1px solid #e1e1e1",
              }}>

              <PillsAutoComplete
                options={layerOptions}
                defaultValue={getProperty('corePackagesConfig[0].time-slider.layers')}
                onChange={( value: any, reason: any,value2) => {
                  updateProperty('corePackagesConfig[0].swiper.layers', value);
                  if (reason === "selectOption") {
                    updateArrayProperty('corePackagesConfig[0].swiper.layers', value);
                    setIsModified(true);
           
                    if (typeof timeSliderRecord[timeSliderRecordIndex] !== "undefined") {
   
                      timeSliderRecord[timeSliderRecordIndex].layerPath = value;
                      for (let i = 0; i < layerOptions.length; i++) {
                        if (value.includes(layerOptions[i].value)) {
                          timeSliderRecord[timeSliderRecordIndex].title = layerOptions[i].title as string;
                          for (let i2 = 0; i2 < m.length; i2++) {
                            if (value.includes(m[i2].value)) {
                              let m2=[];
                              while (timeSliderTemporalDimensionMinRange.length > 0) {
                                timeSliderTemporalDimensionMinRange.pop();
                              };

                              for (let i3 = 0; i3 < m[i2].range.length; i3++) {
                                m2.push({ title: '', value: '', group: '' }); // add range
                                m2[i3].value = m[i2].range[i3];
                                m2[i3].title = m[i2].range[i3];

                                timeSliderTemporalDimensionMinRange.push(m2[i3] as never);
                                timeSliderRecord[timeSliderRecordIndex].tempDimRange.push(m2[i3] as never);
                              }
                              forceUpdate; 
                            };
                          }
                        }
                     }
                 };
                }
                  else if (reason === "removeOption") {
                    updateArrayProperty('corePackagesConfig[0].swiper.layers', value);                       
                }  
                }}
                
                  label="Time enabled Layers" placeholder="" />  
                   </Box>

                <Stack direction={{ xs: 'column', sm: 'column' }} spacing={0}
                  style={{
                    flexDirection: "column",
                    borderCollapse: 'collapse', marginLeft: '0px' ,left:'0',
                    maxWidth: '500px'
                   }} >
                      
                  <List style={{alignItems: 'flex-start',
                    display: "flex",
                    flexDirection: "column",
                    borderCollapse: 'collapse', 
                    marginLeft: '0px' ,left:'0',
                    maxWidth: '500px', minWidth: '360px'
                  }}>
             
                    {timeSliderRecord.map((item, index) => (
                    
                      <ListItem key={index} style={{ alignItems: 'flex-start',
                        display: 'flex', flexDirection: 'column',left:'0',
                        border: '1px solid black', borderStyle: 'solid', minWidth: '360px'
                        }}>
                       <Box sx={{ display: 'flex', minWidth: '320px',flexDirection: 'row', mt: 0, gap: 1,pl: 0,}} justifyContent="center">
                         <Tooltip  title="Select record to modiify or delete">
                           <input style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}} 
                            type="checkbox"
                            className="form-check-input"
                            onChange={(event) => handleChangeCheckedTimeSlider(event, index)}
                          />
                         </Tooltip>
                       </Box>

                        <TextField style={{ display: 'flex', flexDirection: 'column',
                          borderStyle: 'solid', maxWidth: '320px', maxHeight: '40px',
                          minWidth: '320px', minHeight: '40px', marginLeft: '1px' 
                          }}
                          label="Title"
                          InputLabelProps={{shrink: true}}
                          value={item.title}
                          onChange={(event) => handleItemChangeTitleTimeSlider(index, event)} />
                       
                         <Divider sx={{ my: 2 }} />
                      
                        <TextField style={{ display: 'flex',
                          flexDirection: 'column', maxHeight: '40px', maxWidth: '360px',
                          minWidth: '320px', minHeight: '40px', borderStyle: 'solid'
                          }}
                          label="description"
                          value={item.description}
                          sx={{ }}
                          InputLabelProps={{shrink: true}}
                          onChange={(event) => handleItemChangeDescriptionTimeSlider(index, event)} />
                         <Divider sx={{ my: 2 }} />

                        <SingleSelectComplete
                          options={timeSliderDelay}
                          defaultValue={item.delay}
                          onChange={(value) => handleItemChangeDelayTimeSlider(index, value)} 
                          disable={false}
                          label="Delay" placeholder=""
                        ></SingleSelectComplete>

                        <Divider sx={{ my: 1 }} />

                        <SingleSelectComplete
                          options={timeSliderFiltering}
                          defaultValue={Boolean(item.filtering) ? 'true' : 'false'}
                          onChange={(value) => handleItemChangeFilteringTimeSlider(index, value)} 
                          disable={false}
                          label="Filtering" placeholder=""
                        ></SingleSelectComplete>

                         <Divider sx={{ my: 1 }} />

                        <SingleSelectComplete
                           options={sliderLocked}
                           defaultValue={Boolean(item.locked) ? 'true' : 'false'}
                           onChange={(event) => handleItemChangeLockedTimeSlider(index, event)} 
                           disable={false}
                          label="locked" placeholder=""
                        ></SingleSelectComplete>

                        <Divider sx={{ my: 1 }} />

                         <SingleSelectComplete
                           options={SliderReversed}
                           defaultValue={Boolean(item.reversed) ? 'true' : 'false'}
                           onChange={(event) => handleItemChangeReversedTimeSlider(index, event)} 
                           disable={false}
                           label="reversed" placeholder=""
                        ></SingleSelectComplete>

                        <Divider sx={{ my: 2 }} />

                        <Button onClick={() => {
                          if (item.tempDimField !== null) {
                            setOpen(!open)
                          }
                          else {
                            setDisplay(false)
                          }
                        }}
                          disabled={(item.tempDimField === undefined) ? true :false}
                        >Temporal Dimension Fields (optional)</Button>
                        <Collapse in={open}>
                          <FormGroup aria-label="position">
                            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 4,pl: 0}}>
                             <TextField style={{ display: 'flex', 
                               color: (item.tempDimField === null) ? "grey" :"",
                               flexDirection: 'column', maxHeight: '20px', maxWidth: '320px',
                               minWidth: '320px', minHeight: '20px', borderStyle: 'solid'
                               }}
                               disabled={(item.tempDimField === undefined) ? true :false}
                               label="Temporal Dimension Field"
                               InputLabelProps={{ shrink: true }}
                               defaultValue={item.tempDimField}
                               onChange={(event) => handleItemChangeUrl(index, event)} />
                            </Box>
                          </FormGroup>

                          <Divider sx={{ my: 2 ,display:"none"}} />

                          <FormGroup aria-label="position">
                            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 6, gap: 1,pl: 0}}>
                              <Tooltip  title="Minimum value of the range ,left handle">
                                <SingleSelectComplete
                                  key={componentKey}
                                  options={item.tempDimRange}
                                  defaultValue={item.tempDimDefault1}
                                  onChange={(value) => {handleItemChangeDimDefault1TimeSlider(index,value)}}
                                  label="Minimum range value, left handle" placeholder=""
                                  disable={(item.tempDimField === undefined) ? true :false}
                                  ></SingleSelectComplete> 
                                 </Tooltip>  
                               <DateTime {...{"field":"timeSliderRecord["+index+"].tempDimDefault1"}} />
                             </Box>
                          </FormGroup>

                        <Divider sx={{ my: 2 ,display:"none"}} />

                      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>
                        <SingleSelectComplete
                           key={componentKey}
                            options={item.tempDimRange}
                            defaultValue={item.tempDimDefault2 }
                            onChange={(value) => {handleItemChangeDimDefault2TimeSlider(index,value)}}
                            label="Maximum range value, right handle" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}
                          ></SingleSelectComplete>
                          <DateTime {...{"field":"timeSliderRecord["+index+"].tempDimDefault2"}} />
                        </Box>

                         <Divider sx={{ my: 2 ,display:"none"}} />

                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>
                        
                         <SingleSelectComplete
                            key={componentKey}
                            options={item.tempDimRange}
                            defaultValue={item.tempDimRangeStart}   
                            onChange={(value) => {{handleItemChangeRangeStartTimeSlider(index,value)}}}
                            label="Slider Range Start" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}
                          ></SingleSelectComplete>
                          <DateTime {...{"field":"timeSliderRecord["+index+"].tempDimRangeStart"}} />
                          </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>
                          <SingleSelectComplete
                            key={componentKey}
                            options={item.tempDimRange}
                            defaultValue={item.tempDimRangeEnd}
                            onChange={(value) => {handleItemChangeRangeEndTimeSlider(index,value)}}
                            label="Slider Range End" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}
                          ></SingleSelectComplete>

                            <DateTime {...{"field":"timeSliderRecord["+index+"].tempDimRangeEnd"}} />
                           </Box>

                        <Divider sx={{ my: 2,display:"none" }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>

                        <SingleSelectComplete
                            options={timeSliderTemporalDimensionNearestValue}
                            defaultValue={item.tempDimNearestValues}
                            onChange={(value) => {handleItemChangeNearestValueTimeSlider(index,value)}}
                            label="Nearest Value" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}
                          ></SingleSelectComplete>
                          </Box>

                          <Divider sx={{ my: 2,display:"none" }} />
                             <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>

                          <SingleSelectComplete
                            options={timeSliderDatePrecision}
                            defaultValue={item.tempDimDisplayDatePrecision}
                            onChange={(value) => {handleItemChangeDatePrecisionTimeSlider(index,value);}}
                            label="Date Precision" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}
                          ></SingleSelectComplete>
                          </Box>
 
                        <Divider sx={{ my: 2 ,display:"none"}} />
                       <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>
                          <SingleSelectComplete
                            options={timeSliderTemporalDimensionDisplayTimePrecision}
                            defaultValue={item.tempDimDisplayTimePrecision}
                            onChange={(value) => {handleItemChangeTimePrecisionTimeSlider(index,value)}}
                            label="Time Precision" placeholder=""
                            disable={(item.tempDimField === undefined) ? true :false}     
                          ></SingleSelectComplete>
                        </Box>

                      <Divider sx={{ my: 2,display:"none" }} />
                       <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1,pl: 0}}>

                        <SingleSelectComplete  
                          options={timeSliderTemporalDimensionSingleHandle}
                          defaultValue={Boolean(item.tempDimSingleHandle) ? 'true' : 'false'}
                          onChange={(value) => {handleItemChangeSingleHandleTimeSlider(index,value)}}
                          label="Single Handle" placeholder=""
                          disable={(item.tempDimField === undefined) ? true :false}
                         ></SingleSelectComplete>
                        </Box>

                        <Divider sx={{ my: 2,display:"none" }} />

                         <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, gap: 1}}>
                           <TextField style={{
                            display: 'flex', flexDirection: 'column', maxHeight: '20px', maxWidth: '320px',
                            minWidth: '320px', minHeight: '20px', borderStyle: 'solid'}}
                            label="Range Type"
                            InputLabelProps={{shrink: true}}
                            value={item.tempDimRangeType}
                            disabled ={(item.tempDimField === undefined) ? true :false}
                            onChange={(value) => handleItemChangeRangeTypeTimeSlider(index,value)} />
                        </Box>

                        </Collapse>

                        <Divider sx={{ my: 3 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 0, gap: 0}}>
                          <TextField style={{
                           display: 'flex', flexDirection: 'column', maxHeight: '20px', maxWidth: '320px',
                           minWidth: '320px', minHeight: '20px', borderStyle: 'solid'}}
                           label="UnitSymbol"
                           InputLabelProps={{shrink: true}}
                           value={item.tempDimUnitSymbol}
                           disabled ={(item.tempDimField === undefined) ? true :false}
                          onChange={(event) => handleItemChangeUrl(index, event)} />
                        </Box>

                        <Divider sx={{ my: 2, display:"none"}} />

                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 6, gap: 1}}>
                          <TextField style={{ display: 'flex', flexDirection: 'column', maxHeight: '40px',
                            minWidth: '320px', minHeight: '40px', maxWidth: '320px',
                            borderStyle: 'solid'}}
                            label="Layer path"
                            InputLabelProps={{shrink: true}}  
                            value={item.layerPath}  
                            onKeyDown={handleKeyDownExtent}  // called when return key is pressed
                            onChange={(event) => handleItemChangeFileTimeSlider(index, event)} 
                           disabled={(item.tempDimField === undefined) ? true :false}
                          />
                          </Box>
                          <br></br>

                      </ListItem>

                    ))}
                  </List>
                  
                </Stack>

              
        
              <Divider sx={{ my: 2 }} />

            </Collapse>
          
          </FormGroup>

      </FormControl>
    </Box>
  );
}