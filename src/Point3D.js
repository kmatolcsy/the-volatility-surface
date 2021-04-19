import { matrix, multiply, transpose, index, sin, cos } from 'mathjs';


export class Point3D {
    constructor(coordinates) {
        this.x = coordinates[0]
        this.y = coordinates[1]
        this.z = coordinates[2]
    }

    _subtract(other) {
        this.x -= other.x
        this.y -= other.y
        this.z -= other.z

        return this
    }

    _rotateX(gamma) {
        return matrix([
            [1, 0, 0],
            [0, cos(gamma), -sin(gamma)],
            [0, sin(gamma), +cos(gamma)]
        ])
    }

    _rotateY(beta) {
        return matrix([
            [+cos(beta), 0, sin(beta)],
            [0, 1, 0],
            [-sin(beta), 0, cos(beta)]
        ])
    }

    _rotateZ(alpha) {
        return matrix([
            [cos(alpha), -sin(alpha), 0],
            [sin(alpha), +cos(alpha), 0],
            [0, 0, 1]
        ])
    }

    scale(scales) {
        this.x = scales.x(this.x)
        this.y = scales.y(this.y)
        this.z = scales.z(this.z)

        return this
    }

    rotate(center, angles) {
        this._subtract(center)

        const { alpha, beta, gamma } = angles
        
        const rotations = [this._rotateZ(alpha), this._rotateY(beta), this._rotateX(gamma)]
        const rotationMatrix = rotations.reduce((p, c) => multiply(p, c))

        const vector = transpose(matrix([[this.x, this.y, this.z]]))
        const result = multiply(rotationMatrix, vector)

        this.x = result.subset(index(0, 0))
        this.y = result.subset(index(1, 0))
        this.z = result.subset(index(2, 0))

        return this
    }
}