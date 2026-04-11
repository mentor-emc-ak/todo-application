import { useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="body" id="home-section">
        <h1>Vite + React</h1>
      </div>
      <Footer />
    </>
  );
}

export default App;
