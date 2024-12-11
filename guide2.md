# Map Builder  

Map builder

Lets users load a file or selcte a predfined configuration file, then change the characteristics
 of the map and save any changes directly 
 to the map or through the configuration list below.

## Save
  Save a json configuration file to download diretory.
  
## Upload
   Load a json configuration file

## Edit Json

Edit the json file.

## Apply Config Changes

Save the changes and apply them to the mmap, made directly in the viwer or through the configurartion listn

##Apply State
Save the changes made to the map using the viewer.


##Select configuration file

Select a configuration file from the puyll down list to be loaded into the viewer.

##Map Size

Select the map size for the viewer.

##Display theme

Select a visual theme for the viewer.

##Map Interface

Select status or dynamic for the map interface of the  viewer.

##Base Map

Select base map for the  viewer.

##Zoom levels

Select minimum and maximum zoom levels for the  viewer.

##Map Projection

Select mmap projection for the map.

##Components

Select north arrow or overview map to be display  in the viewer.

##Navigation Bar

Select zoom,fullscreen,hone ,location,base map select to be displayed on the navigation bar  in the viewer.

##Footer Bar

Select zoom,fullscreen,hone ,location,base map select to be displayed on the navigation bar  in the viewer.

##App Bar

Select zoom,fullscreen,hone ,location,base map select to be displayed on the navigation bar  in the viewer.

##Core Packages


# Api Functions  `


##List of api functions that can be executed on the map view.An example call is displayed. 
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
   
   Log the map config to the console
    
# Load Times / Unanticipated Behaviour
 
		
Load times may vary based on:

- network location
- bandwidth availability
- number of layers being loaded
- layer types and their sizes

Unanticipated behaviour may occur if any map interactions occur before data is fully loaded. Please allow the map to load completely before triggering any map functions.

_Note: If the loading spinner is visible for a layer, please wait for it to disappear before triggering any function on the map._

# Layers Status
 
 List of Layers status if loaded or removed 
 

# Events Log
 Log of the list of all events that occured on the map
 
 # End