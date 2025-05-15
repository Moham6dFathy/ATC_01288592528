
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <img 
        src="/homebanar.jpg"
        alt="Concert with fireworks" 
        className="w-full h-64 md:h-80 lg:h-[500px] object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Event ticketing made simple
          </h1>
          <p className="text-white/90 mb-6 text-lg max-w-lg">
            Discover and book the best events in your area. Find concerts, workshops, conferences, and more all in one place.
          </p>
          <Button asChild size="lg" className="font-medium bg-white text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            <Link to="/events">Discover events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
