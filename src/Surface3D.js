import { min, max, mean } from 'mathjs'

import { Polygon3D } from './Polygon3D'
import { compare } from './utils'

export class Surface3D {
    constructor(df) {
        this.df = df

        // marks
        this.polygons = []

        const coords = (i, j) => [
            df.columns[j], df.index[i], df.values[i][j]
        ]

        const points = (i, j) => [
            coords(i, j), coords(i, j + 1), coords(i + 1, j + 1), coords(i + 1, j),
        ]

        for (let i = 0; i < df.index.length - 1; i++) {
            for (let j = 0; j < df.columns.length - 1; j++) {
                this.polygons.push(new Polygon3D(points(i, j)))
            }
        }

        // axes
        this.polylines = {
            x: []
        }

        for (let j = 0; j < df.columns.length - 1; j++) {
            this.polylines.x.push(new Polygon3D([
                [df.columns[j], min(df.index), min(df.values.flat())],
                [df.columns[j + 1], min(df.index), min(df.values.flat())]
            ]))
        }


        
    }

    scale(scales) {
        this.polygons = this.polygons.map(shape => shape.scale(scales))
        this.polylines.x = this.polylines.x.map(shape => shape.scale(scales))
        return this
    }

    rotate(center, angles) {
        this.polygons = this.polygons.map(shape => shape.rotate(center, angles))
        this.polylines.x = this.polylines.x.map(shape => shape.rotate(center, angles))
        return this
    }

    get centroid() {
        return {
            x: mean(this.polygons.map(polygon => polygon.centroid.x)),
            y: mean(this.polygons.map(polygon => polygon.centroid.y)),
            z: mean(this.polygons.map(polygon => polygon.centroid.z))
        }
    }

    get paths() {
        return this.polygons.sort(compare)
    }

    get axes() {
        return this.polylines
    }
}