
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

const Products = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const products: Product[] = [
    {
      id: 1,
      name: "Ashwagandha Root",
      description: "Promotes physical and mental energy",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      category: "physical",
    },
    {
      id: 2,
      name: "Holy Basil Extract",
      description: "Supports stress response and mood",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      category: "mental",
    },
    {
      id: 3,
      name: "Maca Root Powder",
      description: "Enhances energy, stamina and libido",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
      category: "sexual",
    },
    {
      id: 4,
      name: "Rhodiola Rosea",
      description: "Improves energy and mental performance",
      price: 27.99,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      category: "mental",
    },
    {
      id: 5,
      name: "Tribulus Terrestris",
      description: "Supports hormonal balance and libido",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      category: "sexual",
    },
    {
      id: 6,
      name: "Echinacea Complex",
      description: "Supports immune system function",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
      category: "physical",
    },
  ];

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => product.category === activeTab);

  return (
    <section id="products" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-herb-900 mb-4">
            Our Featured Products
          </h2>
          <p className="text-herb-700 max-w-2xl mx-auto">
            Discover our carefully formulated herbal remedies to support your wellness journey
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveTab("all")}
              className="data-[state=active]:bg-herb-600 data-[state=active]:text-white"
            >
              All Products
            </TabsTrigger>
            <TabsTrigger 
              value="physical" 
              onClick={() => setActiveTab("physical")}
              className="data-[state=active]:bg-herb-600 data-[state=active]:text-white"
            >
              Physical
            </TabsTrigger>
            <TabsTrigger 
              value="mental" 
              onClick={() => setActiveTab("mental")}
              className="data-[state=active]:bg-herb-600 data-[state=active]:text-white"
            >
              Mental
            </TabsTrigger>
            <TabsTrigger 
              value="sexual" 
              onClick={() => setActiveTab("sexual")}
              className="data-[state=active]:bg-herb-600 data-[state=active]:text-white"
            >
              Sexual
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-herb-900">{product.name}</h3>
                        <p className="text-herb-700 text-sm mt-1">{product.description}</p>
                      </div>
                      <span className="text-herb-900 font-semibold">${product.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full bg-herb-600 hover:bg-herb-700">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Products;
