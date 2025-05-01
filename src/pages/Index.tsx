
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
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
      <BlockingPopup />
    </div>
  );
};

export default Index;
