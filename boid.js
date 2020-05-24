
class Boid{

    //
    constantSpeed = false
    maxSpeed = 4

    // Force settings
    maxForce = 1

    // Sensors
    perceptionRange = 150

    //
    maxDistanceToCenter = Math.min(.8 * canvasSize.width / 2, .8 * canvasSize.height / 2)

    // Render settings
    scale = 1.5


    constructor(x, y){
        this.position = createVector(x, y)
        this.velocity = p5.Vector.random2D()
        this.acceleration = createVector()

        this.gridX = Math.floor((x / canvasSize.width) * grid.length)
        this.gridY = Math.floor((y / canvasSize.height) * grid[0].length)

        grid[this.gridX][this.gridY].boids.push(this)
    }

    Flock(boids, predators){
        this.acceleration.mult(0)

        let align = this.Align(boids)
        let cohesion = this.Cohesion(boids)
        let separation = this.Separation(boids)
        let fear = this.Flee(predators)
        let centerForce = this.BackToCenter()

        align.mult(alignSlider.value())
        cohesion.mult(cohesionSlider.value())
        separation.mult(separationSlider.value())


        this.acceleration.add(align)
        this.acceleration.add(cohesion)
        this.acceleration.add(separation)
        this.acceleration.add(fear)
        //this.acceleration.add(centerForce)
        
    }

    Align(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
            if(other != this)
                if(this.position.dist(other.position) <= this.perceptionRange){
                    steer.add(other.velocity)
                    total++
                }       
        }

        if(total > 0){
            steer.div(total)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }
            
        return steer
    }

    Cohesion(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
            if(other != this)
                if(this.position.dist(other.position) <= this.perceptionRange){
                    steer.add(other.position)
                    total++
                }       
        }

        if(total > 0){
            steer.div(total)
            steer.sub(this.position)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }

        return steer
    }

    Separation(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
            if(other != this){

                let dist = this.position.dist(other.position)
                if(dist <= this.perceptionRange){
                    let diff = p5.Vector.sub(this.position, other.position)
                    diff.div(dist * dist)
                    steer.add(diff)
                    total++
                }     
            }  
        }

        if(total > 0){
            steer.div(total)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }
               
        return steer
    }

    Flee(predators){
        let steer = createVector()

        let total = 0
        for (const predator of predators) {
            
            let dist = this.position.dist(predator.position)
            if(dist <= this.perceptionRange){
                let diff = p5.Vector.sub(this.position, predator.position)
                diff.div(dist * dist)
                steer.add(diff)
                total++
            }     
        }

        if(total > 0){
            steer.div(total)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }
               
        return steer
    }


    BackToCenter(){

        let steer = createVector()

        let total = 0
        
        let circleCenter = createVector(center.x, center.y)
        if(this.position.dist(circleCenter) > this.maxDistanceToCenter){
            steer.add(circleCenter)
            total++
        }       
        
        if(total > 0){
            steer.div(total)
            steer.sub(this.position)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }

        return steer
    }

    Update(){
        this.velocity.add(this.acceleration)
        if(this.constantSpeed) this.velocity.setMag(this.maxSpeed)
        this.position.add(this.velocity)        
        this.Edges()
        this.UpdateGridAddress()
    }

    UpdateGridAddress(){
        let gridX = Math.floor((this.position.x / canvasSize.width) * grid.length) % grid.length
        let gridY = Math.floor((this.position.y / canvasSize.height) * grid[0].length) % grid[0].length

        gridX += gridX < 0 ? grid.length : 0
        gridY += gridY < 0 ? grid[0].length : 0

        if(this.gridX != gridX || this.gridY != gridY)
        {
            grid[this.gridX][this.gridY].boids.splice(grid[this.gridX][this.gridY].boids.indexOf(this), 1)
            this.gridX = gridX
            this.gridY = gridY
            grid[this.gridX][this.gridY].boids.push(this)
        }
    }

    Draw(){
        push()
        translate(this.position.x, this.position.y)
        if(renderRange){
            push()
            noStroke()
            fill('rgba(255, 0, 0, 0.25)')
            circle(0, 0, this.perceptionRange)
            pop()
        }
        if(renderGridAddress){
            push()
            fill('white')
            text(`[${this.gridX}, ${this.gridY}]`, 0, 0)
            pop()
        }
        rotate(this.velocity.heading())
        noStroke()
        triangle(5 * this.scale, 0, -5 * this.scale, 2.5 * this.scale, -5 * this.scale, -2.5 * this.scale)
        pop()
    }

    Edges(){
        this.position.x %= canvasSize.width
        this.position.y %= canvasSize.height

        this.position.x += this.position.x < 0 ? canvasSize.width : 0
        this.position.y += this.position.y < 0 ? canvasSize.height : 0
    }
}