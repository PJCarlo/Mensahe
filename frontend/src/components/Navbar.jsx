import Logo from 'assets/MensaheLogo.png';

const NavBar = () => {
    return (
        <div className="min-h-screen bg-zinc-900 p-4">
            <img src={Logo} alt="Logo" className="w-12 h-12 mb-4" />
        </div>
    );
}

export default NavBar;