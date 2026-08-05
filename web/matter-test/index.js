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

const stack = Composites.stack(20, 20, 20, 5, 0, 0, (x, y) => {
    return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 })
});

Composite.add(world, stack);
Composite.add(world, [
    Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
    Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: -Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
    Bodies.rectangle(340, 580, 700, 20, { isStatic: true, angle: Math.PI * 0.04, render: { fillStyle: '#060a19' } }),

    // walls
    // Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    // Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    // Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    // Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);

Render.lookAt(render, Composite.allBodies(world));

for (let i = 0; i < stack.bodies.length; i++) {
    stack.bodies[i].plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y }
    };
}

