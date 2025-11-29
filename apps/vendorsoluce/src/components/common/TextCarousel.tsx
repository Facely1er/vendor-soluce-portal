import React, { useState, useEffect } from 'react';

interface TextCarouselProps {
  texts: string[];
  interval?: number; // Time in milliseconds between text changes
  className?: string;
  textClassName?: string;
}

const TextCarousel: React.FC<TextCarouselProps> = ({
  texts,
  interval = 3000, // Default 3 seconds
  className = '',
  textClassName = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return; // Don't cycle if there's only one or no text

    const timer = setInterval(() => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true); // Start fade in
      }, 300); // Half of the transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className={`transition-opacity duration-600 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } text-center ${textClassName}`}
        role="text"
        aria-live="polite"
        aria-atomic="true"
      >
        {texts[currentIndex]}
      </div>
      
      {/* Optional: Dots indicator */}
      {texts.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {texts.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white/80 scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsVisible(true);
                }, 150);
              }}
              aria-label={`Go to text ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TextCarousel;