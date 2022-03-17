export default function Footer() {
  return(
    <>
    <footer className="footer">
      <div className="al-v" style={{alignItems:"center"}}>
        <img src='./images/logo.png' alt="" width="auto" height="auto"></img>
        <span style={{marginTop:"10px"}}>
          You Hold | We Invest | You Earn
        </span>
      </div>
      <ul>
        <div>
          <span>Company</span>
          <li><a href="https://healtheworld.io/#tok" target = "_blank">Tokenomics</a></li>
          <li><a href="https://healtheworld.io/#road" target = "_blank">Roadmap</a></li>
          <li><a href="https://healtheworld.io/#team" target = "_blank">Team</a></li>
        </div>
      </ul>
      <ul>
        <div>
          <span>Help</span>
          <li><a href="https://healtheworld.io/#vis" target = "_blank">About Us</a></li>
          <li><a href="https://healtheworld.io/#team" target = "_blank">Team</a></li>
          <li><a href="https://heal.gitbook.io/heal-whitepaper/" target = "_blank">White Paper</a></li>
        </div>
      </ul>
      <ul>
        <div>
          <span>Social</span>
          <li><a href="#">Tweeter</a></li>
          <li><a href="#">Telegram</a></li>
          <li><a href="#">Medium</a></li>
        </div>
      </ul>
    </footer>
    <div className="second-footer">
      <div>©️ $Heal The World 2022, All Right Reserves | LLC</div>
      <div className="al-h center" style={{paddingTop:"1rem"}}>
        <a href="#">
          <img src='./images/twitter.svg' alt=""/>
        </a>
        <a href="#">
          <img src='./images/telegram.svg' alt=""/>
        </a>
        <a href="#">
          <img src='./images/medium.svg' alt=""/>
        </a>
        <a href="#">
          <img src='./images/discord.svg' alt=""/>
        </a>
      </div>
    </div>
    </>
  )
}