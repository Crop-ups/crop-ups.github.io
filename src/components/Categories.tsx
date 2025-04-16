
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Leaf } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      name: "Physical Wellness",
      description: "Herbal remedies to support your physical health and energy",
      icon: Leaf,
      color: "bg-herb-100 text-herb-700",
      hover: "hover:bg-herb-200",
    },
    {
      name: "Mental Wellness",
      description: "Natural solutions for cognitive function and stress relief",
      icon: Brain,
      color: "bg-herb-100 text-herb-700",
      hover: "hover:bg-herb-200",
    },
    {
      name: "Sexual Wellness",
      description: "Herbal supplements to support intimacy and reproductive health",
      icon: Heart,
      color: "bg-herb-100 text-herb-700",
      hover: "hover:bg-herb-200",
    },
  ];

  return (
    <section className="py-16 bg-herb-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-herb-900 mb-4">
            Our Wellness Categories
          </h2>
          <p className="text-herb-700 max-w-2xl mx-auto">
            Explore our range of natural herbal remedies designed to support your wellness journey in these key areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-300 border-none shadow-md ${category.hover} h-full`}
            >
              <CardContent className="flex flex-col items-center text-center p-8 h-full">
                <div className={`p-4 rounded-full ${category.color} mb-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">{category.name}</h3>
                <p className="text-herb-700">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
