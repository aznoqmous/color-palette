import App from "./App"
import Color from "./Color"
import Draggable from "./Draggable"
import Element from "./Element"

export default class ColorPalette extends Element {
    constructor(uuid=null, colors=[], opts={}){
        super()
        this.uuid = uuid || Date.now()
        this.opts = Object.assign({
            hStep: 8,
            sStep: 5,
            lStep: 10,
            upSteps: 5,
            downSteps: 5,
            name: "New color palette"
        }, opts)
        this.colors = colors || [
            'red',
            'orange',
            'gold',
            'limegreen',
            'cyan',
            'deepskyblue',
        ]
        this.colorDatas = []
        this.build()
    }

    serialize(){
        return {
            uuid: this.uuid,
            colors: this.colorDatas.map(c => c.color.toHexString()),
            opts: Object.fromEntries(this.inputs.map(input => [input.name, input.value]))
        }
    }

    build(){
        this.container = document.createElement('div')
        this.container.className = "color-palette"

        this.settingsContainer = this.createElement({
            class: "settings-container"
        }, this.container)

        this.nameInput = this.createInput("Palette name", {
            type: "text",
            value: this.opts.name,
            name: 'name'
        }, this.settingsContainer, "input-title")
        this.hStepInput = this.createInput("Hue step", {
            type: "number",
            steps: 1,
            value: this.opts.hStep,
            name: 'hStep'
        }, this.settingsContainer)
        this.sStepInput = this.createInput("Saturation step",{
            type: "number",
            steps: 1,
            value: this.opts.sStep,
            name: 'sStep'
        }, this.settingsContainer)
        this.lStepInput = this.createInput("Luminosity step",{
            type: "number",
            steps: 1,
            value: this.opts.lStep,
            name: 'lStep'
        }, this.settingsContainer)
        this.upStepsInput = this.createInput("Lighter steps",{
            type: "number",
            steps: 1,
            value: this.opts.upSteps,
            name: 'upSteps',
            max: 10
        }, this.settingsContainer)
        this.downStepsInput = this.createInput("Darker steps",{
            type: "number",
            steps: 1,
            value: this.opts.downSteps,
            name: 'downSteps',
            max: 10
        }, this.settingsContainer)
        this.inputs = [
            this.nameInput,
            this.hStepInput,
            this.sStepInput,
            this.lStepInput,
            this.upStepsInput,
            this.downStepsInput
        ]
        this.inputs.map(i => i.addEventListener('keyup', ()=> this.refresh()))
        
        this.colorInput = this.createInput("Add new color", {
            type: "text",
            placeholder: "Enter color code then hit Enter"
        }, this.settingsContainer)
        this.colorPreview = this.createElement({
            class: "color-preview",
            tagName: "figure"
        }, this.colorInput.parentElement)
        this.colorInput.addEventListener('keyup', (e)=>{
            let color = new Color(this.colorInput.value)
            this.colorPreview.style.background = color.toString()
            if(e.key != "Enter") return;
            this.addColor(color)
            this.colorInput.value = ""
            this.colorPreview.style.background = null
            this.refresh()
        })

        this.generateButton = this.createElement({
            class: "button",
            text: "Copy as image to your clipboard"
        }, this.settingsContainer)
        this.generateButton.addEventListener('click', ()=> this.copyImage())
        
        this.colorsContainer = this.createElement({class: "colors-container"}, this.container)
        this.colors.map(color => this.addColor(new Color(color)))

    }

    addColor(color){
        let colorElement = document.createElement('div')
        colorElement.className = "colors"
        this.colorsContainer.appendChild(colorElement)
        this.generatePalette(color).map(c => {
            this.createColorElement(c, colorElement)
        })
        this.createSettingsElement(color, colorElement)
        this.colorDatas.push({
            element: colorElement,
            color: color
        })
    }

    refresh(){
        let colors = this.colorDatas.map(c => c.color)
        this.colorDatas.map(c => c.element.remove())
        this.colorDatas = []
        colors.map(c => this.addColor(c))
        this.opts.name = this.nameInput.value
        App.Instance.save()
    }

    generatePalette(color){
        let colors = []
        for(let i = this.downStepsInput.value; i > 0; i--){
            let currentColor = color.clone()
            currentColor.hsl.h -= this.hStepInput.value * i / 360
            currentColor.hsl.s -= this.sStepInput.value * i / 100
            currentColor.hsl.l -= this.lStepInput.value * i / 100
            colors.push(currentColor)
        }
        colors.push(color)
        for(let i = 0; i < this.upStepsInput.value; i++){
            let currentColor = color.clone()
            currentColor.hsl.h += this.hStepInput.value * (i+1) / 360
            currentColor.hsl.s += this.sStepInput.value * (i+1) / 100
            currentColor.hsl.l += this.lStepInput.value * (i+1) / 100
            colors.push(currentColor)
        }
        return colors
    }

    generateImage(size=32){
        let c = document.createElement('canvas')
        c.width = (parseInt(this.downStepsInput.value) + parseInt(this.upStepsInput.value) + 1) * size
        c.height = (this.colorDatas.length) * size
        c.style.width = c.width + "px"
        c.style.height = c.height + "px"
        let ctx = c.getContext('2d')
        ctx.imageSmoothingEnabled = false
        this.colorDatas.map((colorData, y)=>{
            this.generatePalette(colorData.color).map((color, x)=>{
                ctx.fillStyle = color.toHexString()
                ctx.fillRect(x*size,y*size,1*size,1*size)
            })
        })
        return c
    }

    copyImage(){
        try {
            this.generateImage().toBlob(blob => {
                navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob})])
            })
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    createSettingsElement(color, colorElement){
        let settings = document.createElement('div')
        settings.className = "settings"

        let dragBtn = this.createElement({
            tagName: "span",
            class: "drag material-symbols-outlined",
            text: "drag_indicator"
        }, settings)
        Draggable.bind(dragBtn, colorElement)

        colorElement.addEventListener('dragend', ()=>{
            let colorElements = [...this.colorsContainer.children]
            this.colorDatas = this.colorDatas
            .map(d => {
                d.element.index = colorElements.indexOf(d.element)
                return d
            })
            .sort((a,b)=> a.element.index - b.element.index)
            App.Instance.save()
        })

        let deleteBtn = document.createElement('span')
        deleteBtn.className = "delete material-symbols-outlined"
        deleteBtn.innerHTML = "delete"
        deleteBtn.addEventListener('click', ()=> this.deleteColorElement(colorElement))
        settings.appendChild(deleteBtn)

        colorElement.appendChild(settings)
    }

    deleteColorElement(colorElement){
        let colorElements = [...this.colorsContainer.children]
        let index = colorElements.indexOf(colorElement)

        this.colorDatas.splice(index, 1)
        colorElement.remove()
        App.Instance.save()
    }

    getColorData(color){
        return this.colorDatas[this.getColorIndex(color)]
    }

    getColorIndex(color){
        return this.colorDatas.map(c => c.color).indexOf(color)
    }

    createColorElement(color, parent){
        let element = document.createElement('figure')
        element.style.background = color.toHexString()
        element.className = "color"
        parent.appendChild(element)
        element.addEventListener('click', ()=>{
            try {
                navigator.clipboard.writeText(color.toHexString())
              } catch (err) {
                console.error('Failed to copy: ', err);
              }
        })
        let colorValue = this.createElement({
            tagName: "span",
            text: color.toHexString()
        }, element)
        return element
    }
}