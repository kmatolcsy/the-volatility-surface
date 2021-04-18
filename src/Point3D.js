import { matrix, multiply, transpose, index, sin, cos } from 'mathjs';


export class Point3D {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    subtract(other) {
        this.x -= other.x
        this.y -= other.y
        this.z -= other.z

        return this
    }

    rotateX(gamma) {
        return matrix([
            [1, 0, 0],
            [0, cos(gamma), -sin(gamma)],
            [0, sin(gamma), +cos(gamma)]
        ])
    }

    rotateY(beta) {
        return matrix([
            [+cos(beta), 0, sin(beta)],
            [0, 1, 0],
            [-sin(beta), 0, cos(beta)]
        ])
    }

    rotateZ(alpha) {
        return matrix([
            [cos(alpha), -sin(alpha), 0],
            [sin(alpha), +cos(alpha), 0],
            [0, 0, 1]
        ])
    }

    scale(factor) {
        this.x *= factor
        this.y *= factor
        this.z *= factor

        return this
    }

    rotate(center, angles) {
        this.subtract(center)

        const { alpha, beta, gamma } = angles
        
        const rotations = [this.rotateZ(alpha), this.rotateY(beta), this.rotateX(gamma)]
        const rotationMatrix = rotations.reduce((p, c) => multiply(p, c))

        const vector = transpose(matrix([[this.x, this.y, this.z]]))
        const result = multiply(rotationMatrix, vector)

        // const newX = cos(alpha) * cos(beta) * this.x +
        //     + (cos(alpha) * sin(beta) * sin(gamma) - sin(alpha) * cos(gamma)) * this.y +
        //     + (cos(alpha) * sin(beta) * cos(gamma) + sin(alpha) * sin(gamma)) * this.z

        // const newY = sin(alpha) * cos(beta) * this.x +
        //     + (sin(alpha) * sin(beta) * sin(gamma) + cos(alpha) * cos(gamma)) * this.y +
        //     + (sin(alpha) * sin(beta) * cos(gamma) - cos(alpha) * sin(gamma)) * this.z

        // const newZ = -sin(beta) * this.x +
        //     + cos(beta) * sin(gamma) * this.y +
        //     + cos(beta) * cos(gamma) * this.z

        this.x = result.subset(index(0, 0))
        this.y = result.subset(index(1, 0))
        this.z = result.subset(index(2, 0))

        return this
    }
}