import { Polygon3D } from './Polygon3D'

export class Surface3D {
    constructor(df) {
        this.df = df

        const coords = (i, j) => [
            df.columns[j], df.index[i], df.values[i][j]
        ]

        const points = (i, j) => [
            coords(i, j), coords(i, j + 1), coords(i + 1, j + 1), coords(i + 1, j),
        ]

        this.polygons = []

        for (let i = 0; i < df.index.length - 1; i++) {
            for (let j = 0; j < df.columns.length - 1; j++) {
                this.polygons.push(new Polygon3D(points(i, j)))
            }
        }
        
    }

    scale(scales) {
        this.polygons = this.polygons.map(shape => shape.scale(scales))
        return this
    }

    rotate(center, angles) {
        this.polygons = this.polygons.map(shape => shape.rotate(center, angles))
        return this
    }

    get paths() {
        const compare = (a, b) => {
            if (a.centroid.z < b.centroid.z) return -1
            if (a.centroid.z > b.centroid.z) return +1
            return 0
        }

        return this.polygons.sort(compare)
    }
}