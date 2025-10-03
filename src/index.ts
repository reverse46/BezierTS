import { RunService } from "@rbxts/services";

export class BezierCurve {
	private p0: Vector3;
    private p1: Vector3;
    private p2?: Vector3 = undefined;
    private p3?: Vector3 = undefined;
    private t: number = 0;
    private duration: number = 1;
    position: Vector3 = Vector3.zero;
    private connection: RBXScriptConnection | undefined = undefined;
    private wantToStop: boolean = false;

    /**
     * Constructor for BezierCurve.
     * @param {number} duration - the duration of the animation in seconds
     * @param {BezierPositions} positions - the positions of the bezier curve
     * @remarks The constructor sets the positions of the bezier curve and the duration of the animation.
     */
    constructor(
        duration: number, positions: BezierPositions
    ) {
        this.p0 = positions.p0;
        this.p1 = positions.p1;
        this.p2 = positions.p2;
        this.p3 = positions.p3;

        this.duration = duration;
        this.position = positions.p0;
    }

    /**
     * Play the animation.
     * @param {((endedNaturally: boolean) => void)} [callback] - an optional callback that will be called when the animation ends. If the animation ended naturally (i.e. it wasn't stopped), the callback will be called with `endedNaturally` set to true. If the animation was stopped, the callback will be called with `endedNaturally` set to false.
     * @remarks If the animation is already playing, this method will do nothing.
     */
    play(callback?: (endedNaturally: boolean) => void) {
        if (this.connection) return;

        this.t = 0;
        this.connection = RunService.Heartbeat.Connect((dt) => {
            this.t = math.clamp(this.t + dt / this.duration, 0, 1);

            if (!this.p2 && !this.p3) {
                let position = BezierCurve.linearBezier(this.t, this.p0, this.p1);
                this.position = position;
            }

            if (this.p2 && this.p3) {
                let position = BezierCurve.cubicBezier(this.t, this.p0, this.p1, this.p2, this.p3);
                this.position = position;
            }

            if (this.p2 && !this.p3) {
                let position = BezierCurve.quadraticBezier(this.t, this.p0, this.p1, this.p2);
                this.position = position;
            }

            if (this.t >= 1 || this.wantToStop) {
                this.connection?.Disconnect();
                this.connection = undefined;

                if (this.wantToStop) {
                    if (callback) callback(false);
                } else {
                    if (callback) callback(true);
                }
            }
        })
    }

    /**
     * Stops the animation.
     * @remarks This method will stop the animation if it is currently playing. If the animation is not playing, this method will do nothing.
     */
    stop() {
        this.wantToStop = true;
    }

    /**
     * Calculate the position of a point on a quadratic bezier curve.
     * @param {number} t - a value between 0 and 1, where 0 is the start of the curve and 1 is the end of the curve
     * @param {Vector3} p0 - the starting point of the curve
     * @param {Vector3} p1 - the first control point of the curve
     * @param {Vector3} p2 - the second control point of the curve
     * @returns {Vector3} - the calculated position of the point on the curve
     */
    static quadraticBezier(t: number, p0: Vector3, p1: Vector3, p2: Vector3): Vector3 {
        const oneMinusT = 1 - t;
        return p0.mul(oneMinusT * oneMinusT)
            .add(p1.mul(2 * oneMinusT * t))
            .add(p2.mul(t * t));
    }


    /**
     * Calculate the position of a point on a linear bezier curve.
     * @param {number} t - a value between 0 and 1, where 0 is the start of the curve and 1 is the end of the curve
     * @param {Vector3} p0 - the starting point of the curve
     * @param {Vector3} p1 - the ending point of the curve
     * @returns {Vector3} - the calculated position of the point on the curve
     */
    static linearBezier(t: number, p0: Vector3, p1: Vector3): Vector3 {
        return p0.mul(1 - t).add(p1.mul(t));
    }

    /**
     * Calculate the position of a point on a cubic bezier curve.
     * @param {number} t - a value between 0 and 1, where 0 is the start of the curve and 1 is the end of the curve
     * @param {Vector3} p0 - the starting point of the curve
     * @param {Vector3} p1 - the first control point of the curve
     * @param {Vector3} p2 - the second control point of the curve
     * @param {Vector3} p3 - the ending point of the curve
     * @returns {Vector3} - the calculated position of the point on the curve
     */
    static cubicBezier(t: number, p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
        const oneMinusT = 1 - t;

        return p0.mul(oneMinusT ** 3)
            .add(p1.mul(3 * oneMinusT ** 2 * t))
            .add(p2.mul(3 * oneMinusT * t ** 2))
            .add(p3.mul(t ** 3));
    }
}

export class BezierPositions {
    p0: Vector3;
    p1: Vector3;
    p2?: Vector3;
    p3?: Vector3;
    
    /**
     * Constructor for BezierPositions.
     * @param {Vector3} p0 - the starting point of the bezier curve
     * @param {Vector3} p1 - the first control point of the bezier curve
     * @param {Vector3} [p2] - the second control point of the bezier curve (optional)
     * @param {Vector3} [p3] - the ending point of the bezier curve (optional)
     * @remarks If p2 or p3 are not provided, the bezier curve will be a linear or quadratic curve respectively.
     */
    constructor(p0: Vector3, p1: Vector3, p2?: Vector3, p3?: Vector3) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}