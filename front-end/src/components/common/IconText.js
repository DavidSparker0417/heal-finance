const vmiddle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems:"center"
}

export default function IconText({icon, title, size, color}) {
  const small = typeof size === undefined || size === 'small' || size === 'medium'
  let iconWidth
  let iconHeight
  let fontSize
  let lm = "1rem";
  switch (size) {
    case 'small':
      iconWidth = '20px'
      iconHeight = '20px'
      fontSize = '10px'
      break
    case 'medium':
      iconWidth = '40px'
      iconHeight = '40px'
      fontSize = '30px'
      break
    case 'large':
      iconWidth = '50px'
      iconHeight = '50px'
      fontSize = '30px'
      lm = '2rem'
      break
    default:
      iconWidth = '30px'
      iconHeight = '30px'
      fontSize = '20px'
      break
  }
  return(
    <div style={{...vmiddle, color:color}}>
      <img src={icon} width={iconWidth} height={iconHeight} alt={title}/>
      <div style={{marginLeft:lm, fontSize:fontSize}}>
        {title}
      </div>
    </div>
  )
}