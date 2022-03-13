import './input.scss'
import { DivHCenter } from './StyledComponents';

export default function TextBox({
  placeholder, 
  handleChange, 
  value, 
  optButton,
  style}) {
  return(<DivHCenter style={{
      backgroundColor:"#003d2bc2",
      borderRadius:"10px",
      margin: "0 1rem 1rem"
    }}>
    <input type="text" 
      onKeyPress={(event) => {
        if (!/[0-9.]+/.test(event.key)) {
          event.preventDefault();
        }
      }}
      className="effect-16" 
      placeholder={placeholder}
      onChange={handleChange}
      value= {value || ""}
      style={{padding:"10px", ...style}}
    />
    {
      optButton && optButton
    }
  </DivHCenter>
  )
}