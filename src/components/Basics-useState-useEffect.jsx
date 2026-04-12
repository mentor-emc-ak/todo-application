import { useEffect, useState } from "react";

function AuthPage() {
  // let y = 100;
  const [y, setY] = useState(100);
  const [z, setZ] = useState(200);
  const [width, setWidth] = useState(window.innerWidth);

  function handleResize() {
    // console.log("Window resized, new width is", window.innerWidth);
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);


    return () => {
      // unmount cleanup
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    console.log("AuthPage useEffect, y is", y);
  }, [y]);

  useEffect(() => {
    console.log("AuthPage useEffect, z is", z);
  }, [z]);

  function handleClick() {
    // y = y + 1;
    setY(y + 1);
    console.log("Button clicked, y is now", y);
  }

  function handleClickZ() {
    setZ(z + 1);
    console.log("Button clicked, z is now", z);
  }

  return (
    <div>
      <h1>Window Width: {width}</h1>
      <button onClick={handleClick} className="border-4 mb-5 p-3">Y: {y}</button>
      <br />
      <button onClick={handleClickZ} className="border-4 p-3">Z: {z}</button>
    </div>
  );
}

export default AuthPage;