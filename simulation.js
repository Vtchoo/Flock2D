
//
// Boid variables
//
const boidViewRange = 150
const predViewRange = 200


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

const mingridSize = Math.max(boidViewRange, predViewRange) / 2
let grid = []
for(let i = 0; i < Math.floor(canvasSize.width / mingridSize); i++)
{
    grid[i] = []
    for(let j = 0; j < Math.floor(canvasSize.height / mingridSize); j++)
        grid[i][j] = {
            boids: [],
            predators: [],
        }
}

// Sliders
let alignSlider, cohesionSlider, separationSlider

//
let boids = []
let predators = []


//
let renderGrid = false
let renderRange = false
let renderTrace = false
let renderGridAddress = false

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

    // Extra
    if(renderGrid)
        for(let i = 0; i < grid.length; i++)
            for(let j = 0; j < grid[0].length; j++){
                push()
                noFill()
                stroke('white')
                rect(i * canvasSize.width / grid.length, j * canvasSize.height / grid[0].length, canvasSize.width / grid.length, canvasSize.height / grid[0].length)
                pop()
            }

    // // Interact
    // for (const boid of boids) {
    //     //boid.Align(boids)
    //     boid.Flock(boids, predators)
    // }

    // for (const predator of predators) {
    //     predator.Flock(boids, predators)
    // }

    // // Update
    // for (const boid of boids) {
    //     boid.Update()
    // }

    // for (const predator of predators) {
    //     predator.Update()
    // }

    // // Draw
    // for (const boid of boids) {
    //     boid.Draw()
    // }

    // for (const predator of predators) {
    //     predator.Draw()
    // }

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            for (const boid of grid[i][j].boids) {
                let boids = []
                let predators = []
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                    
                        let squareX = i + k > 0 ? i + k : i + k + grid.length
                        let squareY = j + l > 0 ? j + l : j + l + grid[0].length
                        squareX = squareX < grid.length ? squareX : squareX - grid.length
                        squareY = squareY < grid[0].length ? squareY : squareY - grid[0].length
                        
                        boids.push(...grid[squareX][squareY].boids)
                        predators.push(...grid[squareX][squareY].predators)
                    }
                }

                if (mouseIsPressed) {
                    let pseudoPredator = { position: createVector(mouseX, mouseY) };
                    predators.push(pseudoPredator);
                }
                
                boid.Flock(boids, predators)
            }

            for (const predator of grid[i][j].predators) {
                let boids = []
                let predators = []
                for(let k = -1; k <= 1; k++)
                    for(let l = -1; l <= 1; l++){
                    
                        let squareX = i + k > 0 ? i + k : i + k + grid.length
                        let squareY = j + l > 0 ? j + l : j + l + grid[0].length
                        squareX = squareX < grid.length ? squareX : squareX - grid.length
                        squareY = squareY < grid[0].length ? squareY : squareY - grid[0].length

                        boids.push(...grid[squareX][squareY].boids)
                        predators.push(...grid[squareX][squareY].predators)
                    }
                
                predator.Flock(boids, predators)
            }
        }
    }

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            for (const boid of grid[i][j].boids) {
                boid.Update()
            }
            for (const predator of grid[i][j].predators) {
                predator.Update()
            }
        }
    }

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            for (const boid of grid[i][j].boids) {
                boid.Draw()
            }
            for (const predator of grid[i][j].predators) {
                predator.Draw()
            }
        }
    }
    
                
}