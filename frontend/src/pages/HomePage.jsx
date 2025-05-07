import { Link } from "react-router-dom";

function App() {
  return (
    <div className="home-page-wrapper">
      {/* Left Box: Contains an image with overlay text "WELCOME" */}
      <div className="left-box">
        <img 
          src="../image/bambolimstadium_upscaled.jpg" 
          alt="Welcome" 
          className="welcome-image" 
        />
        <div className="welcome-overlay"> <h1>WELCOME TO<br/>SPORTLINK</h1></div>
      </div>

      {/* Right Box: Contains the home page container */}
      <div className="right-box">
        <div className="home-page__container">
          <img 
            src="../image/Sports-Authority-Of-Goa-logo-removebg-preview.png" 
            alt="SportLink Logo" 
            className="logo"
          />
          <h1 className="main__title">SportLink</h1>
          <div className="home__buttons">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


