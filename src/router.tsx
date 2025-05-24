
import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";

export const router = createBrowserRouter([{
  path: "/",
  errorElement: <Login />,
  children: [{
      index:true, //Esta es la ruta raiz"/"
      element: <Login/>,
    },
    {
      path: "/chat",
      element: <Chat/>,
    },
   
  ]}
])