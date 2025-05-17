
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import CustomPopup from "@/components/CustomPopup";
import SecurityPopup from "@/components/SecurityPopup";

const Index = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <Products />
      <About />
      <ContactForm />
      <Footer />
      <AudioPlayer />
      <CustomPopup 
        title="Limited Time Offer!"
        message="Enjoy 20% off on all products with code:"
        buttonText="Shop Now"
        showAfterMs={5000} // Shows after 5 seconds
      />
      <SecurityPopup 
        showAfterMs={11000} // Show 1 second after the first popup (11 seconds total)
        preventClose={true}
      />
    </div>
  );
};

export default Index;
