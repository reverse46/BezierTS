# Roblox Typescript bezier curves
### Introduction
This library helps you create smooth position animations with bezier curves in Roblox.
### Getting started
First set the positions by using `new BezierPositions(p0, p1, p2, p3)`
> p0, p1, p2 and p3 are Vector3 objects

> p2 and p3 are optional

depending on input you'll get a following curve
| Set positions | Curve type |
| ----------    | ---------- |
| p0 & p1       | linear     |
| p0, p1 & p2   | quadratic  |
| ALL           | cubic      |

[Visualization](https://www.jasondavies.com/animated-bezier/)

To create a bezier curve simply type `new BezierCurve(duration, positions)`
> duration: the duration of the animation in seconds

> positions: the positions of the bezier curve represented by a BezierPositions object

Playing a bezier curve
```
let pos1 = new Vector3(0, 0, 0); // starting position
let pos2 = new Vector3(0, 50, 0); // goal position

let positions = new BezierPositions(pos1, pos2);

let curve = new BezierCurve(1, positions);

curve.play();
```
The curve animation is handled on the RunService, so it can be played from a script without needing any manual animation or calling a method every frame

Accessing the current position of the curve by `curve.position` this returns a Vector3 object

### Types

```
class BezierPositions(p0: Vector3, p1: Vector3, p2?: Vector3, p3: Vector3)
---
p0: Vector3
p1: Vector3
p2?: Vector3
p3?: Vector3

class BezierCurve(duration: number, positions: BezierPositions)
---
position: Vector3
play(callback?: (enderNaturally: boolean) => void)
stop()
```

### Advanced

You can stop a curve by using the `curve.stop()` method

The play method accepts a callback method that is called when the animation ends `curve.play(callback)`
when the animation ended naturally (the animation time ended) the callback will be called with a `true` param
otherwise if the animation was ended with the `stop()` method then it'll be called with the `false` param

The BezierCurve class also has static methods for all types of the curves if you want to do them manually

### Full example
```
// code example
let positions = new BezierPositions(
	new Vector3(0, 0, 0),
	new Vector3(20, 50, 0),
	new Vector3(40, 0, 0)
);

function callback(endedNaturally: boolean) {
	print('curve completed')
	print(endedNaturally)
}

let curve = new BezierCurve(5, positions);

curve.play(callback);

let shouldEndEarly = false;

let connection = RunService.Heartbeat.Connect(() => {
	part.Position = curve.position;
	if (shouldEndEarly) {
	
		curve.stop();
		connection.Disconnect();
		connection = undefined;
	}
})
```