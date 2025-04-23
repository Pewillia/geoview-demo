import { ApiFuncItem } from "./ApiFunctionsTab";

const apiFuncs: ApiFuncItem[] = [
  {
    group: "General",
    description: "Reload with current state",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.reloadWithCurrentState();
    }
  },
  {
    group: "General",
    description: "Reload map",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.reload();
    }
  },
  {
    group: "General",
    description: "Remove map",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.remove();
    }
  },
  {
    group: "Language",
    description: "Set language to english",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setLanguage('en');
    }
  },
  {
    group: "Language",
    description: "Set language to french",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setLanguage('fr');
    }
  },
  {
    group: "Theme",
    description: "Set theme to geo.ca",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setTheme('geo.ca');
    }
  },
  {
    group: "Theme",
    description: "Set theme to light",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setTheme('light');
    }
  },
  {
    group: "Theme",
    description: "Set theme to dark",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setTheme('dark');
    }
  },

  {
    group: "Notifications",
    description: "Add info notification",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.addNotificationMessage('this is an info notification');
    }
  },
  {
    group: "Notifications",
    description: "Add warning notification",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.addNotificationWarning('this is an warning notification');
    }
  },
  {
    group: "Notifications",
    description: "Add error notification",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.addNotificationError('this is an error notification');
    }
  },
  {
    group: "Notifications",
    description: "Add success notification",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.addNotificationSuccess('this is a success notification title');
    }
  },
  {
    group: "Notifications",
    description: "Show info snack-bar",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showMessage('this is an info snack-bar');
    }
  },
  {
    group: "Notifications",
    description: "Show warning snack-bar",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showWarning('this is an warning snack-bar');
    }
  },
  {
    group: "Notifications",
    description: "Show error snack-bar",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showError('this is an error snack-bar');
    }
  },
  {
    group: "Notifications",
    description: "Show success snack-bar",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showSuccess('this is a success snack-bar');
    }
  },
  {
    group: "Layers",
    description: "Add WMS Layer",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showSuccess('this is a success snack-bar');
    },
    code: `cgpv.api.getMapViewer(mapId).addGeoviewLayer(config)`
  },
  {
    group: "Layers",
    description: "Remove GeoJSON Layer",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.notifications.showSuccess('this is a success snack-bar');
    },
    code: `cgpv.api.getMapViewer(mapId).removeLayerUsingPath('geojsonLYR1/geojsonLYR1')`
  },
  {
    group: "Layers",
    description: "Remove all layers",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.removeAllGeoviewLayers();
    },
    code: `cgpv.api.getMapViewer(mapId).removeAllGeoviewLayers()`
  },
  {
    group: "Layers",
    description: "Set all layers visible",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.layer.setAllLayersVisibility(true);
    }
  },
  {
    group: "Layers",
    description: "Set all layers NOT visible",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.layer.setAllLayersVisibility(false);
    }
  },
  {
    group: "Map markers",
    description: "Place a marker on the map",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.clickMarkerIconShow({lnglat: [-90, 60]});
    },
    code: `cgpv.api.maps.Map1.clickMarkerIconShow({lnglat: [-90, 60]})`
  },
  {
    group: "Map projection",
    description: "Set map project to LCC(3978)",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setProjection(3978);
    }
  },
  {
    group: "Map projection",
    description: "Set map project to Web Mercator(3857)",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      myMap.setProjection(3857);
    }
  },
  {
    group: "General",
    description: "Get map config from map state",
    secondaryDescription: "This function will log the map config to the console",
    function: (mapId: string) => {
      const myMap = cgpv.api.getMapViewer(mapId);
      console.log(myMap.createMapConfigFromMapState());
    }
  }
];


export default apiFuncs;