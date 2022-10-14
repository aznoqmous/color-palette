export default class Color {
    constructor(color){
        this.color = color
        this.rgb = this.getRgb()
        this.hsl = this.rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b)
    }

    clone(){
        return new Color(this.toString())
    }

    toString(){
        this.rgb = this.hslToRgb(this.hsl.h, this.hsl.s, this.hsl.l)
        return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`
    }

    toHexString(){
        this.rgb = this.hslToRgb(this.hsl.h, this.hsl.s, this.hsl.l)
        const componentToHex = (c) => {
            c = c > 255 ? 255 : c
            c = c < 0 ? 0 : c
            var hex = Math.floor(c).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(this.rgb.r) + componentToHex(this.rgb.g) + componentToHex(this.rgb.b);
    }

    getRgb(){
        let c = document.createElement('canvas')
        c.width = 1
        c.height = 1
        let ctx = c.getContext('2d')
        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, 1, 1)
        let colorData = ctx.getImageData(0, 0, 1, 1).data
        
        return {
            r: colorData[0],
            g: colorData[1],
            b: colorData[2]
        }

    }

    /*rgbToHsl(r,g,b){
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
            ? l === r
            ? (g - b) / s
            : l === g
            ? 2 + (b - r) / s
            : 4 + (r - g) / s
            : 0;
        return {
            h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
            s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            l: (100 * (2 * l - s)) / 2
        };
    }

    hslToRgb(h,s,l){
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return {
            r: 255 * f(0), 
            g: 255 * f(8), 
            b: 255 * f(4)
        };
          
    }*/

    rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        return {h, s, l};
    }

    hslToRgb(h,s,l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255), 
            g: Math.round(g * 255), 
            b: Math.round(b * 255)
        };
    }
}