


//
// Global variables
//
const n = 100

const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight
}
const center = {
    x: canvasSize.width / 2,
    y: canvasSize.height /2
}

// Sliders
let alignSlider, cohesionSlider, separationSlider

//
let boids = []


//
let renderRange = false

function preload(){
    
}

function setup(){
    createCanvas(canvasSize.width, canvasSize.height)
    
    alignSlider = createSlider(0, 5, 1, .1)
    cohesionSlider = createSlider(0, 5, 1, .1)
    separationSlider = createSlider(0, 5, 1, .1)

    for(let i = 0; i < n; i++)
        boids[i] = new Boid(random(canvasSize.width) , random(canvasSize.height))

    

}

function draw(){
    background('black')

    for (const boid of boids) {
        //boid.Align(boids)
        boid.Flock(boids)
    }

    for (const boid of boids) {
        boid.Update()
    }

    for (const boid of boids) {
        boid.Draw()
    }
}