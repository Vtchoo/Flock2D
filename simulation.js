


//
// Global variables
//
const totalBoids = 100
const totalPredators = 1

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
let predators = []


//
let renderRange = false
let renderTrace = false

function preload(){
    
}

function setup(){
    createCanvas(canvasSize.width, canvasSize.height)
    
    alignSlider = createSlider(0, 5, 1, .1)
    cohesionSlider = createSlider(0, 5, 1, .1)
    separationSlider = createSlider(0, 5, 1, .1)

    for(let i = 0; i < totalBoids; i++)
        boids[i] = new Boid(random(canvasSize.width) , random(canvasSize.height))

    for(let i = 0; i < totalPredators; i++)
        predators[i] = new Predator(random(canvasSize.width) , random(canvasSize.height))
    

}

function draw(){
    
    background(renderTrace ? 'rgba(0,0,0,.15)' : 'black')

    for (const boid of boids) {
        //boid.Align(boids)
        boid.Flock(boids, predators)
    }

    for (const predator of predators) {
        predator.Flock(boids, predators)
    }

    for (const boid of boids) {
        boid.Update()
    }

    for (const predator of predators) {
        predator.Update()
    }

    for (const boid of boids) {
        boid.Draw()
    }

    for (const predator of predators) {
        predator.Draw()
    }
}