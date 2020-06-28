class Player {
    constructor(brain) {
        this.w = 80;
        this.h = 144;
        this.x = floor(width / 2 - this.w / 2);
        this.y = (height - this.h) - 5;
        this.brain = brain;
        this.score = 0;
        this.died = false;

        this.sensorLen = 200;
        this.closest = null;
    }

    hits(opponent) {
        if (opponent.y < this.y+this.h && opponent.y+opponent.h > this.y) {
            if (opponent.x < this.x+this.w && opponent.x+opponent.w > this.x) {
                return true;
            }
        }
    }

    ovartaken(opponent){
        if (this.died) {
            return;
        }
        if((this.y + this.h) < opponent.y){
            this.score += 1;
            this.brain.score = this.score;
        }
    }

    see(opponents){
        opponents.forEach(opponent => {
            let hit = this.hits(opponent);
            if (hit) {
                this.died = true;
                this.brain.score -= 2;
            }

            this.ovartaken(opponent);

        });
        this.findClosest(opponents);
    }

    findClosest(opponents){
        let closest = null;
        let d = Infinity;
        opponents.forEach(opponent => {
            if (!(this.y < (opponent.y + opponent.h))) {
                let a = {
                    x: this.x + (this.w / 2),
                    y: this.y
                }

                let b = {
                    x: opponent.x + (opponent.w / 2),
                    y: opponent.y + opponent.h
                }
                let distance = dist(a.x,a.y,b.x,b.y);

                if (d > distance) {
                    d = distance;
                    closest = opponent;
                }
            }
        })

        if (closest != null) {
            let a = {
                x: this.x + (this.w / 2),
                y: this.y
            }

            let b = {
                x: closest.x + (closest.w / 2),
                y: closest.y + closest.h
            }

            line(a.x,a.y,b.x,b.y);

            this.closest = closest;
        }

    }

    think(){

        if (this.closest == null) {
            return;
        }

        
        
        let side = {
            a: {
                x: this.x + (this.w / 2),
                y: this.y
            },
            b: {
                x: this.closest.x + (this.closest.w / 2),
                y: this.y
            }
        }

        let up = {
            a: {
                x: this.x + (this.w / 2),
                y: this.y
            },
            b: {
                x: this.x + (this.w / 2),
                y: this.closest.y + this.closest.h
            }
        }

        let sideDistance = side.a.x - side.b.x;
        let upDistance = up.a.y - up.b.y;


        // line(side.a.x, side.a.y, side.b.x, side.b.y);
        // line(up.a.x, up.a.y,up.b.x,up.b.y);
        
        let inputs = [sideDistance, upDistance, this.x + (this.w / 2)];
        
        let output = this.brain.think(inputs);

           if (output[2] > 0.5) {
               if (output[0] < output[1]) {
                   this.turnLeft();
               } else {
                   this.turnRight();
               }
           }
    }


    show() {
        image(im_car_red, this.x, this.y);
    };
    turnLeft() {
        this.x -= 5;
        this.x = constrain(this.x, 0, (width) - this.w);
        this.x = constrain(this.x, 30, (width - 30) - this.w);

        // if (this.x <= 0) {
        //     this.died = true;
        // }
        
    };
    turnRight() {
        this.x += 5;
        this.x = constrain(this.x, 30, (width - 30) - this.w);
        this.x = constrain(this.x, 0, (width) - this.w);  

        // if ((this.x + this.w) >= width ) {
        //     this.died = true;
        // }
    };
}

