Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Common = Matter.Common;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
const Bodies = Matter.Bodies;

Common.setDecomp(decomp);

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true
    }
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

const stack = Composites.stack(-100, -500, 1, 1, 0, 10, (x, y) => {
    return Bodies.circle(x, y, 30, { friction: 0.00001, restitution: 0.5, density: 0.001 })
});

const vertexSets = [];
vertexSets.push({ x: 500, y: -600});
for (let i = 0; i < 40; i++) {
    let t = i / 40;
    let x = 500 * Math.cos(Math.PI * t * 1);
    let y = 500 * Math.sin(Math.PI * t * 1);
    vertexSets.push({
        x: x,
        y: y
    });
}
vertexSets.push({ x: -500, y: -600});
vertexSets.push({ x: -520, y: -600});
for (let i = 0; i < 40; i++) {
    let t = 1 - i / 40;
    let x = 520 * Math.cos(Math.PI * t * 1);
    let y = 520 * Math.sin(Math.PI * t * 1);
    vertexSets.push({
        x: x,
        y: y
    });
}
vertexSets.push({ x: 520, y: -600});
vertexSets.push({ x: 500, y: -600});

const path = Bodies.fromVertices(400, 500, vertexSets, {
    isStatic: true
}, true);

Composite.add(world, path);

Composite.add(world, stack);
Composite.add(world, [
    // Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
    // Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: -Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
    // Bodies.rectangle(340, 580, 700, 20, { isStatic: true, angle: Math.PI * 0.04, render: { fillStyle: '#060a19' } }),
]);

Render.lookAt(render, Composite.allBodies(world));

for (let i = 0; i < stack.bodies.length; i++) {
    stack.bodies[i].plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y }
    };
}

