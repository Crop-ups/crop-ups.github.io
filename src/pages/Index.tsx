
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import BlockingPopup from "@/components/BlockingPopup";
import CustomPopup from "@/components/CustomPopup";

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
      <BlockingPopup />
      <CustomPopup 
        title="Welcome to Our Site!"
        message="Thank you for visiting our website. We're glad to have you here."
        buttonText="Continue"
        showAfterMs={10000} // Shows after 10 seconds
      />
    </div>
  );
};

export default Index;
