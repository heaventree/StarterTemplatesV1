import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const awards = [
  {
    id: 1,
    image: "/images/awards/award1.png",
    alt: "2024 Most Innovative Design Company - Irish Enterprise Awards"
  },
  {
    id: 2,
    image: "/images/awards/award2.png",
    alt: "2024 Web Design Agency of the Year - Innovation & Excellence Awards Corporate Live Wire"
  },
  {
    id: 3,
    image: "/images/awards/award3.png",
    alt: "2023 Best Digital Transformation Partner - Corporate Vision Awards"
  },
  {
    id: 4,
    image: "/images/awards/award4.png",
    alt: "2023 Most Innovative Web Design Company - EU Business News Awards"
  },
  {
    id: 5,
    image: "/images/awards/award5.png",
    alt: "2022 Best Web Design Company - Corporate Vision Awards"
  }
];

export default function AwardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update isMobile state based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle carousel navigation
  const handlePrev = () => {
    if (isMobile) {
      setCurrentIndex(prev => (prev === 0 ? awards.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      setCurrentIndex(prev => (prev === awards.length - 1 ? 0 : prev + 1));
    }
  };

  // Auto-rotate carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === awards.length - 1 ? 0 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="w-full mt-12 mb-2 relative">
      {/* Desktop version - all awards in a row */}
      <div className="hidden md:flex justify-between items-center gap-4 w-full">
        {awards.map((award) => (
          <div key={award.id} className="h-28 flex items-center justify-center">
            <img 
              src={award.image} 
              alt={award.alt} 
              className="h-full w-auto object-contain transition-all hover:scale-105"
            />
          </div>
        ))}
      </div>
      
      {/* Mobile version - carousel */}
      <div className="md:hidden">
        <div 
          ref={carouselRef}
          className="relative overflow-hidden w-full"
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {awards.map((award) => (
              <div key={award.id} className="w-full flex-shrink-0 h-24 flex items-center justify-center">
                <img 
                  src={award.image} 
                  alt={award.alt} 
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
            {awards.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to award ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}