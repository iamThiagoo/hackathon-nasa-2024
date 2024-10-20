import "./src/assets/css/style.css";
import { bootstrapApp } from "./src/app/bootstrap.js";

bootstrapApp().catch((error) => {
  console.error("Failed to initialize AstroNEXO:", error);

  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
});
