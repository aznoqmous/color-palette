export default class Element {

    createElement(attributes={}, parent=null){
        let element = document.createElement(attributes.tagName || "div")
        if(attributes.tagName) delete attributes.tagName
        if(attributes.text) {
            element.innerHTML = attributes.text
            delete attributes.text
        }
        for(let key in attributes) element.setAttribute(key, attributes[key])
        if(parent) parent.appendChild(element)
        return element
    }

    createInput(label, attributes={}, parent=null, className="input-group"){
        let inputGroup = this.createElement({ class: className }, parent)
        label = this.createElement({
            tagName: "label",
            text: label
        }, inputGroup)
        attributes = Object.assign({
            min: -255,
            max: 255
        }, attributes)
        attributes = Object.assign(attributes, {
            tagName: 'input',
            spellcheck: "false"
        })
        return this.createElement(attributes, inputGroup)
    }
}