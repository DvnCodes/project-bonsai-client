import Phaser from "phaser";

import { socket } from "../App";

let dolly;
let life = undefined;
let spacebar;
let qu;
let wu;
let ee;
let listOfGameListeners = {};

function preload() {
  // console.log("hello");
  this.load.image("star", "assets/star.png");
  this.load.image("background", "assets/forestMap/backgroundExtrude.png");
  this.load.image("decorative", "assets/forestMap/decorativeExtrude.png");
  this.load.tilemapTiledJSON("map", "assets/forestMap/forestLevel.json");
  this.load.image("fireball", "assets/spell.png");
  this.load.image("life2", "assets/2.png");
  this.load.image("life1", "assets/1.png");
  this.load.image("life3", "assets/3.png");
  this.load.image("firering", "assets/firering.png");
  this.load.image("dead", "assets/bomb.png");
  this.load.image("green", "assets/green.png");
  this.load.image("red", "assets/red.png");
  this.load.image("genie", "assets/10.png");
  this.load.image("baddie", "assets/13.png");
  this.load.bitmapFont("myfont", "assets/font.png", "assets/font.fnt");
  this.load.spritesheet("wizRunSheet", "assets/wizRunSheet.png", {
    frameWidth: 18,
    frameHeight: 30
  });
  this.load.spritesheet("wizIdleSheet", "assets/wizIdleSheet.png", {
    frameWidth: 18,
    frameHeight: 30
  });
  this.load.spritesheet("necRunSheet", "assets/necRunSheet.png", {
    frameWidth: 18,
    frameHeight: 22
  });
  this.load.spritesheet("necIdleSheet", "assets/necIdleSheet.png", {
    frameWidth: 18,
    frameHeight: 22
  });
  this.load.spritesheet("fireBallSheet", "assets/fireBallSheet.png", {
    frameWidth: 66,
    frameHeight: 34
  });
  this.load.spritesheet("fireShield", "assets/fireShield.png", {
    frameWidth: 100,
    frameHeight: 100
  });
  this.load.audio("casting", "assets/casting.wav");
  this.load.audio("death", "assets/death.wav");
  this.load.audio("hitVic", "assets/hitVic.wav");
  this.load.audio("hitAtt", "assets/hitAtt.wav");
}

function create() {
  // console.log("client creating game scene");
  listOfGameListeners = {};
  socket.emit("gameLoaded", socket.id);
  let diretion = {};
  const self = this;
  this.socket = socket;
  this.players = this.add.group();
  this.attacks = this.add.group();
  this.stats = this.add.group();
  this.spells = this.add.group();
  this.names = this.add.group();
  this.lives = this.add.group();
  dolly = this.physics.add.image(100, 100, "star");
  this.cameras.main.setDeadzone(10, 10);
  this.cameras.main.startFollow(dolly, true, 0.3, 0.3);
  this.cameras.main.setZoom(1);
  this.cameras.main.setBackgroundColor("rgba(15,63,82,1)");
  let prevXs = {};

  //  creates animations for player and enemies
  // -Dan
  //
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("wizIdleSheet", {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("wizRunSheet", {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "idleE",
    frames: this.anims.generateFrameNumbers("necIdleSheet", {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "runE",
    frames: this.anims.generateFrameNumbers("necRunSheet", {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "fireBall",
    frames: this.anims.generateFrameNumbers("fireBallSheet", {
      frames: [0, 1, 2, 3, 4]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "shieldOn",
    frames: this.anims.generateFrameNumbers("fireShield", {
      frames: { start: 0, end: 60 }
    }),
    frameRate: 60,
    repeat: -1
  });

  const currentPlayers = this.socket.on("currentPlayers", players => {
    Object.keys(players).forEach(id => {
      if (players[id].playerID === self.socket.id) {
        displayPlayers(self, players[id], "wizIdleSheet");
      } else {
        displayPlayers(self, players[id], "necIdleSheet");
        displayName(self, players[id]);
        displayEnemyLife(self, players[id]);
      }
    });
  });
  listOfGameListeners.currentPlayers = currentPlayers;

  const newPlayer = this.socket.on("newPlayer", playerInfo => {
    displayPlayers(self, playerInfo, "necIdleSheet");
  });
  listOfGameListeners.newPlayer = newPlayer;

  const newAttack = this.socket.on("newAttack", playerInfo => {
    this.sound.play("casting");
    displayAttacks(self, playerInfo);
  });
  listOfGameListeners.newAttack = newAttack;

  const disconnect = this.socket.on("disconnect", playerID => {
    self.players.getChildren().forEach(player => {
      if (playerID === player.playerID) {
        player.destroy();
      }
    });
  });
  listOfGameListeners.disconnect = disconnect;

  const showGameSummary = this.socket.on("showGameSummary", () => {
    Object.keys(listOfGameListeners).forEach(listenerName => {
      this.socket.off(listenerName, listOfGameListeners[listenerName]);
    });
    this.sys.game.destroy(true);
  });
  listOfGameListeners.showGameSummary = showGameSummary;

  const attackEnded = this.socket.on("attackEnded", attackID => {
    self.attacks.getChildren().forEach(attack => {
      if (attackID === attack.attackID) {
        attack.destroy();
      }
    });
  });
  listOfGameListeners.attackEnded = attackEnded;

  const spellAdded = this.socket.on("spellAdded", spellInfo => {
    // console.log(socket.id);
    // console.log("thingthing", spellInfo.thing);
    showspell(self, spellInfo.player, "fireShield");
  });
  listOfGameListeners.spellAdded = spellAdded;

  const playerHit = this.socket.on(
    "playerHealth",
    (clientID, currentHealth, maxHealth) => {
      if (this.socket.id === clientID) {
        this.cameras.main.shake(200, 0.01);
      }
    }
  );
  const playerUpdates = this.socket.on("playerUpdates", players => {
    if (players[this.socket.id]) {
      if (life === undefined) {
        life = players[this.socket.id].life;
        // displayLife(self, players[this.socket.id]);
      } else if (players[this.socket.id].life !== life) {
        self.stats.getChildren().forEach(stat => {
          stat.destroy();
        });
        life = players[this.socket.id].life;

        // displayLife(self, players[this.socket.id]);
      }
    }

    Object.keys(players).forEach(id => {
      let allNames = self.names.getChildren().filter(name => {
        return name.playerID === players[id].playerID;
      });
      if (allNames.length === 0 && players[id].playerID !== socket.id) {
        displayName(self, players[id]);
      }
      self.names.getChildren().forEach(name => {
        if (players[name.playerID].life === 0) {
          name.destroy();
        }
      });
      let allLives = self.lives.getChildren().filter(life => {
        return life.playerID === players[id].playerID;
      });
      if (allLives.length === 0 && players[id].playerID !== socket.id) {
        displayEnemyLife(self, players[id]);
      }
      self.lives.getChildren().forEach(life => {
        if (players[life.playerID].life === 0) {
          life.destroy();
        }
      });
      self.players.getChildren().forEach(player => {
        if (players[id].playerID === player.playerID) {
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);

          // if the player is an enemy player
          if (player.playerID !== socket.id) {
            //display life for enemy players
            // displayLife(self, players[player.playerID]);
            //if players x position is bigger than it was last update
            if (prevXs[player.playerID] > players[id].x) {
              player.flipX = true;
              player.anims.play("runE", true);
            }
            if (prevXs[player.playerID] < players[id].x) {
              player.flipX = false;
              player.anims.play("runE", true);
            }
            if (prevXs[player.playerID] === players[id].x) {
              player.anims.play("idleE", true);
            }
          }
          //set the previous X value to check on next update
          prevXs[player.playerID] = players[id].x;
        }

        self.lives.getChildren().forEach(life => {
          if (players[id].playerID === life.playerID) {
            if (players[id].life !== life.life) {
              life.destroy();
              displayEnemyLife(self, players[id]);
            } else {
              life.setPosition(
                players[id].x - life.width / 2,
                players[id].y + 40
              );
            }
          }
        });

        self.names.getChildren().forEach(name => {
          if (players[id].playerID === name.playerID) {
            name.setPosition(
              players[id].x - name.width / 2,
              players[id].y - 50
            );
          }
        });

        self.players.getChildren().forEach(player => {
          if (players[player.playerID] === undefined) {
            player.destroy();
            console.log("destroyed");
          }
        });
      });
    });

    if (players[this.socket.id])
      dolly.setPosition(players[this.socket.id].x, players[this.socket.id].y);
  });
  listOfGameListeners.playerUpdates = playerUpdates;

  const spellUpdates = this.socket.on("spellUpdates", data => {
    self.spells.getChildren().forEach(spell => {
      if (data.spells[spell.spellID] === undefined) {
        spell.destroy();
      }
    });
    Object.keys(data.spells).forEach(id => {
      self.spells.getChildren().forEach(spell => {
        if (spell.spellID === id) {
          spell.setPosition(data.players[id].x, data.players[id].y);
        }
      });
    });
  });
  listOfGameListeners.spellUpdates = spellUpdates;

  const attackUpdates = this.socket.on("attackUpdates", attacks => {
    Object.keys(attacks).forEach(id => {
      self.attacks.getChildren().forEach(attack => {
        if (attacks[id].attackID === attack.attackID) {
          attack.setPosition(attacks[id].x, attacks[id].y);
        }
      });
    });
    self.attacks.getChildren().forEach(attack => {
      if (attacks[attack.attackID] === undefined) {
        attack.destroy();
      }
    });
  });
  listOfGameListeners.attackUpdates = attackUpdates;

  this.socket.on("hit", (attackerID, victimID) => {
    if (socket.id === attackerID) {
      self.sound.play("hitAtt");
    }
    if (socket.id === victimID) {
      self.sound.play("hitVic");
    }
  });

  const onDie = this.socket.on("onDie", playerID => {
    self.players.getChildren().forEach(player => {
      if (player.playerID === playerID) {
        // self.add.image(player.x, player.y, "dead");
        self.sound.play("death");
        player.destroy();
        let deathLocation = self.load.image(player.x, player.y, "star");
      }
    });
  });

  listOfGameListeners.onDie = onDie;

  this.cursors = this.input.keyboard.createCursorKeys();
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  qu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  wu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  ee = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
  this.downKeyPressed = false;

  const map = this.make.tilemap({ key: "map" });

  const tileset = map.addTilesetImage("background", "background", 32, 32, 1, 2);
  const decorativeTileset = map.addTilesetImage(
    "decorative",
    "decorative",
    32,
    32,
    1,
    2
  );

  const ground = map.createStaticLayer("ground", tileset, 0, 0);
  const obstacles = map.createStaticLayer("obstacles", tileset, 0, 0);
  const walkables = map.createStaticLayer("walkables", tileset, 0, 0);
  const obstacleDecorations = map.createStaticLayer(
    "obstacleDecorations",
    decorativeTileset,
    0,
    0
  );
  const above = map.createStaticLayer("above", decorativeTileset, 0, 0);

  above.setDepth(10);
}

function update() {
  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  const down = this.downKeyPressed;

  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
    this.rightKeyPressed = false;
    //
    //
    // playing correct animation for player's sprite
    this.players.getChildren().forEach(player => {
      if (player.playerID === this.socket.id) {
        player.flipX = true;
        player.anims.play("run", true);
      }
    });
  } else if (this.cursors.right.isDown) {
    this.players.getChildren().forEach(player => {
      if (player.playerID === this.socket.id) {
        player.flipX = false;
        player.anims.play("run", true);
      }
    });
    this.rightKeyPressed = true;
    this.leftKeyPressed = false;
  } else {
    this.players.getChildren().forEach(player => {
      if (player.playerID === this.socket.id) {
        player.anims.play("idle", true);
      }
    });
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
  }

  if (this.cursors.up.isDown) {
    this.upKeyPressed = true;
    this.downKeyPressed = false;
  } else if (this.cursors.down.isDown) {
    this.downKeyPressed = true;
    this.upKeyPressed = false;
  } else {
    this.downKeyPressed = false;
    this.upKeyPressed = false;
  }

  if (
    left !== this.leftKeyPressed ||
    right !== this.rightKeyPressed ||
    up !== this.upKeyPressed ||
    down !== this.downKeyPressed
  ) {
    this.socket.emit("playerInput", {
      left: this.leftKeyPressed,
      right: this.rightKeyPressed,
      up: this.upKeyPressed,
      down: this.downKeyPressed
    });
    this.direction = {
      left: this.leftKeyPressed,
      right: this.rightKeyPressed,
      up: this.upKeyPressed,
      down: this.downKeyPressed
    };
  }

  if (Phaser.Input.Keyboard.JustDown(spacebar)) {
    this.socket.emit("attackInput", this.direction);
  }
  if (Phaser.Input.Keyboard.JustDown(qu)) {
    this.socket.emit("attackInput", this.direction);
  }
  if (Phaser.Input.Keyboard.JustDown(wu)) {
    this.socket.emit("spell", "firering");
  }
}

function displayPlayers(self, playerInfo, sprite) {
  const player = self.add
    .sprite(playerInfo.x, playerInfo.y, sprite)
    .setOrigin(0.5, 0.5)
    .setDisplaySize(50, 50);

  player.playerID = playerInfo.playerID;
  self.players.add(player);
}
function displayAttacks(self, playerInfo) {
  let rotation;

  if (playerInfo.direction.left) {
    rotation = -180;
  }
  if (playerInfo.direction.right) {
    rotation = 0;
  }
  if (playerInfo.direction.down) {
    rotation = 90;
  }
  if (playerInfo.direction.up) {
    rotation = -90;
  }
  if (playerInfo.direction.up && playerInfo.direction.right) {
    rotation = -45;
  }
  if (playerInfo.direction.up && playerInfo.direction.left) {
    rotation = -135;
  }
  if (playerInfo.direction.down && playerInfo.direction.right) {
    rotation = 45;
  }
  if (playerInfo.direction.down && playerInfo.direction.left) {
    rotation = 135;
  }
  const attack = self.add
    .sprite(playerInfo.x, playerInfo.y, "fireBallSheet")
    .setOrigin(0.5, 0.5)
    .setDisplaySize(66, 34)
    .setRotation(Phaser.Math.DegToRad(rotation));
  attack.anims.play("fireBall", true);

  attack.attackID = playerInfo.attackID;
  self.attacks.add(attack);
}

function displayName(self, player) {
  let text = `${player.username} ${player.playerLevel} `;
  const playerName = self.add.bitmapText(
    player.x,
    player.y - 40,
    "myfont",
    text,
    15
  );
  playerName.playerID = player.playerID;
  // playerName.anchor.setTo(0.5);
  self.names.add(playerName);
}

function showspell(self, player, sprite) {
  const myspell = self.add
    .sprite(player.x, player.y, sprite)
    .setDisplaySize(250, 250);
  myspell.spellID = player.playerID;
  self.spells.add(myspell);
  myspell.anims.play("shieldOn", true);
}

function displayEnemyLife(self, player) {
  // let style = { font: "12px Arial", fill: "#ff0044", align: "center" };
  let text = `${player.life}`;
  const playerLife = self.add.bitmapText(
    player.x,
    player.y + 40,
    "myfont",
    text,
    15
  );
  playerLife.playerID = player.playerID;
  playerLife.life = player.life;
  // playerName.anchor.setTo(0.5);
  self.lives.add(playerLife);
}

const gameSceneConfig = {
  type: Phaser.AUTO,
  parent: "gameWindow",
  width: "100%",
  height: "100%",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  pixelArt: true,
  scene: {
    preload,
    create,
    update
  }
};

export { gameSceneConfig };
