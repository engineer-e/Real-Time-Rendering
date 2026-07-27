class Interval{

    constructor(min,max){
        this.max = max
        this.min = min
    }

    size(){
        return this.max-this.min
    }

    contains(x){
         return (this.min <= x) && (x <= this.max)
    }

    surrounds(x){
        return (this.min < x) && (x < this.max)
    }

    clamp(x){
        if(x < this.min) return this.min 
        if(x > this.max) return this.max
        return x
    }


    
}

var empty = new Interval(Number.MAX_VALUE,Number.MIN_VALUE)
var universe = new Interval(Number.MIN_VALUE,Number.MAX_VALUE)

window.Empty = empty
window.Universe = universe

window.Interval = Interval