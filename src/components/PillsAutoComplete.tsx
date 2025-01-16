/* eslint-disable @typescript-eslint/no-explicit-any */
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { TextField } from '@mui/material';
import { ListOptionType } from '../types';
//import { String } from 'lodash';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


interface PillsAutoCompleteProps {
  options: ListOptionType[];
  defaultValue?: any[];
  onChange?: (value: any[],reason:any) => void;
  label: string;
  placeholder?: string;
}

export default function PillsAutoComplete(props: PillsAutoCompleteProps) {

  const { options, defaultValue, onChange, label, placeholder } = props;

  const handleOnChange = (event: React.SyntheticEvent, value: ListOptionType[], reason: any,detail: any) => {
 //   const newValue = value.map((v) => v.value); //oriingally this
  //  const newDetail as ListOptionType[] = value.map((v) => v.value);
    console.log("handleonchange=", event);
    console.log("handleonchange=2", event);
    console.log("handleonchange=3", onChange);//removeOption
    console.log("handleonchange=4", reason);//selectOption,
    console.log("handleonchange=5", detail.option.value);
     console.log("handleonchange=6", value);
    //  onChange?.(newValue, reason);
      onChange?.(detail.option.value, reason);
     // onChange?.(newValue);
  };
 // const setText = (event: React.SyntheticEvent, value: string) => {
   // const newValue = value.map((v) => v.value);
   // onChange?.(newValue);
//  };
  
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      size="small"
      options={options}
      disableCloseOnSelect
      defaultValue={options.filter((option) => defaultValue?.includes(option.value))}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.title}
      onChange={handleOnChange}
    //  onInputChange={(event,  value ,reason) => setText(event,value )}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.title}
          </li>
        );
      }}
      style={{ width: '100%' }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}