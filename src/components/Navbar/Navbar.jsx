import './Navbar.css';

const Navbar = () => {
    return (
      <nav className='navbar'>
        <p className='logo'>Krishen Sharma</p>
        <a href='#'>Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    );
};

export default Navbar;