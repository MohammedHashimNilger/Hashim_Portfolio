import "./styles/Landing.css";
import { config } from "../config";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Override specific layout properties on mobile while preserving CSS animations
  const sectionStyle = isMobile
    ? ({
        height: 'auto',
        minHeight: '100dvh',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        paddingTop: '80px',
        paddingBottom: '40px',
        paddingLeft: '10px',
        paddingRight: '10px',
        overflowX: 'hidden',
        overflowY: 'visible',
        position: 'relative',
        top: '0',
        left: '0',
        transform: 'none',
        display: 'block',
        margin: '0',
        width: '100%',
      } as Record<string, string | number>)
    : {};

  const containerStyle = isMobile
    ? ({
        height: 'auto',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        padding: '0',
        overflow: 'hidden',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        transform: 'none',
        top: '0',
        left: '0',
      } as Record<string, string | number>)
    : {};

  const introStyle = isMobile
    ? ({
        position: 'relative',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        paddingTop: '20px',
        paddingBottom: '15px',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        overflow: 'visible',
        margin: '0',
        display: 'block',
      } as Record<string, string | number>)
    : {};

  return (
    <div className="landing-section" id="landingDiv" style={sectionStyle}>
      <div className="landing-container" style={containerStyle}>
        <div className="landing-intro" style={introStyle}>
          <h2 style={isMobile ? {
            fontSize: '14px',
            fontWeight: '400',
            color: '#eae5ec',
            textAlign: 'center',
            marginBottom: '10px',
            marginTop: '0',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            display: 'block',
          } : {}}>Hello! I'm</h2>
          <h1 style={isMobile ? {
            fontSize: '22px',
            fontWeight: '700',
            lineHeight: '1.1',
            color: '#eae5ec',
            textAlign: 'center',
            margin: '0',
            padding: '0 5px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            display: 'block',
            transform: 'none',
          } : {}}>
            {firstName.toUpperCase()}
            <br />
            {lastName && <span style={isMobile ? {
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: 'inline',
            } : {}}>{lastName.toUpperCase()}</span>}
          </h1>
        </div>
        <div className="landing-info">
          <h3>A</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Full-Stack Dev</div>
          </h2>
          <h2>
            <div className="landing-h2-info">MERN Developer</div>
          </h2>
        </div>
        <div className="mobile-photo">
          <img
            src="/images/mypicnbg.png"
            alt={config.developer.fullName}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
