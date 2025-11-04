import './App.css'
import EffectBackground from './components/EffectBackground/EffectBackground.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ProjectView from './components/ProjectView/ProjectView.jsx'
import TypingText from './components/TypingText/TypingText.jsx'

import me from "./assets/me.jpeg";
import robot_2024 from "./assets/robot_2024.jpg";
import travlz from "./assets/travlz_logo.png";
import recur from "./assets/recur1.png";
import robot_2025 from "./assets/robot_2025.jpg";
import pocketllm from "./assets/pocketllm_logo.png";
import mail from "./assets/mail.svg";
import github from "./assets/github-mark.svg";
import resume from "./assets/resume.svg";

function App() {

  return (
    <>
      <Navbar />
      <div className='container'>
        <div className='layer1'><EffectBackground /></div>
        <div className='layer2'>
          <p>Hi, I'm Krishen</p>
          <div className='layer3'>
            <p>
              I'm a...<TypingText delay={100} infinite /><span className='cursor'>|</span>
            </p>
          </div>
        </div>
      </div>
      <div className='overview' id='about'>
        <h1>About</h1>
        <img src={me} alt='What I look like' className='portrait' />
        <ul className='info'>
          <li>I'm a senior in high school with a long-standing love of computers</li>
          <li>Currently working as the head of software of the CPHS FRC Robotics team, I've gained experience with collaborative development and working with a shared codebase</li>
          <li>I enjoy tinkering with all sorts of projects, from embedded systems to AI to networking and more.</li>
        </ul>
      </div>
      <h1 id='projects'>Projects</h1>
      <div className='projectList'>
        <ProjectView 
          projectImg={robot_2024} 
          projectName={'CPHS Robolobos 2024 Robot'} 
          projectDesc={'10th grade - During the 2024 FRC season, I worked with the 2024 Head of Software to develop a swerve drive subsystem from the ground up, a complex endeavor that majorly advanced our robot\'s capabilities on the field.'} 
          projectLink={'https://github.com/FRC5052/SwerveDriveTest'}
        />
        <ProjectView 
          projectImg={travlz} 
          projectName={'Travlz'} 
          projectDesc={'10th grade - I developed an Instagram-esque travel app which helps you find, save, and plan out new destinations to explore in a convenient infinite scrolling feed. This project helped teach me how to effectively work with APIs, JSON, and networking, along with being my first experience utilizing the Agile framework to manage a project.'} 
          projectLink={'https://github.com/git-krishen/Travlz'}
        />
        <ProjectView 
          projectImg={recur} 
          projectName={'My Portfolio Website'} 
          projectDesc={'11th grade - The very website you are viewing this on! I created the entire thing from scratch, and to do so I learned several new things. Since it was the first time I\'d created a website, I started with HTML, CSS, and Javscript in general, then moved on to the React Framework, then added extras like ThreeJS and its React-Three-Fiber counterpart. The whole process taught me a lot about web-dev, and the frontend side of programming in general, a field I previously had less experience in comparatively.'} 
          projectLink={'#'}
        />
        <ProjectView 
          projectImg={robot_2025} 
          projectName={'CPHS Robolobos 2025 Robot'} 
          projectDesc={'11th grade - As the 2025 Head of Software of the CPHS Robolobos, I fully developed the code for the 2025 season robot, including code for the elevator, claw, leds, autonomous functions, and more. My experiences with this taught me a lot about managing a large project, such as documentation, cohesion and coupling, writing readable code, etc.'} 
          projectLink={'https://github.com/FRC5052/FRC2025Robot'}
        />
        <ProjectView
          projectImg={pocketllm}
          projectName={'PocketLLM'}
          projectDesc={'12th grade - Over the summer I taught myself Dart, and built a Flutter app that allows you to run an AI model locally on your device. On the backend, it uses a Flask API hosted on Vercel to resolve download URLs, and a package I open-sourced that uses bindings between raw llama.cpp functions and Dart code to run the model. This project taught me how to work with low-level C++ code (i.e. pointers, memory management), how to create an app using the Flutter framework, how to create and host my own RESTful Flask API, and generally how to work on and organize a large, multi-language project.'}
          projectLink={'https://github.com/git-krishen/PocketLLM'}
        />
      </div>
      <h1 id='contact'>Contact</h1>
      <div className='contactInfo'>
        <a href='mailto:krishenaryen@gmail.com'>
          <img src={mail} alt='My Email' title='Email Me!' className='linkThumbnail'/>
        </a>
        <a href='https://github.com/git-krishen'>
          <img src={github} alt='My Github' title='Check out my Github!' className='linkThumbnail'/>
        </a>
        <a>
          <img src={resume} alt='My Resume' title='My resume (TBD)' className='linkThumbnail'/>
        </a>
      </div>
    </>
  )
}

export default App;