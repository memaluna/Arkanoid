// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Collision = Matter.Collision,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 600,
        height: 1000,
    }
});

const altura = render.options.height;
const ancho = render.options.width;
const anchoParedes = 10;

//Armar paredes
var paredIzquierda = Bodies.rectangle(5, altura/2, anchoParedes, altura, { isStatic: true });
var paredDerecha = Bodies.rectangle(ancho-5, altura/2, anchoParedes, altura, { isStatic: true });
var techo = Bodies.rectangle(ancho/2, 5, ancho-20, 10, { isStatic: true });

//propiedades de ladrillos 
const ladrillosProps = { w: 50, h: 30, posX: 50, posY: 30, cols: 10, rows: 5 };
const ladrillos = Composites.stack(ladrillosProps.posX, ladrillosProps.posY, ladrillosProps.cols, ladrillosProps.rows, 0, 0, (x, y) => {
    return Bodies.rectangle(x, y, ladrillosProps.w, ladrillosProps.h, { isStatic: true });
});

//paleta
const anchoPaleta = 100;
const ejeYPaleta = altura - 50;
var paleta = Bodies.rectangle(ancho/2, ejeYPaleta, anchoPaleta, 20, { isStatic: true });

//Pelota
var pelota = Bodies.circle(ancho/2, 500, 5);

//Mouse
let mouse = Mouse.create(render.canvas);

let aceleracion = 100;

let chocaron = false;
Events.on(engine, 'afterUpdate', () => {
    //console.log(Collision.collides(boxA, boxB));
    chocaron = Collision.collides(paleta, pelota);
    //console.log(mouse.position);
    Body.setPosition(paleta, {x: mouse.position.x, y: ejeYPaleta});
    //console.log(paleta.position.x);
    if(paleta.position.x > ancho - anchoPaleta/2 - anchoParedes){
        Body.setPosition(paleta, {x: ancho - anchoPaleta/2 - anchoParedes, y: ejeYPaleta});
    }
    if(paleta.position.x < anchoParedes + anchoPaleta/2){
        Body.setPosition(paleta, {x: anchoParedes + anchoPaleta/2, y: ejeYPaleta});
    }
        //Composite.remove(compo, cuerpos[0]);
    
    var velocidad = engine.timing.timestamp * 0.001;
    let totalY = aceleracion * velocidad;

    //var py = 300 + 400 * Math.sin(engine.timing.timestamp * 0.002);
    // move body and update velocity
    Body.setPosition(pelota, { x: 100, y: totalY}, true);

    if(chocaron){
        Body.setVelocity(pelota, -1);
    }
    console.log(totalY);
    console.log(pelota);
})

let cuerpos = [techo, paredIzquierda, paredDerecha, ladrillos, paleta, pelota];


// add all of the bodies to the world
let compo = Composite.add(engine.world, cuerpos);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);