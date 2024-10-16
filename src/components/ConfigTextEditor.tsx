import { useContext, useEffect, useRef, useState } from 'react';
import { CGPVContext } from '../providers/cgpvContextProvider/CGPVContextProvider';
import { Box, Button, Modal } from '@mui/material';
import { useSnackbar } from '@/providers/snackbarProvider';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import _ from 'lodash';

export function ConfigTextEditor() {
  const cgpvContext = useContext(CGPVContext);

  if (!cgpvContext) {
    throw new Error('CGPVContent must be used within a CGPVProvider');
  }

  const { configJson, validateConfigJson, createMapFromConfigText, handleApplyStateToConfigFile } = cgpvContext;
  const { enqueueSnackbar } = useSnackbar();

  const textEditorRef = useRef<HTMLTextAreaElement>(null);

  const [editorText, setEditorText] = useState<string>('');
  const [numberOfLines, setNumberOfLines] = useState<number>(0);
  const [isValidJson, setIsValidJson] = useState<boolean>(false);
  const [isEditorTouched, setIsEditorTouched] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    resetEditorText();
  }, [configJson]);

  const resetEditorText = () => {
    let jsonObj = configJson || {};
    const jsonTxt = JSON.stringify(jsonObj, null, 4);
    setEditorText(jsonTxt);
    setIsEditorTouched(false);
  };

  useEffect(() => {
    const numOfLines = editorText.split(/\r\n|\r|\n/).length;
    setNumberOfLines(numOfLines + 5);
  }, [editorText]);

  const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorText(event.target.value);
    setIsEditorTouched(true);
    setIsValidJson(false);
  };

  const validateText = () => {

    const results = validateConfigJson(editorText);
   // alert(editorText);
    //alert('JSON results' + results);
    if (results) {
      enqueueSnackbar(results, { variant: 'error' });
     // alert('JSON is NOT valid'+ { variant: 'error' });
      setIsValidJson(false);
    } else {
      enqueueSnackbar('JSON is valid', { variant: 'success' });
      setIsValidJson(true);
    }
    
  };

  function validateText2  () {

    const results = validateConfigJson(editorText);
   // alert(editorText);
    //alert('JSON results' + results);
    if (results) {
      enqueueSnackbar(results, { variant: 'error' });
     // alert('JSON is NOT valid'+ { variant: 'error' });
      setIsValidJson(false);
    } else {
      enqueueSnackbar('JSON is valid', { variant: 'success' });
      setIsValidJson(true);
    }
    return(results)
  };
  const createMap = () => {
    // const validJson = validateText2;c
   // alert(validateText2());
    if (validateText2() == null) { //alert('calling create map');
      createMapFromConfigText(editorText);
    }
  };

  function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
  }

  const handleOpenModal = function () {
    setModalIsOpen(true);
  }

  const handleCloseModal = function () {
    if (isEditorTouched) {
      resetEditorText();
    } else {
      setModalIsOpen(false);
    }
  }

  const modalContentStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '80%', sm: '90%', md: '80%', lg: '75%' },
    bgcolor: 'background.paper',
    border: '2px solid #ccc',
    borderRadius: 4,
    boxShadow: 24,
    display: 'flex', 
    flexDirection: 'column',
    p: 1,
  };

  return (
    <>
      <Button component="label" variant="contained" color="primary" size="small" onClick={handleOpenModal} startIcon={<DataObjectIcon />}>
        Edit JSON
      </Button>
      <Modal
        open={modalIsOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalContentStyle}>
          <Box className="config-editor" sx={{ position: 'relative' }}>
            
              <Box sx={{ display: 'flex', justifyContent: 'center' ,mt: 2, gap: 2 }}>
            <Box sx={{ position: 'absolute', top: 5, right: 200 }}>
             
            </Box>
           
              </Box>
            <div className="line-numbers">
              {generateArray(numberOfLines).map((lineNumber) => (
                <span key={lineNumber}></span>
              ))}
            </div>
            <textarea
              id="configGeoview"
              name="configuration"
              value={editorText}
              onChange={onTextareaChange}
              rows={30}
              cols={150}
              ref={textEditorRef}
              spellCheck="false"
            ></textarea>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
             <Button variant="contained" color="primary" size="small" onClick={handleApplyStateToConfigFile}>
                Apply State to Config File
            </Button>
            <Box >
              <CopyToClipboardButton textToCopy={editorText} />
              </Box>
             
            <Button variant="contained" color="primary" onClick={validateText} disabled>
              Validate
            </Button>
           
            <Button variant="contained" color="primary" onClick={createMap}>
              Create Map
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
