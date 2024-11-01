# Map Builder  

Lets users load a file or select a predfined configuration file, then change the characteristics of the map and save any changes made directly to the map or through the configuration list below.

## Save
Save the json configuration file to the download diretory.
  
## Upload a file
UpLoad a json configuration file

## Edit Json 
 
Edit the json file used to create the map.

##Apply State

Save the changes made to the map using the viewer.

## Apply Config Changes

Save the changes and apply them to the mmap, made directly in the viewer or through the configurartion list.

##Select configuration file

Select from a list of configuration files using the pull down list to be loaded in the viewer.

##Map Size

Select the map size for the viewer. Select the width and height of the map.

##Map Language

Select the lanugage to be used to the basemap labels and app, nav and footer bars.

##Display theme

Select a visual theme for the viewer.

##Map Interaction

Select static or dynamic interaction with the map.

##Base Map

Select base map from list.

##Base Map Shaded

Select if base map will be shaded.

##Base Map Labelled

Select if base map will be labelled.

##Zoom levels

Select minimum and maximum zoom levels for the map.

##Map Projection

Select the projection for the map either web mercator or lambert conic conformal.

##Components

Select from north arrow or overview map to be display in the viewer.

##Navigation Bar

Select from zoom,fullscreen,hone ,location,base map select to be displayed on the navigation bar  in the viewer.

##Footer Bar

Select from  legend, layers, details, data table, to be displayed on the footer bar  in the viewer.

##App Bar

Select from zoom, fullscreen,hone ,location, base map select, to be displayed on the app bar  in the viewer.


##Core Packages

Select a package whose functionality will be added to the map,either area of interest, Basemap panel,Custom Basemap, Time slider, Custom timeslider, Geochart, Swiper

# Api Functions 

List of api functions that can be executed on the map view. An example call is displayed. 

The list can be filtered.
 
Reload with current state
 
Reload map

Set language to english
 
Set language to french
  
Set theme to geo.ca
   
Set theme to light
 
Set theme to dark

Add info notification
 
Add warning notification
 
Add error notification

Add success notification

Show info snack-bar
 
Show warning snack-bar
  
Show error snack-bar
   
Show success snack-bar
  
Add WMS Layer
  
Remove GeoJSON Layer
 
Remove all layers
   
Set all layers visible
	
Set all layers NOT visible
	
Place a marker on the map
   
Set map projection to LCC(3978)
	
Set to Lambert Conic Conformal Projection.
	
Set map projection to Web Mercator(3857)
   
Log the map configuration to the console.
    
# Load Times / Unanticipated Behaviour
 
	
Load times may vary based on:

- network location
- bandwidth availability
- number of layers being loaded
- layer types and their sizes

Unanticipated behaviour may occur if any map interactions occur before data is fully loaded. Please allow the map to load completely before triggering any map functions.

_Note: If the loading spinner is visible for a layer, please wait for it to disappear before triggering any function on the map._

# Layers Status
 
List of Layers status, if loaded, removed or error occurred on load. 
 

# Events Log

Log of the list of all events that occured on the map.List included add layer events, addlayererrors, basemapchange, ect.
 
The list can be filtered and cleared.
 
 # End