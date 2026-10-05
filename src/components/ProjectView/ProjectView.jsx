import { useRef } from 'react';
import './ProjectView.css';

const ProjectView = ({ projectImg, projectName, projectDesc, projectLink }) => {
  const cardRef = useRef(null);

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const card = cardRef.current;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
    card.style.setProperty('--sheen-x', `${x * 100}%`);
    card.style.setProperty('--sheen-y', `${y * 100}%`);
  };

  const onPointerLeave = () => {
    const card = cardRef.current;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div className="cell" ref={cardRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <img src={projectImg} alt={`${projectName} project`} className="image" />
      <h2 className="name">{projectName}</h2>
      <p className="description">{projectDesc}</p>
      <a href={projectLink} className="link">Link to Project</a>
    </div>
  );
};

export default ProjectView;
