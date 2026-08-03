class HittableList extends Hittable {
  constructor(objects = []) {
    super();

    this.objects = objects;
    this.bbox = null;

    for (const object of this.objects) {
      if (this.bbox === null) this.bbox = object.bounding_box();
      else
        this.bbox = new AABB({
          box0: this.bbox,
          box1: object.bounding_box(),
        });
    }
  }

  clear() {
    this.objects = [];
    this.bbox = null;
  }

  add(object) {
    this.objects.push(object);

    if (this.bbox === null) this.bbox = object.bounding_box();
    else
      this.bbox = new AABB({
        box0: this.bbox,
        box1: object.bounding_box(),
      });
  }

  hit(r, ray_t, hit_record) {
    let temp_rec = new HitRecord();
    let hit_anything = false;
    let closest_so_far = ray_t.max;

    for (const object of this.objects) {
      if (
        object.hit(
          r,
          new Interval({ min: ray_t.min, max: closest_so_far }),
          (rec) => {
            temp_rec = rec;
          },
        )
      ) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        hit_record(temp_rec);
      }
    }

    return hit_anything;
  }

  bounding_box() {
    return this.bbox;
  }
}

// class Translate extends Hittable {
//   constructor(object, offset) {
//     super();
//     this.object = object;
//     this.offset = offset;

//     this.bbox = new AABB({
//       box0: object.bounding_box(),
//       offset: offset,
//     });
//   }

//   bounding_box() {
//     return this.bbox;
//   }

//   hit(r, ray_t, hit_record) {
//     var rec = new HitRecord();

//     //Move the ray backwards by the offset
//     var offset_r = new Ray({
//       origin: Vec3.sub(r.origin(), this.offset),
//       direction: r.direction(),
//       time: r.time(),
//     });

//     // Determine whether an intersection exists along the offset ray (and if so, where)
//     if (
//       !this.object.hit(offset_r, ray_t, (r) => {
//         rec = r;
//       })
//     ) {
//       return false;
//     }

//     // Move the intersection point forwards by the offset
//     rec.p = Vec3.add(rec.p, this.offset);

//     hit_record(rec);
//     return true;
//   }
// }

// class RotateY extends Hittable {
//   constructor(object, angle) {
//     super();
//     this.object = object;
//     var radians = Vec3.degrees_to_radians(angle);
//     this.sin_theta = Math.sin(radians);
//     this.cos_theta = Math.cos(radians);

//     this.bbox = object.bounding_box();

//     var min = new Point3(Infinity, Infinity, Infinity);
//     var max = new Point3(-Infinity, -Infinity, -Infinity);

//     for (var i = 0; i < 2; i++) {
//       for (var j = 0; j < 2; j++) {
//         for (var k = 0; k < 2; k++) {
//           var x = i * this.bbox.x.max + (1 - i) * this.bbox.x.min;
//           var y = j * this.bbox.y.max + (1 - j) * this.bbox.y.min;
//           var z = k * this.bbox.z.max + (1 - k) * this.bbox.z.min;

//           var newx = this.cos_theta * x + this.sin_theta * z;
//           var newz = -this.sin_theta * x + this.cos_theta * z;

//           var tester = new Vec3(newx, y, newz);

//           for (var c = 0; c < 3; c++) {
//             min.e[c] = Math.min(min.e[c], tester.e[c]);
//             max.e[c] = Math.max(max.e[c], tester.e[c]);
//           }
//         }
//       }
//     }

//     this.bbox = new AABB({ a: min, b: max });
//   }

//   hit(r, ray_t, hit_record) {
//     var rec = new HitRecord()
//     // Transform the ray from world space to object space.
//     var origin = new Point3(
//     this.cos_theta * r.origin().x + this.sin_theta * r.origin().z,
//     r.origin().y,
//     -this.sin_theta * r.origin().x + this.cos_theta * r.origin().z
// );

//     var direction = new Vec3(
//       this.cos_theta * r.direction().x - this.sin_theta * r.direction().z,
//       r.direction().y,
//       this.sin_theta * r.direction().x + this.cos_theta * r.direction().z,
//     );
//     // Determine whether an intersection exists in object space (and if so, where).
//     // Transform the intersection from object space back to world space.

//     var rotated_r = new Ray({
//       origin: origin,
//       direction: direction,
//       time: r.time(),
//     });

//     if (!this.object.hit(rotated_r, ray_t, (r)=>{rec = r})) {
//       return false;
//     }

//     rec.p = new Point3(
//       this.cos_theta * rec.p.x + this.sin_theta * rec.p.z,
//       rec.p.y,
//       -this.sin_theta * rec.p.x + this.cos_theta * rec.p.z,
//     );
//     // rec.N = new Point3(
//     //   this.cos_theta * rec.N.x + this.sin_theta * rec.N.z,
//     //   rec.p.y,
//     //   -this.sin_theta * rec.N.x + this.cos_theta * rec.p.N,
//     // );

//     rec.N = new Vec3(
//     this.cos_theta * rec.N.x + this.sin_theta * rec.N.z,
//     rec.N.y,
//     -this.sin_theta * rec.N.x + this.cos_theta * rec.N.z
// );
//     hit_record(rec)
//     return true
//   }
// }

class Translate extends Hittable {
  constructor(object, offset) {
    super();

    this.object = object;
    this.offset = offset;

    this.bbox = AABB.add({
      bbox: object.bounding_box(),
      offset: offset,
    });
  }

  bounding_box() {
    return this.bbox;
  }

  hit(r, ray_t, hit_record) {
    // Move the ray into the object's local space
    const movedRay = new Ray({
      origin: Vec3.sub(r.origin(), this.offset),
      direction: r.direction(),
      time: r.time(),
    });

    let rec = null;

    if (
      !this.object.hit(movedRay, ray_t, (tempRec) => {
        rec = tempRec;
      })
    ) {
      return false;
    }

    // Move the hit point back into world space
    rec.p = Vec3.add(rec.p, this.offset);

    // If your HitRecord has this function, uncomment it.
    // rec.set_face_normal(movedRay, rec.N);

    hit_record(rec);
    return true;
  }
}
class RotateY extends Hittable {
  constructor(object, angle) {
    super();

    this.object = object;

    const radians = Vec3.degrees_to_radians(angle);

    this.sin_theta = Math.sin(radians);
    this.cos_theta = Math.cos(radians);

    const bbox = object.bounding_box();

    let min = new Point3(Infinity, Infinity, Infinity);
    let max = new Point3(-Infinity, -Infinity, -Infinity);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const x = i ? bbox.x.max : bbox.x.min;
          const y = j ? bbox.y.max : bbox.y.min;
          const z = k ? bbox.z.max : bbox.z.min;

          const newx = this.cos_theta * x + this.sin_theta * z;
          const newz = -this.sin_theta * x + this.cos_theta * z;

          const tester = new Point3(newx, y, newz);

          min.x = Math.min(min.x, tester.x);
          min.y = Math.min(min.y, tester.y);
          min.z = Math.min(min.z, tester.z);

          max.x = Math.max(max.x, tester.x);
          max.y = Math.max(max.y, tester.y);
          max.z = Math.max(max.z, tester.z);
        }
      }
    }

    this.bbox = new AABB({
      a: min,
      b: max,
    });
  }

  bounding_box() {
    return this.bbox;
  }

  hit(r, ray_t, hit_record) {
    // Rotate ray into object space (-angle)

    const origin = new Point3(
      this.cos_theta * r.origin().x + this.sin_theta * r.origin().z,
      r.origin().y,
      -this.sin_theta * r.origin().x + this.cos_theta * r.origin().z
    );

    const direction = new Vec3(
      this.cos_theta * r.direction().x + this.sin_theta * r.direction().z,
      r.direction().y,
      -this.sin_theta * r.direction().x + this.cos_theta * r.direction().z
    );

    const rotated_r = new Ray({
      origin,
      direction,
      time: r.time(),
    });

    let rec = null;

    if (
      !this.object.hit(rotated_r, ray_t, (tempRec) => {
        rec = tempRec;
      })
    ) {
      return false;
    }

    // Rotate hit point back to world space (+angle)

    const p = new Point3(
      this.cos_theta * rec.p.x - this.sin_theta * rec.p.z,
      rec.p.y,
      this.sin_theta * rec.p.x + this.cos_theta * rec.p.z
    );

    // Rotate normal back to world space

    const normal = new Vec3(
      this.cos_theta * rec.N.x - this.sin_theta * rec.N.z,
      rec.N.y,
      this.sin_theta * rec.N.x + this.cos_theta * rec.N.z
    );

    rec.p = p;
    rec.N = normal;

    // Preferred if your HitRecord supports it:
    // rec.set_face_normal(r, normal);

    hit_record(rec);
    return true;
  }
}

window.HittableList = HittableList;
window.Translate = Translate;
window.RotateY = RotateY;
