import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { TransactionsPage } from "./components/TransactionsPage";
import { Footer } from "./components/Footer";

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
        loader: () => 
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;