import App from "./App";
import "./extensions"
import "../scss/style.scss"
import Color from "./Color";

document.addEventListener('DOMContentLoaded', ()=>{
    new App()

    console.log(
        (new Color("#ffd100")).toHexString()
    )
})