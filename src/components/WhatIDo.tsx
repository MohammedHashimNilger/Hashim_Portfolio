import { useEffect, useRef, useCallback } from "react";
import "./styles/WhatIDo.css";
import { config } from "../config";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const handlerRefs = useRef<((e: MouseEvent) => void)[]>([]);

  const setRef = useCallback((el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  }, []);

  useEffect(() => {
    handlerRefs.current = [];

    containerRef.current.forEach((container, i) => {
      if (container) {
        const handler = () => {
          handleClick(container);
        };
        container.addEventListener("click", handler);
        handlerRefs.current[i] = handler;
      }
    });

    return () => {
      containerRef.current.forEach((container, i) => {
        const handler = handlerRefs.current[i];
        if (container && handler) {
          container.removeEventListener("click", handler);
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            &nbsp;I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>

          {/* Card 1 */}
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 0)}>
            <div className="what-border1">
              <svg height="100%">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{config.skills.develop.title}</h3>
              <h4>{config.skills.develop.description}</h4>
              <p>{config.skills.develop.details}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {config.skills.develop.tools.map((tool, index) => (
                  <div key={index} className="what-tags">{tool}</div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 1)}>
            <div className="what-border1">
              <svg height="100%">
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{config.skills.design.title}</h3>
              <h4>{config.skills.design.description}</h4>
              <p>{config.skills.design.details}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {config.skills.design.tools.map((tool, index) => (
                  <div key={index} className="what-tags">{tool}</div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  const isActive = container.classList.contains("what-content-active");

  // Reset all siblings and the container itself first
  if (container.parentElement) {
    Array.from(container.parentElement.children).forEach((sibling) => {
      sibling.classList.remove("what-content-active", "what-sibling");
    });
  }

  if (!isActive) {
    // Activate clicked card and shrink siblings
    container.classList.add("what-content-active");
    if (container.parentElement) {
      Array.from(container.parentElement.children).forEach((sibling) => {
        if (sibling !== container) {
          sibling.classList.add("what-sibling");
        }
      });
    }
  }
  // If it was already active, clicking again collapses everything back to default
}