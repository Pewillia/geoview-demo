import {
  Accordion, AccordionDetails, AccordionSummary, Box,Divider, FormControl, List, ListItem, ListItemButton,  TextField,Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment,useEffect, useState} from 'react';
import _ from 'lodash';
import { useSnackbar } from '@/providers/snackbarProvider';
import Markdown from 'markdown-to-jsx';

export interface GuideFuncItem {
  group: string;
  code: string;
}


const guideFuncs = [
  {
    group: "Map Builder",
    code: ""
  },
  {
    group: "Api Functions",
    description: " ",
    code: ""
  },{
    group: "Layers Status",
    code: ""
  },{
    group: "Events Log",
    code: ""
  },
    {
    group: "Load Times / Unanticipated Behaviour",
    code: ""
  }
];

export default function GuideTab() {


  const [guideFunctionsList, setguideFunctionsList] = useState(guideFuncs);
  const guidegroups =  _(guideFunctionsList).orderBy( ['group'], ['asc']).groupBy('group').value();
  const guidegroupNames = Object.keys(guidegroups);

  const { enqueueSnackbar } = useSnackbar();
 
  useEffect(
    handleUpload,[] 
  ) 
    
  function handleUpload() {

    var readFile = new XMLHttpRequest();
       
    readFile.open("GET", "./guide2.md", true);
    readFile.send(); 
    if ((readFile.statusText) === "Not Found") {
      enqueueSnackbar('Can not load guide file', { variant: 'error' });
   };
    readFile.onreadystatechange = function () {
      if (readFile.readyState === 4) {
        if (readFile.status === 200 || readFile.status == 0) {
          guideFuncs[1].code = readFile.responseText.substring(readFile.responseText.search("# Api Functions")+15, readFile.responseText.search("# Load"));
          guideFuncs[4].code = readFile.responseText.substring(readFile.responseText.search("# Load Times / Unanticipated Behaviour")+38, readFile.responseText.search("# Layers Status"));
          guideFuncs[2].code = readFile.responseText.substring(readFile.responseText.search("# Layers Status")+15, readFile.responseText.search("# Events Log"));
          guideFuncs[3].code = readFile.responseText.substring(readFile.responseText.search("# Events Log")+12, readFile.responseText.search("# End"));
          guideFuncs[0].code = readFile.responseText.substring(readFile.responseText.search("# Map Builder")+13, readFile.responseText.search("# Api Functions"));  
        }
      }
    };
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.target.value;
    if (filterText === '') {
         setguideFunctionsList(guideFuncs);
      return;
    }
    const filteredList = guideFunctionsList.filter((item) => 
         item.group.toLowerCase().includes(filterText.toLowerCase())
      || item.code.toLowerCase().includes(filterText.toLowerCase()));
    setguideFunctionsList(filteredList);
  }
 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl sx={{}}>
          <Markdown options={{ wrapper: 'article' }}>
          {"# Guide \n\n  ## Geoview Config Builder"}
          </Markdown>
        <TextField
          onChange={handleFilterChange}
          id="filter-text" size="small" label="Enter filter for help sectons here..." variant="outlined" sx={{bgColor: 'white'}} />
      </FormControl>
      {guidegroupNames.map((groupName, index) => (
        <Accordion onChange={(e, expanded) => {
          if (expanded) {
           const guideFuncs3 = {...guideFunctionsList};
           setguideFunctionsList(guideFuncs3);
        }
        }}
          sx={{ mt: 1 }} key={`group_${index}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            <Typography>{groupName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense={true}>
              {guidegroups[groupName].map((item, ind) => (
               <Fragment key={`${ind}`}>
                  <ListItem
                  >
                    <ListItemButton>              
                      <Markdown options={{ wrapper: 'aside' , forceWrapper: true}}>
                        {item.code}
                      </Markdown>
                    </ListItemButton>
                </ListItem>
                {(ind < guidegroups[groupName].length - 1) && <Divider />}
                </Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
