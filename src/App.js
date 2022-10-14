import ColorPalette from "./ColorPalette"
import Element from "./Element"

export default class App extends Element {
    constructor(){
        super()
        this.colorPalettes = []
        this.activeColorPalette = null
        this.constructor.instance = this
        this.container = this.createElement({ class: "app" }, document.body)
        
        
        
        this.build()
        this.load()
        this.buildColorPalettes()
        
        this.import()
    }

    import(){
        let dataUrl = new URL(window.location).searchParams.get("import")
        if(dataUrl){
            let colorPalette = ColorPalette.fromDataUrl(dataUrl)
            this.addColorPalette(colorPalette)
            this.save()
            history.pushState("", "", "/")
        }
    }

    build(){
        this.colorPalettesContainer = this.createElement({
            class: "color-palettes"
        }, this.container)
        this.activeColorPaletteContainer = this.createElement({
            class: "active-color-palette"
        }, this.container)
    }

    buildColorPalettes(){
        if(this.buildTimeOut) clearTimeout(this.buildTimeOut)
        this.colorPalettesContainer.innerHTML = ""

        this.colorPalettes.map(cp => {
            let element = this.createElement({
                class: "color-palette",
            }, this.colorPalettesContainer)
            if(cp == this.activeColorPalette) element.classList.add('active')
            this.createElement({
                text: cp.opts.name,
                tagName: "span"
            }, element)
            let c = cp.generateImage(10)
            element.appendChild(c)
            
            this.createElement({
                class: "material-symbols-outlined",
                text: "edit",
                tagName: "i"
            }, element)
            .addEventListener('click', ()=>{
                this.setActiveColorPalette(cp)
                this.buildColorPalettes()
            })
            this.createElement({
                class: "material-symbols-outlined",
                text: "content_copy",
                tagName: "i"
            }, element)
            .addEventListener('click', ()=>{
                this.dupplicateColorPalette(cp)
            })
            this.createElement({
                class: "material-symbols-outlined",
                text: "delete",
                tagName: "i"
            }, element)
            .addEventListener('click', ()=>{
                this.deleteColorPalette(cp)
            })
        })
        let createButton = this.createElement({
            tagName: "span",
            class: "button",
            text: "Create new palette"
        }, this.colorPalettesContainer)
        createButton.addEventListener('click', ()=>{
            this.setActiveColorPalette(this.addColorPalette())
            this.buildColorPalettes()
        })
    }

    load(){
        let colorPalettes = localStorage.getItem('color-palettes') || null
        colorPalettes = JSON.parse(colorPalettes) || null
        if(!colorPalettes) this.loadDefault()
        else {
            colorPalettes.map(data => this.addColorPalette(data))
        }

        let activeColorPalette = this.findByUuid(localStorage.getItem('active-color-palette')) || this.colorPalettes[0]
        
        this.setActiveColorPalette(activeColorPalette)
        this.save()
    }
    
    findByUuid(uuid){
        return this.colorPalettes.match(cp => cp.uuid == uuid) || null
    }

    setActiveColorPalette(colorPalette){
        if(this.activeColorPalette){
            this.activeColorPalette.container.remove()
        }
        this.activeColorPalette = colorPalette
        localStorage.setItem('active-color-palette', this.activeColorPalette.uuid)
        this.activeColorPaletteContainer.appendChild(colorPalette.container)
    }

    loadDefault(){
        this.addColorPalette()
    }

    addColorPalette(data){
        
        data = Object.assign({
            uuid: null,
            colors: null,
            opts: null
        }, data)

        if(this.colorPalettes.filter(cp => cp.uuid == data.uuid).length) return
        let cp = new ColorPalette(data.uuid, data.colors, data.opts)
        this.colorPalettes.push(cp)
        return cp
    }
    
    save(){
        localStorage.setItem('color-palettes', JSON.stringify(this.colorPalettes.map(cp => cp.serialize())))
        this.lazyBuildColorPalettes()
    }

    lazyBuildColorPalettes(){
        if(this.buildTimeOut) clearTimeout(this.buildTimeOut)
        this.buildTimeOut = setTimeout(()=> this.buildColorPalettes(), 500)
    }

    dupplicateColorPalette(cp){
        let data = cp.serialize()
        data.uuid = null
        data.opts.name += " (copy)"
        this.setActiveColorPalette(this.addColorPalette(data))
        this.save()
    }

    deleteColorPalette(cp){
        this.colorPalettes = this.colorPalettes.filter(colorPalette => colorPalette.uuid != cp.uuid)
        if(this.activeColorPalette.uuid == cp.uuid) this.setActiveColorPalette(this.colorPalettes[0])
        this.save()
    }

    static get Instance(){
        if(!this.instance) new this()
        return this.instance
    }
}