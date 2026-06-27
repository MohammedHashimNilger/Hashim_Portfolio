import { Link } from "react-router-dom";
import "./MyWorks.css";
import { config } from "../config";

const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-btn" data-cursor="disable">← Back</Link>
        <h1>All Works</h1>
      </div>
      <div className="myworks-grid">
        {config.projects.map((project) => (
          <div key={project.id} className="myworks-card">
            <div className="myworks-card-image">
              {project.live ? (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <img src={project.image} alt={project.title} />
                </a>
              ) : (
                <img src={project.image} alt={project.title} />
              )}
            </div>
            <div className="myworks-card-info">
              <span className="myworks-card-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p className="myworks-card-description">{project.description}</p>
              <div className="myworks-card-tech">{project.technologies}</div>
              <div className="myworks-links">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="myworks-link"
                  >
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="myworks-link"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
