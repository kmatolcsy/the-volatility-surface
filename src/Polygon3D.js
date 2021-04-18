import { line } from 'd3'

export class Polygon3D {
    constructor(points, generator = line()) {
        this.points = points
        this.generator = generator
    }

    scale(factor) {
        this.points = this.points.map(point => point.scale(factor))

        return this
    }

    rotate(center, angles) {
        this.points = this.points.map(point => point.rotate(center, angles))

        return this
    }

    data() {
        return this.generator(this.points.map(point => [point.x, point.y]))
    }
}