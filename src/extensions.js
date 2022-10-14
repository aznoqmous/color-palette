Array.prototype.for = function(callback){
    return this.constructor.for(this.length, callback)
}

Array.prototype.remove = function(element){
    this.splice(this.indexOf(element), 1)
}

Array.prototype.random = function(){
    return this.sort(() => Math.random() > 0.5 ? 1 : -1)
}

Array.prototype.pickRandom = function(){
    return this[Math.floor(Math.random()*this.length)]
}

Array.prototype.unique = function(){
    return this.filter((value,index)=> this.indexOf(value) === index)
}

Array.prototype.match = function(filterCallback){
    let matches = this.filter(filterCallback)
    return matches.length ? matches[0] : null
}

Array.prototype.sortByKeyDesc = function(key){
    return this.sort((a,b) => a[key] <= b[key] ? 1 : -1)
}

Array.prototype.sortByKeyAsc = function(key){
    return this.sort((a,b) => a[key] >= b[key] ? 1 : -1)
}

Array.prototype.total = function(key){
    let value = 0
    this.map(el => value += el[key])
    return value
}

Array.prototype.average = function(key){
    return this.total(key) / this.length
}

Array.prototype.min = function(key){
    let min = 10000000
    this.map(el => {
        if(el[key] < min) min = el[key]
    })
    return min
}

Array.prototype.max = function(key){
    let max = -10000000
    this.map(el => {
        if(el[key] > max) max = el[key]
    })
    return max
}

Array.for = function(count, callback){
    let res = []
    for(let i = 0; i < count; i++) res.push(callback(i))
    return res
}