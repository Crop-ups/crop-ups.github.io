
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="text-herb-800 font-serif text-2xl md:text-3xl font-bold">
            Herbal Heaven
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-herb-800 hover:text-herb-600 transition-colors">Home</a>
          <a href="#products" className="text-herb-800 hover:text-herb-600 transition-colors">Products</a>
          <a href="#about" className="text-herb-800 hover:text-herb-600 transition-colors">About</a>
          <a href="#contact" className="text-herb-800 hover:text-herb-600 transition-colors">Contact</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 text-herb-800" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5 text-herb-800" />
          </Button>
          <Button className="bg-herb-600 hover:bg-herb-700 text-white">
            Shop Now
          </Button>
        </div>
        
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-herb-800" />
            ) : (
              <Menu className="h-6 w-6 text-herb-800" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 md:hidden animate-fade-in">
          <div className="container mx-auto flex flex-col space-y-4">
            <a href="#" className="text-herb-800 hover:text-herb-600 transition-colors px-4 py-2">Home</a>
            <a href="#products" className="text-herb-800 hover:text-herb-600 transition-colors px-4 py-2">Products</a>
            <a href="#about" className="text-herb-800 hover:text-herb-600 transition-colors px-4 py-2">About</a>
            <a href="#contact" className="text-herb-800 hover:text-herb-600 transition-colors px-4 py-2">Contact</a>
            <div className="flex items-center space-x-4 px-4 py-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-herb-800" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5 text-herb-800" />
              </Button>
            </div>
            <div className="px-4">
              <Button className="bg-herb-600 hover:bg-herb-700 text-white w-full">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
