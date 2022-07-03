class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y
        this.radius = radius
        this.color = color
        this.speed = speed
        this.is_me = is_me;
        this.eps = 0.1;

        this.move_length = 0;
        this.vx = 0;
        this.vy = 0;

        this.curr_skill = null;

        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;

        this.spent_time = 0;

        if (this.is_me) {
            this.img = new Image()
            this.img.src = this.playground.root.settings.photo
        }
    }

    start() {
        console.log(this)
        if (this.is_me) {
            this.add_listenning_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed + this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed + this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }
        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.vx = 0;
                this.vy = 0;
                this.move_length = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }


        this.render();
    }

    render() {
        if (this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill()
        }
    }

    add_listenning_events() {
        this.playground.game_map.$canvas.on("contextmenu", function() { return false; })

        this.playground.game_map.$canvas.mousedown((e) => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) { // right click
                this.move_to(e.clientX - rect.left, e.clientY - rect.top);
            } else if (e.which === 1) { // left click
                if (this.curr_skill === "fireball") {
                    this.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }
                this.curr_skill = null;
            }
        })

        $(window).keydown(e => {
            if(e.which == 81) { // q
                this.curr_skill = "fireball"
                return false;
            }
        })
    }

    shoot_fireball(tx, ty) {
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);

        let color = "orange"
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;

        new FireBall(this.playground, this, this.x, this.y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    is_attacked(angle, damage) {

        for (let i = 0; i < 20 + Math.random() * 10; i++) {
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, this.x, this.y, radius, vx, vy, this.color, speed, move_length)
        }

        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

}
