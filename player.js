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
        this.sensors = [
            {
                name: "A",
                isHit: false,
                a: {
                    x: (this.w / 2),
                    y: 0
                },
                b: {
                    x: (this.w / 2),
                    y: - this.sensorLen
                },
                d: 0
            },
            {
                name: "b",
                isHit: false,
                a: {
                    x: 0,
                    y: 0
                },
                b: {
                    x: - (this.w / 2),
                    y: - this.sensorLen
                },
                d: 0
            },
            {
                name: "b",
                isHit: false,
                a: {
                    x: this.w,
                    y: 0
                },
                b: {
                    x: ((this.w / 2) * 3),
                    y: - this.sensorLen
                },
                d: 0
            },
        ]
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

            this.sensorIntersect(opponent);
        });
    }

    sensorIntersect(opponent){
        this.sensors.forEach((sensor,key) => {
            let isHit = false;
            let d = 1;
            let hit = collideLineRect(sensor.a.x + this.x, sensor.a.y + this.y, sensor.b.x + this.x,sensor.b.y + this.y,opponent.x,opponent.y,opponent.w,opponent.h,true);
            
            if(hit.top.x || hit.bottom.x || hit.left.x || hit.right.x){
                isHit = true;
                let closestHit = Infinity;

                for (const key in hit) {
                    if (hit[key].x && hit[key].y) {
                        let distance = dist(sensor.a.x + this.x, sensor.a.y + this.y, hit[key].x , hit[key].y);
                        if (distance < closestHit) {
                            closestHit = distance;
                        }
                    }
                }

                let sensorLen = dist(sensor.a.x + this.x, sensor.a.y + this.y, sensor.b.x + this.x, sensor.b.y + this.y);

                if (closestHit == Infinity) {
                    d = 1;
                }else{
                    d = map(closestHit,0,sensorLen,0,1);
                }


            }

            this.sensors[key].isHit = isHit;
            this.sensors[key].d = d;
        })
    }

    think(){
        let inputs = [];
        this.sensors.forEach(sensor => {
            inputs.push(sensor.d);
        })

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
        push();
        this.sensors.forEach(sensor => {
            if (sensor.isHit) {
                stroke('red'); 
            }else{
                stroke(255);
            }
            line(sensor.a.x + this.x,sensor.a.y + this.y,sensor.b.x + this.x,sensor.b.y + this.y);
        })
        pop();
        image(im_car_red, this.x, this.y);
    };
    turnLeft() {
        this.x -= 10;
        this.x = constrain(this.x, 0, width - this.w);
        
    };
    turnRight() {
        this.x += 10;
        this.x = constrain(this.x, 0, width - this.w);  

    };
}

