import App from "./App";
import "./extensions"
import "../scss/style.scss"
import Color from "./Color";
import ColorPalette from "./ColorPalette";

document.addEventListener('DOMContentLoaded', ()=>{
    new App()
})

window.colorpalette = ColorPalette