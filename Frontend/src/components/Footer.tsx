
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 px-6 md:px-12 lg:px-24 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <Link to="/" className="inline-block">
            <h2 className="font-bold mb-6 text-xl dark:text-white">Event Booking</h2>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 max-w-xs">
            Find and book tickets to the most exciting events in your area. Concerts, workshops, conferences, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mt-8 md:mt-0">
          <div>
            <h3 className="font-medium mb-4 dark:text-white">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 dark:text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Event Booking. All rights reserved.</p>
        
        <div className="flex space-x-4">
          <a href="https://facebook.com" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="https://linkedin.com" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="https://youtube.com" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="YouTube">
            <Youtube size={20} />
          </a>
          <a href="https://instagram.com" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
