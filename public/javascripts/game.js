var game = function () {

    var GAME_TYPE = 'Canvas';
    Crafty.init(600,600);
    Crafty.canvas.init();

    Crafty.sprite(64, '/images/platformer_sprites_base.png', {
        player: [0,8],
        walking: [0,4]
    });


    Crafty.scene('loading', function() {
        //load takes an array of assets and a callback when complete
        Crafty.load(['/images/platformer_sprites_base.png'], function () {
            Crafty.scene("main"); //when everything is loaded, run the main scene
        });

        //black background with some loading text
        Crafty.background("#000");
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
                .animate('jump_up', 2, 5, 7)
                .animate('stance', 0, 7, 0)
                .gravity('platform')
                .bind("NewDirection", function (direction) {
                    console.log(direction);
                    this.stop().animate("walk_right", 10, -1);
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
                            console.log('jump_up end');
                            console.log(det);
                            //this.stop().animate("walk_right", 10, -1);
                        });
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
                this.twoway(speed, 4);
                return this;
            }
        });


        var platform = Crafty.e("2D, Canvas, Color, platform, Collision")
                         .attr({ x: 0, y: 395, w:400, h:20})
                         .color("#FF0000");
        var player = Crafty.e("2D, Canvas, player, RightControls, Hero, Animate, Collision")
            .attr({x: 160, y: 144, z: 2})
            .rightControls(1)
            .bind('hit', function(e) {
                console.log(this);
                this.stop().animate("stance");
            });
    });

    Crafty.scene('loading');
};
document.addEventListener("DOMContentLoaded", function() {
    console.log('the dom is ready');
    game(); 
});
