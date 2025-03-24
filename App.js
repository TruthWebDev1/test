import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.Pi = window.Pi || {};
    Pi.init({ version: "2.0", sandbox: true }, () => {
      console.log("Pi Network App running in Sandbox mode!");
    });
  }, []);

  return <h1>Welcome to My Pi App!</h1>;
}

export default App;
