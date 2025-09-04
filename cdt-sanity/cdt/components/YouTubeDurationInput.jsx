import {TextInput} from '@sanity/ui';

export default function YouTubeDurationInput(props) {
  const {value, onChange} = props;
  
  return (
    <TextInput
      value={value || ''}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder="MM:SS or H:MM:SS"
    />
  );
}
