import _ from 'lodash';
import { ListOptionType } from './types';

export const DEFAULT_DISPLAY_LANGUAGE = 'en';
export const DEFAULT_DISPLAY_THEME = 'geo.ca';
export const DEFAULT_DISPLAY_PROJECTION = 3978;
export const DEFAULT_MAP_WIDTH = '1074px';
export const DEFAULT_MAP_HEIGHT = ((window.innerHeight - (64 + 48 + 10 )).toString() + "px");
export const DEFAULT_CONFIG_FILE = '01-basemap-LCC-TLS.json';
export const eventLoopCounter = { current: 0 };
export const aoiModified = { current: 0 };
export const aoiDisplay = { current: 0 };
export const swiperDisplay = { current: 0 };
export const Language = { english: true };  // save language state
export const panelSize= {current: 70};
export const DEFAULT_LEFT_PANEL_MIN_WIDTH =  20 ;
export const DEFAULT_LEFT_PANEL_MAX_WIDTH =  50 ;
export const DEFAULT_LEFT_PANEL_WIDTH =  20 ;
export const DEFAULT_RIGHT_PANEL_MIN_WIDTH =  50 ;
export const DEFAULT_RIGHT_PANEL_MAX_WIDTH =  71 ;
export const DEFAULT_RIGHT_PANEL_WIDTH =  71 ;
export const drawerModified = { current: 0 };
export const drawerDisplay = { current: 0 };
export const currentTab= {current: 0 };
export const colorClickedOutside= { current: false };
export const colorClickedOutside2= { current: false };


export const DEFAULT_CONFIG = {
  map: {
    interaction: 'dynamic',
    viewSettings: {
      projection: 3978,
    },
    basemapOptions: {
      basemapId: 'transport',
      shaded: false,
      labeled: true,
    },
    listOfGeoviewLayerConfig: [
      {
        geoviewLayerId: 'wmsLYR1',
        geoviewLayerName: {
          en: 'earthquakes',
          fr: 'earthquakes',
        },
        metadataAccessPath: {
          en: 'https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/earthquakes_en/MapServer/',
          fr: 'https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/earthquakes_en/MapServer/',
        },
        geoviewLayerType: 'esriDynamic',
        listOfLayerEntryConfig: [
          {
            layerId: '0',
          },
        ],
      },
    ],
  },
  components: ['overview-map'],
  footerBar: {
    tabs: {
      core: ['legend', 'layers', 'details', 'data-table'],
    },
  },
  corePackages: [],
  theme: 'geo.ca',
};

export const GEOVIEW_CORE_URL = 'https://canadian-geospatial-platform.github.io/geoview/public';

export const CONFIG_FILES_LIST: ListOptionType[] = [
  { value: `00-basic-footer-appbar-combo.json`, title: 'Basic footer appbar combo', group: 'Basic' },
  { value: `01-basemap-LCC-TLS.json`, title: 'Basemap LCC Transport-Labeled-Shaded', group: 'Basemaps' },
  { value: `02-basemap-LCC-SL.json`, title: 'Basemap LCC Simple-Labeled (overview map hide on zoom 7 and lower)', group: 'Basemaps' },
  { value: `03-projection-WM.json`, title: 'Basemap WM', group: 'Basemaps' },
  { value: `04-restrict-zoom.json`, title: 'Restricted zoom [4, 8]', group: 'Navigator' },
  { value: `05-max-extent-override.json`, title: 'Max extent override', group: 'Navigator' },
  { value: `06-zoom-layer.json`, title: 'Zoom on layer extent', group: 'Navigator' },
  { value: `07-layer-zoom-levels.json`, title: 'Zoom on layer levels', group: 'Navigator' },
  { value: `08-all-layer-zoom-levels.json`, title: 'Zoom on all layer zoom levels', group: 'Navigator' },
  { value: `09-basic-footer-layers-tab.json`, title: 'Basic map with footer layers tab', group: 'Basic' },
  { value: `10-basic-appbar-data-table-tab.json`, title: 'Basic map with app bar data table tab', group: 'Basic' },
  { value: `11-package-time-slider.json`, title: 'Package time slider', group: 'Packages' },
  { value: `12-package-time-slider-custom.json`, title: 'Package custom time slider', group: 'Packages' },
  { value: `13-package-geochart.json`, title: 'Package geochart', group: 'Packages' },
  { value: `14-package-swiper.json`, title: 'Package swiper', group: 'Packages' },
  { value: `15-package-drawer.json`, title: 'Package drawer', group: 'Packages' },
  { value: `16-package-area-of-interest.json`, title: 'Package Area of interest', group: 'Packages' },
  { value: `17-package-custom-legend.json`, title: 'Package - Custom legend -', group: 'Packages' },
  { value: `18-global-settings.json`, title: 'Layer - Global settings -', group: 'Packages' },
  { value: `01-all-layers.json`, title: 'All Layer Types', group: 'Layer Types' },
  { value: `02-csv.json`, title: 'Layer - CSV -', group: 'Layer Types' },
  { value: `03-esri-dynamic.json`, title: 'Layer - ESRI Dynamic -', group: 'Layer Types' },
  { value: `04-esri-dynamic-projections.json`, title: 'Layer - ESRI Dynamic Projections-', group: 'Layer Types' },
  { value: `06-esri-feature.json`, title: 'Layer - ESRI Feature-', group: 'Layer Types' },
  { value: `08-esri-image.json`, title: 'Layer - ESRI Image-', group: 'Layer Types' },
  { value: `10-geojson.json`, title: 'Layer - GeoJSON -', group: 'Layer Types' },
  { value: `11-geojson-multi.json`, title: 'Layer - GeoJSON MutiPolygon -', group: 'Layer Types' },
  { value: `13-geopackages.json`, title: 'Layer - Geopackages -', group: 'Layer Types' },
  { value: `14-ogc-feature-api.json`, title: 'Layer - OGC Feature API -', group: 'Layer Types' },
  { value: `16-shapefile.json`, title: 'Layer - Shapefile -', group: 'Layer Types' },
  { value: `17-static-image.json`, title: 'Layer - Static Image -', group: 'Layer Types' },
  { value: `19-vector-tile.json`, title: 'Layer - Vector Tile -', group: 'Layer Types' },
  { value: `20-wfs.json`, title: 'Layer - WFS -', group: 'Layer Types' },
  { value: `22-wkb.json`, title: 'Layer - WKB -', group: 'Layer Types' },
  { value: `23-wms-layer.json`, title: 'Layer - WMS -', group: 'Layer Types' },
  { value: `25-xyz-tile.json`, title: 'Layer - XYZ Tile -', group: 'Layer Types' },
  { value: `27-geocore.json`, title: 'Layer - Geocore -', group: 'Geocore' },
  { value: `28-geocore-custom.json`, title: 'Layer - Geocore Custom-', group: 'Geocore' },
  { value: `29-geocore-custom-inline-config.json`, title: 'Layer - Geocore Custom Inline-', group: 'Geocore' },
  { value: `30-geocore-duplicates.json`, title: 'Layer - Geocore Duplicates-', group: 'Geocore' }
]

export const basemapOptions: ListOptionType[] = [
  { title: 'Transport', value: 'transport' },
  { title: 'Simple', value: 'simple' },
  { title: 'Open Street Map', value: 'osm' },
  { title: 'Imagery', value: 'imagery' }
];

export const basemapShading: ListOptionType[] = [
  { title: 'shaded', value: 'true' },
  { title: 'unshaded', value: 'false' }
];

export const basemapLabelling: ListOptionType[] = [
  { title: 'labelled', value: 'true' },
  { title: 'unlabelled', value: 'false' }
];

export const mapProjectionOptions: ListOptionType[] = [
  { title: 'LCC', value: 3978 },
  { title: 'Web Mercator', value: 3857 }
];

export const mapInteractionOptions: ListOptionType[] = [
  { title: 'Static', value: 'static' },
  { title: 'Dynamic', value: 'dynamic' }
];

export const componentsOptions: ListOptionType[] = [
  { title: 'North Arrow', value: 'north-arrow' },
  { title: 'Overview Map', value: 'overview-map' }
];

export const footerTabslist: ListOptionType[] = [
  { title: 'Legend', value: 'legend' },
  { title: 'Layers', value: 'layers' },
  { title: 'Details', value: 'details' },
  { title: 'Data Table', value: 'data-table' }
];

export const footerTabsList2: ListOptionType[] = [
  { title: 'Time Slider', value: 'time-slider' },
  { title: 'Geochart', value: 'geochart'},
  { title: 'Legend', value: 'legend', group:"1" },
  { title: 'Layers', value: 'layers', group:"1" },
  { title: 'Details', value: 'details', group:"1" },
  { title: 'Data Table', value: 'data-table', group:"1"}
];

export const appBarOptions: ListOptionType[] = [
  { title: 'Legend', value: 'legend' },
  { title: 'Layers', value: 'layers' },
  { title: 'Details', value: 'details' },
  { title: 'Data Table', value: 'data-table' },
  { title: 'Geolocator', value: 'geolocator' },
  { title: 'Export', value: 'export' }
];

export const appBarOptions2: ListOptionType[] = [
  { title: 'Area-of-Interest', value: 'aoi-panel' }
];

export const navBarOptions: ListOptionType[] = [
  { title: 'Zoom', value: 'zoom' },
  { title: 'Fullscreen', value: 'fullscreen' },
  { title: 'Home', value: 'home' },
  { title: 'Location', value: 'location' },
  { title: 'Basemap Select', value: 'basemap-select' }
];

export const navBarOptions2: ListOptionType[] = [
  { title: 'Draw', value:'drawer' },
];

export const themeOptions: ListOptionType[] = [
  { title: 'geo.ca', value: 'geo.ca' },
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' }
];

export const languageOptions: ListOptionType[] = [
  { title: 'English', value: 'en' },
  { title: 'French', value: 'fr' }
];

export const corePackagesOptions: ListOptionType[] = [
  { title: 'Swiper', value: 'swiper' },
];

export const DrawerPackageActiveGeometry: ListOptionType[] = [
  { title: 'Point', value: 'Point' },
  { title: 'Text', value: 'Text' },
  { title: 'LineString', value: 'LineString' },
  { title: 'Polygon', value: 'Polygon' },
  { title: 'Rectangle', value: 'Rectangle' },
  { title: 'Circle', value: 'Circle' },
  { title: 'Star', value: 'Star' }
];

export const DrawerPackageGeometryTypes: ListOptionType[] = [
  { title: 'Point', value: 'Point' },
  { title: 'Text', value: 'Text' },
  { title: 'LineString', value: 'LineString' },
  { title: 'Polygon', value: 'Polygon' },
  { title: 'Rectangle', value: 'Rectangle' },
  { title: 'Circle', value: 'Circle' },
  { title: 'Star', value: 'Star' }
];

export const drawerHideMeasurements: ListOptionType[] = [
  { title: 'True', value: 'true' },
  { title: 'False', value: 'false'}
];

export const DrawerPackageVersion: ListOptionType[] = [
  { title: '1.0', value: "1.0" }
];

export const CorePackagesConfig: ListOptionType[] = [
  { title: 'Swiper', value: 'swiper' },
];

export const SwiperPackageOrientation: ListOptionType[] = [
  { title: 'Vertical', value: 'vertical' },
  { title: 'Horizontal', value: 'horizontal' }
];

export const SwiperPackagekeyboardOffset: ListOptionType[] = [
  { title: '10', value: 10 },
  { title: '20', value: 20 }
];

export const SwiperPackageLayers: ListOptionType[] = [
];

export const layerOptions: ListOptionType[] = [
];

export const zoomOptions: ListOptionType[] = _.range(0, 51).map((value) => ({ title: value.toString(), value }));