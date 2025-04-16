
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div 
              className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-herb-900/20"></div>
            </div>
          </div>
          
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-herb-900 mb-6">
              Our Commitment to Natural Wellness
            </h2>
            
            <p className="text-herb-700 mb-4">
              At Serene Herbal Haven, we're dedicated to harnessing the power of nature to support your physical, mental, and sexual wellness journey. Our herbal remedies are thoughtfully crafted using traditional wisdom and modern research.
            </p>
            
            <p className="text-herb-700 mb-6">
              Every product is made with organic, sustainably harvested ingredients, ensuring that you receive the highest quality herbal supplements while we respect and preserve our planet's resources.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-herb-50 p-4 rounded-md">
                <h3 className="font-semibold text-herb-900 mb-2">Sustainably Sourced</h3>
                <p className="text-sm text-herb-700">Our herbs are responsibly harvested to protect biodiversity.</p>
              </div>
              
              <div className="bg-herb-50 p-4 rounded-md">
                <h3 className="font-semibold text-herb-900 mb-2">Organic Certified</h3>
                <p className="text-sm text-herb-700">All products are free from pesticides and synthetic additives.</p>
              </div>
              
              <div className="bg-herb-50 p-4 rounded-md">
                <h3 className="font-semibold text-herb-900 mb-2">Scientifically Backed</h3>
                <p className="text-sm text-herb-700">Our formulas are supported by traditional use and modern research.</p>
              </div>
              
              <div className="bg-herb-50 p-4 rounded-md">
                <h3 className="font-semibold text-herb-900 mb-2">Ethical Standards</h3>
                <p className="text-sm text-herb-700">We maintain high ethical standards throughout our supply chain.</p>
              </div>
            </div>
            
            <Button className="bg-herb-600 hover:bg-herb-700 text-white">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
