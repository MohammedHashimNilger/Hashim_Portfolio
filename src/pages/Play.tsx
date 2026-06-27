import { Link } from "react-router-dom";
import "./Play.css";

const Play = () => {
  return (
    <div className="play-page">
      <div className="play-header">
        <Link to="/" className="back-btn" data-cursor="disable">← Back</Link>
        <h1>Play</h1>
        <p>Coming soon — interactive demos and experiments</p>
      </div>
    </div>
  );
};

export default Play;
