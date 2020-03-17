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
  this.load.image("tiles", "assets/rogue.png");
  this.load.tilemapTiledJSON("map", "assets/mapTest.json");
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
  this.load.image("speed", "assets/firering.png");
  this.load.bitmapFont("myfont", "assets/font.png", "assets/font.fnt");
}

function create() {
  // console.log("client creating game scene");
  listOfGameListeners = {};
  socket.emit("gameLoaded", socket.id);
  const self = this;
  this.socket = socket;
  this.players = this.add.group();
  this.attacks = this.add.group();
  this.stats = this.add.group();
  this.firering = this.add.group();
  this.speed = this.add.group();
  this.names = this.add.group();
  this.lives = this.add.group();
  dolly = this.physics.add.image(100, 100, "star");
  this.cameras.main.setDeadzone(10, 10);
  this.cameras.main.startFollow(dolly, true, 0.3, 0.3);
  this.cameras.main.setZoom(1);

  const currentPlayers = this.socket.on("currentPlayers", players => {
    Object.keys(players).forEach(id => {
      if (players[id].playerID === self.socket.id) {
        displayPlayers(self, players[id], "genie");
      } else {
        displayPlayers(self, players[id], "baddie");
        displayName(self, players[id]);
        displayEnemyLife(self, players[id]);
      }
    });
  });
  listOfGameListeners.currentPlayers = currentPlayers;

  const newPlayer = this.socket.on("newPlayer", playerInfo => {
    displayPlayers(self, playerInfo, "baddie");
  });
  listOfGameListeners.newPlayer = newPlayer;

  const newAttack = this.socket.on("newAttack", playerInfo => {
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

  const spellAddedSpeed = this.socket.on("spellAddedSpeed", playerInfo => {
    console.log("addspeed");
    // console.log(socket.id);
    // console.log("thingthing", playerInfo.thing);
    showspeed(self, playerInfo, "speed");
  });
  listOfGameListeners.spellAddedSpeed = spellAddedSpeed;

  const spellAddedFire = this.socket.on("spellAddedFire", playerInfo => {
    console.log("addfire");
    // console.log(socket.id);
    // console.log("thingthing", playerInfo.thing);
    showfire(self, playerInfo, "firering");
  });
  listOfGameListeners.spellAddedFire = spellAddedFire;

  const playerUpdates = this.socket.on("playerUpdates", players => {
    self.firering.getChildren().forEach(firering => {
      if (players[firering.spellID].spellactive.firering === false) {
        firering.destroy();
      } else {
        firering.setPosition(
          players[firering.playersID].x,
          players[firering.playersID].y
        );
      }
    });

    self.speed.getChildren().forEach(speed => {
      if (players[speed.spellID].spellactive.speed === false) {
        speed.destroy();
      } else {
        speed.setPosition(
          players[speed.playersID].x,
          players[speed.playersID].y
        );
      }
    });

    if (players[this.socket.id] !== undefined) {
      if (life === undefined) {
        life = players[this.socket.id].life;
        displayLife(self, players[this.socket.id]);
      } else if (players[this.socket.id].life !== life) {
        self.stats.getChildren().forEach(stat => {
          stat.destroy();
        });
        life = players[this.socket.id].life;
        displayLife(self, players[this.socket.id]);
      } else {
        self.stats.getChildren().forEach(stat => {
          stat.setPosition(
            players[this.socket.id].x,
            players[this.socket.id].y + 100
          );
        });
      }
    }

    Object.keys(players).forEach(id => {
      let allNames = self.names.getChildren().filter(name => {
        return name.playerID === players[id].playerID;
      });
      if (allNames.length === 0 && players[id].playerID !== socket.id) {
        displayName(self, players[id]);
      }
      let allLives = self.lives.getChildren().filter(life => {
        return life.playerID === players[id].playerID;
      });
      if (allLives.length === 0 && players[id].playerID !== socket.id) {
        displayEnemyLife(self, players[id]);
      }

      self.players.getChildren().forEach(player => {
        if (players[id].playerID === player.playerID) {
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);
        }
        self.names.getChildren().forEach(name => {
          if (players[id].playerID === name.playerID) {
            name.setPosition(
              players[id].x - name.width / 2,
              players[id].y - 40
            );
          }
        });
        self.lives.getChildren().forEach(life => {
          if (players[id].playerID === life.playerID) {
            life.setPosition(
              players[id].x - life.width / 2,
              players[id].y + 40
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

  // const spellUpdates = this.socket.on(
  //   "spellUpdates",
  //   playerClientUpdateObject => {
  //     self.firering.getChildren().forEach(spell => {
  //       if (firering[spell.spellID] === undefined) {
  //         spell.destroy();
  //       }
  //     });

  //     Object.keys(firering).forEach(id => {
  //       self.firering.getChildren().forEach(spell => {
  //         if (spell.spellID === id) {
  //           spell.setPosition(firering.players[id].x, firering.players[id].y);
  //         }
  //       });
  //     });

  //     self.speed.getChildren().forEach(spell => {
  //       if (speed[spell.spellID] === undefined) {
  //         spell.destroy();
  //       }
  //     });

  //     Object.keys(speed).forEach(id => {
  //       self.firering.getChildren().forEach(spell => {
  //         if (spell.spellID === id) {
  //           spell.setPosition(spell.players[id].x, spell.players[id].y);
  //         }
  //       });
  //     });
  //   }
  // );
  // listOfGameListeners.spellUpdates = spellUpdates;

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

  const onDie = this.socket.on("onDie", playerID => {
    self.players.getChildren().forEach(player => {
      if (player.playerID === playerID) {
        self.add.image(player.x, player.y, "dead");
        player.setTexture("star");
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

  const tileset = map.addTilesetImage("rogue", "tiles");
  const layerOne = map.createStaticLayer("floor", tileset, 0, 0);
  const layerTwo = map.createStaticLayer("walls", tileset, 0, 0);
}

function update() {
  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  const down = this.downKeyPressed;

  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
    this.rightKeyPressed = false;
  } else if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
    this.leftKeyPressed = false;
  } else {
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
  }

  if (Phaser.Input.Keyboard.JustDown(spacebar)) {
    this.socket.emit("attackInput", "hi");
  }
  if (Phaser.Input.Keyboard.JustDown(qu)) {
    this.socket.emit("attackInput", "hi");
  }
  if (Phaser.Input.Keyboard.JustDown(wu)) {
    console.log("something!!!");
    this.socket.emit("firering");
  }
  if (Phaser.Input.Keyboard.JustDown(ee)) {
    console.log("speed!!!");
    this.socket.emit("speed");
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
  const attack = self.add
    .sprite(playerInfo.x, playerInfo.y, "fireball")
    .setOrigin(0.5, 0.5)
    .setDisplaySize(50, 50);

  attack.attackID = playerInfo.attackID;
  self.attacks.add(attack);
}

function displayLife(self, player) {
  const myLife = self.add
    .sprite(player.x, player.y + 80, "green")
    .setDisplaySize(player.life * 10, 10);
  myLife.statID = player.playerID;
  self.stats.add(myLife);
}

function displayName(self, player) {
  // let style = { font: "12px Arial", fill: "#ff0044", align: "center" };
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
  // playerName.anchor.setTo(0.5);
  self.lives.add(playerLife);
}

function showfire(self, player) {
  console.log(player);
  let myfire = self.add
    .sprite(player.x, player.y, "firering")
    .setDisplaySize(125, 125);
  myfire.spellID = player.playerID;
  self.firering.add(myfire);
}

function showspeed(self, player) {
  console.log(player);
  let myspeed = self.add
    .sprite(player.x, player.y, "speed")
    .setDisplaySize(125, 125);
  myspeed.spellID = player.playerID;
  self.speed.add(myspeed);
}

const gameSceneConfig = {
  type: Phaser.AUTO,
  parent: "gameWindow",
  width: 1280,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

export { gameSceneConfig };
