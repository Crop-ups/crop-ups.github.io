
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-herb-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4">Serene Herbal Haven</h3>
            <p className="text-herb-100 mb-4">
              Natural herbal remedies for your physical, mental, and sexual wellness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-herb-100 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-herb-100 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-herb-100 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wide text-sm text-herb-200">Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Physical Wellness</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Mental Wellness</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Sexual Wellness</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Best Sellers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wide text-sm text-herb-200">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="text-herb-100 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wide text-sm text-herb-200">Newsletter</h4>
            <p className="text-herb-100 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 bg-herb-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-herb-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-herb-600 hover:bg-herb-500 px-4 py-2 rounded-r-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-herb-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-herb-300 text-sm">
            &copy; {new Date().getFullYear()} Serene Herbal Haven. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-herb-300 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-herb-300 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-herb-300 hover:text-white transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
