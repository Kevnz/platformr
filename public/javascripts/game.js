var game = function () {
    
    var GAME_TYPE = 'Canvas';
    Crafty.init(600,600);
    Crafty.canvas.init();

    Crafty.sprite(64, '/images/char_full.png', {
        player: [0,8],
        walking: [0,4]
    });


    Crafty.scene('loading', function() {
        //load takes an array of assets and a callback when complete
        Crafty.load(['/images/char_full.png'], function () {
            Crafty.scene("main"); //when everything is loaded, run the main scene
        });

        //black background with some loading text
        Crafty.background("#CCC");
        Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
            .text("Loading")
            .css({"text-align": "center"});
    });

    Crafty.scene('main', function () {
        console.log('main');
        Crafty.c('Hero', {
            init: function () {
                //.animate(String reelId, Number fromX, Number y, Number toX)
                this.requires("SpriteAnimation, Collision, Gravity")
                .animate("walk_right", 0, 4, 7)
                .animate("walk_left", 8, 4, 15)
                .animate('jump_up', 2, 5, 7)
                .animate('stance', 0, 7, 0)
                .gravity('platform')
                .bind("NewDirection", function (direction) {
                    console.log(direction);
                    //this.stop().animate("walk_right", 10, -1);
                    if (direction.x < 0) {
                        if (!this.isPlaying("walk_left")) this.stop().animate("walk_left", 10, -1);
                    }
                    if (direction.x > 0) {
                        if (!this.isPlaying("walk_right")) this.stop().animate("walk_right", 10, -1);
                    }
                    if(!direction.x && !direction.y) {
                        this.stop();
                    }
                })

                .bind('AnimationEnd', function (det) {
                    console.log('aniend');
                    console.log(det);
                })
                .bind('KeyDown', function (key) {
                    console.log(key);
                    if(key.keyIdentifier === 'Up') {
                        this.stop().animate('jump_up', 8, 0).bind('AnimationEnd', function (det) {
                            //console.log('jump_up end');
                            //console.log(det);
                            //this.stop().animate("walk_right", 10, -1);
                        });
                    }
                    if(key.key === 32) {
                        this.stop().animate('shoot', 10, -1 );
                    }
                });
                return this; 
            }
        });
        Crafty.c("RightControls", {
            init: function() {
                this.requires('Twoway');
            },

            rightControls: function(speed) {
                this.twoway(speed, 6);
                return this;
            }
        });
        Crafty.c('Directions', {
            init: function () {

            }
        });

        var platform = Crafty.e("2D, Canvas, Color, platform, Collision, WiredHitBox")
                         .attr({ x: 0, y: 400, w:400, h:20})
                         .color("#FF0000")
                         .collision(new Crafty.polygon([0,0], []))
                         .onHit('player', function(e) { console.log ('well tell that')});
        var platform2 = Crafty.e("2D, Canvas, Color, platform, Collision, WiredHitBox")
                         .attr({ x: 484, y: 400, w:900, h:20})
                         .color("#FF0000");

        var topPlatform = Crafty.e('2D, Canvas, Color, Collision, platform, WiredHitBox')
                         .attr({x: 32, y: 300, w:200, h: 10})
                         .color('#149E05');
        var wall = Crafty.e('2D, Canvas, Color, Collision,wall')
                         .attr({ x: 20, y: 380, w:20, h:60})
                         .color('#1BB5E0');
        var player = Crafty.e("2D, Canvas, player, RightControls, Hero, Animate, Collision, WiredHitBox")
            .attr({x: 160, y: 144, z: 2})
            .rightControls(1)
            .onHit('wall',function(e){
                console.log('hit the wall');
                this.x = this.x-20;
            })
            .onHit('platform', function (e) {
                    console.log('hit the platform');
            })
            .bind('hit', function(e) {
                console.log(this);
                this.stop().animate("stance");
            })
            .collision(new Crafty.polygon([24,5],[24,64],[44,64],[44,5]));
        Crafty.viewport.clampToEntities = false;
        Crafty.viewport.centerOn(player,0);
        Crafty.viewport.follow(player, 0, 0);
    });

    Crafty.scene('loading');
};
