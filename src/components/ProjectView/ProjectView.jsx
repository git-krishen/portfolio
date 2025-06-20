import './ProjectView.css';

const ProjectView = ({projectImg, projectName, projectDesc, projectLink}) => {
    return (
        <div className='cell'>
            <img src={projectImg} alt='Project Image' className='image' />
            <h2 className='name'>{projectName}</h2>
            <p className='description'>{projectDesc}</p>
            <a href={projectLink} className='link'>Link to Project</a>
        </div>
    );
};

export default ProjectView;