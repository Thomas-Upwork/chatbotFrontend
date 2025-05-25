
import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Chat />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  // Add other client-side routes here
]);
// export const router = createBrowserRouter([{
//   path: "/",
//   errorElement: <Login />,
//   children: [{
//       index:true, //Esta es la ruta raiz"/"
//       element: <Chat/>,
//     },
//     {
//       path: "/login",
//       element: <Login />,
//     },
//   ]}
// ])