class Ray{
    constructor(a,b){
      this.A = a
      this.B = b
    }

    origin(){return this.A}
    direction(){return this.B}
    at(t){
        // Scales vector B by scalar t, then adds origin vector A
    const scaled_dir = this.A.mul({ t: t, v: this.B });
    return this.A.add(this.A, scaled_dir);
    }
}

window.Ray = Ray