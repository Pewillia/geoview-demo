import { useContext, useState } from 'react';
import { CGPVContext } from '../providers/cgpvContextProvider/CGPVContextProvider';
import { Box, Button, Modal } from '@mui/material';
import { useSnackbar } from '@/providers/snackbarProvider';
//import DataObjectIcon from '@mui/icons-material/DataObject';
//import { CopyToClipboardButton } from './CopyToClipboardButton';
//import Markdown from 'markdown-to-jsx';


var guide3 = "";

export  function Guide() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

   const { enqueueSnackbar } = useSnackbar();

  //const textEditorRef = useRef<HTMLTextAreaElement>(null);

  //const [numberOfLines, setNumberOfLines] = useState<number>(0);
  //const [isValidJson, setIsValidJson] = useState<boolean>(false);
  const [modalIsOpen] = useState(false);

  //useEffect(() => {
  //  resetEditorText();
  // }, [configJson]);
  // const file = event.target.files[0];
  function handleUpload() {
    var readFile = new XMLHttpRequest();
       
    readFile.open("GET", "./guide2.md", true);
    readFile.onreadystatechange = function () {
      if (readFile.readyState === 4) {
        if (readFile.status === 200 || readFile.status == 0) {
          guide3 = guide3 + readFile.responseText;
        }
         else  enqueueSnackbar('Can not load guide file', { variant: 'error' });
      }
      else  enqueueSnackbar('Can not load guide file', { variant: 'error' });
    };
  };  
   
  const handleOpenModal = function () {
    handleUpload();
  }

   
  const modalContentStyle = {
    position: 'absolute' as 'absolute',
    top: '18%',
    left: '34%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '50%', sm: '50%', md: '30%', lg: '30%' },
    //length: { lg: '80%' },
      bgcolor: 'background.paper',
      border: '2px solid #ccc',
      borderRadius: 4,
      boxShadow: 24,
      display: 'flex',
      flexDirection: 'column',
      p: 1,
    };
   //      <Markdown options={{ wrapper: 'article' }}>{guide3}
          //      </Markdown>
    return (
      <>
        <Button component="label" variant="contained" color="primary" size="small" onClick={handleOpenModal} >
          ?
        </Button>
        <Modal
          open={modalIsOpen}
          
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
              <Box id="sandboxMapContainer">
          <Box sx={modalContentStyle}>
            <Box className="help" sx={{ position: 'relative' }} style={{
                
              background: "white"
            }}>
              <Box sx={{ position: 'absolute', top: 5, left: 10 }}>
         
          
         
              </Box>
            </Box>
            </Box>
              </Box>
        </Modal>
      </>
    );
  }

