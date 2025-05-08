
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Main from "../components/Layout/Main";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    try {
      const success = await login(username, password);
      if (!success) {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Main>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-[#c0c0c0] border border-[#808080] shadow-md">
          <div className="window-header">
            <span>Admin Login</span>
            <span className="window-close">×</span>
          </div>
          
          <form onSubmit={handleLogin} className="p-4">
            {error && (
              <div className="p-2 mb-4 bg-[#ff0000] border border-[#800000] text-white">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <Label htmlFor="username" className="block mb-1">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full border border-[#808080] bg-white p-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="password" className="block mb-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-[#808080] bg-white p-1"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="sketchy-button"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Main>
  );
};

export default Login;
