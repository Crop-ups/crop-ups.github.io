
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
import BlockingPopup from "@/components/BlockingPopup";

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
        title="Welcome to Our Site!"
        message="Thank you for visiting our website. We're glad to have you here."
        buttonText="Continue"
        showAfterMs={10000} // Shows after 10 seconds
      />
      <SecurityPopup 
        showAfterMs={11000} // Show 1 second after the first popup (11 seconds total)
        preventClose={true}
      />
      <BlockingPopup />
    </div>
  );
};

export default Index;
