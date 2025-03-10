
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="text-center max-w-md animate-scale-in">
        <Film className="h-24 w-24 text-gold mx-auto mb-6 opacity-50" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-cinema-300 mb-8">
          This scene didn't make the final cut. The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-gold hover:bg-gold/90 text-cinema-950 font-medium">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
