import { Polygon3D } from './Polygon3D'

export class Surface3D {
    constructor(df) {
        this.df = df
        this.polygons = []

        for (let i = 0; i < this.df.index.length - 1; i++) {
            for (let j = 0; j < this.df.columns.length - 1; j++) {
                this.polygons.push(this._polygon(i, j))
            }
        }
    }

    _polygon(i, j) {
        const indices = [[i, j], [i, j + 1], [i + 1, j + 1], [i + 1, j]]

        return new Polygon3D(
            indices.map(([i, j]) => [
                this.df.columns[j],
                this.df.index[i],
                this.df.values[i][j]
            ])
        )
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
        return this.polygons
    }
}