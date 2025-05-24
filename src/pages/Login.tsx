import { useState } from "react";

export const Login = () => {
  const [message, setMessage] = useState<string>("");
  const [password,setPassword]= useState<string>("")
  const [isVisible,setIsVisible]=useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handelVisibility=()=>{
    setIsVisible((prev)=>!prev)
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("Loading...");

    try {
      const url = '/api/login'
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({password}),
      });
      const data = await response.json();
      setMessage(data.message);
      if(data.ok==true){
        window.location.href='/chat'
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("The server is busy");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-20 bg-black ">
      <div className="max-w-md mx-auto p-6 gap-4 text-white border-2 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-white mb-6">Log in</h2>
        <div>
          <div className="gap-x-3 flex items-center justify-between">
            <label
              htmlFor="loginPassword"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <button
              className="border rounded-md px-2  hover:bg-gray-700 "
              onClick={handelVisibility}
            >
              {isVisible ? 'hide' : 'show'}
            </button>
          </div>
          <input
            type={isVisible ? 'text' : 'password'}
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                handleSubmit();
              }
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="shhhhhh"
            id="loginPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={isLoading}
            className="my-6 rounded-md px-4 py-2 bg-gray-700 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors focus:ring-offset-2  disabled:opacity-50"
          >
            {isLoading ? 'Loading session...' : 'Log in'}
          </button>
        </div>

        {message && <p className="mt-4  text-sm">{message}</p>}
      </div>
    </div>
  );
};

