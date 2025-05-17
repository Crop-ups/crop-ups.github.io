
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="container mx-auto relative z-10 px-4">
        <div className="max-w-2xl flex flex-col gap-6 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
            Natural Wellness <span className="text-herb-100">For Mind & Body</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Discover our premium herbal remedies made from organic ingredients that promote physical, mental, and sexual wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="bg-herb-600 hover:bg-herb-700 text-white text-lg px-8 py-6">
              See Products
            </Button>
            <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white text-lg px-8 py-6">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
