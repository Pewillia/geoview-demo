/* eslint-disable @typescript-eslint/no-explicit-any */
import Autocomplete from '@mui/material/Autocomplete';
import { Box, TextField } from '@mui/material';
import { ListOptionType } from '../types';
import _ from 'lodash';
import { useReducer,useEffect} from 'react';

import { timeSliderFuncs} from "./MapBuilder.tsx"


interface PillsAutoCompleteProps {
  options: ListOptionType[];
  defaultValue?: any;
  onChange?: (value: any) => void;
  label: string;
  placeholder?: string;
  applyGrouping?: boolean;
  disable?:boolean;
  component?:number;
}

export default function SingleSelectComplete(props: PillsAutoCompleteProps) {

  const [, forceUpdate] = useReducer(x => x + 1, 0);


    useEffect(() => {
      console.log("in autocpomplete seingleseclte")
      forceUpdate();
     
    }, [timeSliderFuncs[0]]);

  const { options, defaultValue, onChange, label, placeholder,applyGrouping = false ,disable,component} = props;

  const handleOnChange = (event: React.SyntheticEvent, newValue: ListOptionType| null) => {
    if(newValue === null) {
      onChange?.(null);
      return;
    } else {
      onChange?.(newValue.value);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
      <Autocomplete
     // multiple
      key={component}
      size="small"
      options={_.orderBy(options, ['group', 'title'], ['asc', 'asc'])}
      disableClearable
      defaultValue={options.find((option) => option.value === defaultValue)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.title}
      groupBy={applyGrouping ? ((option) => option.group ?? 'Others') : undefined}
      onChange={handleOnChange}
   //   style={{ width: '100%' }}
       style={{
          display: 'flex', flexDirection: 'column', maxHeight: '40px',
          minWidth: '320px', minHeight: '40px' 
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} disabled = {disable}  />
      )}
    />
    </Box>
  );
}