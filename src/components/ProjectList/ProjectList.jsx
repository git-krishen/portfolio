import { Children, useLayoutEffect, useRef, useState } from 'react';
import './ProjectList.css';

const ProjectList = ({ children, scrollCutoff = 2 }) => {
  const gridRef = useRef(null);
  const [columns, setColumns] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const projects = Children.toArray(children);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const updateColumns = () => {
      const count = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      setColumns(count);
    };
    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const visibleCount = Math.max(1, scrollCutoff) * columns;
  const hasMore = projects.length > visibleCount;

  return (
    <section className="projectSection" aria-label="Project list">
      <div className="projectList" ref={gridRef}>
        {expanded ? projects : projects.slice(0, visibleCount)}
      </div>
      {(hasMore || expanded) && (
        <button
          className={`projectExpand ${expanded ? 'isExpanded' : ''}`}
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? 'Show fewer projects' : 'Show all projects'}
          aria-expanded={expanded}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 9 7 7 7-7" />
          </svg>
        </button>
      )}
    </section>
  );
};

export default ProjectList;
