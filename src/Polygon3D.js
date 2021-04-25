import { mean } from 'mathjs'
import { line } from 'd3'

import { Point3D } from './Point3D'

export class Polygon3D {
    constructor(points, generator = line()) {
        this.points = points.map(point => new Point3D(point))
        this.generator = generator
    }

    scale(scales) {
        this.points = this.points.map(point => point.scale(scales))
        return this
    }

    rotate(center, angles) {
        this.points = this.points.map(point => point.rotate(center, angles))
        return this
    }

    get centroid() {
        return {
            x: mean(this.points.map(point => point.x)),
            y: mean(this.points.map(point => point.y)),
            z: mean(this.points.map(point => point.z))
        }
    }

    get area() {
        let s = 0
        const points = [...this.points, this.points[0]]

        for (let i = 0; i < points.length - 1; i++) {

            let p1 = points[i]
            let p2 = points[i + 1]

            s += (p2.x - p1.x) * (p2.y + p1.y)
        }

        return s
    }

    get data() {
        // orthogonal projection
        return this.generator(this.points.map(point => [point.x, point.y]))
    }

    get colorValue() {
        // mean of original z-values
        return mean(this.points.map(point => point.coordinates[2]))
    }
}