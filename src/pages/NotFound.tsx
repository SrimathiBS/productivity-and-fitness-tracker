
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <p className="text-2xl text-slate-700 dark:text-slate-300 mb-6">
          Oops! We couldn't find that page
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or might have been moved.
        </p>
        <Link to="/">
          <Button className="px-6">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
