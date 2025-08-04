import {Link} from 'react-router';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/auth?logout=true');
    };

    return (
        <nav className="navbar">
          <Link to="/">
            <p className="text-2xl font-bold text-gradient">RESUMIND</p>
          </Link>
          <div className="flex gap-4">
            <Link to="/upload" className="primary-button w-fit">
              Upload Resume
            </Link>
            <button 
              onClick={handleLogout} 
              className="logout-button w-fit flex items-center gap-2"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </nav>
    )
};

export default Navbar;
