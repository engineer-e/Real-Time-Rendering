class Interval{

    constructor({min,max,a,b}){
        
        if((a==null)&&(b==null)){
            this.max = max
            this.min = min
        }else{
            this.min = (a.min <= b.min) ? a.min : b.min
            this.max = (a.max >= b.max) ? a.max : b.max  
        }

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

    expand(delta){
        var padding = delta/2 
        return new Interval({min:this.min-padding,max:this.max+padding})
    }

    
}

var empty = new Interval({
    min:Number.MAX_VALUE,
    max:-Number.MAX_VALUE
});
var universe = new Interval({min:Number.MIN_VALUE,max:Number.MAX_VALUE})

window.Empty = empty
window.Universe = universe

window.Interval = Interval