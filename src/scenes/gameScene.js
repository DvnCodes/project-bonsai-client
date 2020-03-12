import Phaser from "phaser";

// const passSocketRef = socket => {
//   clientSocket = socket;
// };
import { socket } from "../App";

let dolly;
let life = undefined;
let spacebar;
let qu;
let wu;
let ee;

function preload() {
  this.load.image("genie", "assets/10.png");
  this.load.image("baddie", "assets/13.png");
  this.load.image("star", "assets/star.png");
  this.load.image("tiles", "assets/rogue.png");
  this.load.tilemapTiledJSON("map", "assets/mapTest.json");
  this.load.image("fireball", "assets/spell.png");
  this.load.image("life2", "assets/2.png");
  this.load.image("life1", "assets/1.png");
  // this.load.image("life0", "assets/0.png");
  this.load.image("life3", "assets/3.png");
  this.load.image("firering", "assets/firering.png");
  this.load.image("dead", "assets/bomb.png");
  this.load.image("green", "assets/green.png");
  this.load.image("red", "assets/red.png");
}

function create() {
  socket.emit("gameLoaded", socket.id);

  const self = this;
  this.socket = socket;
  this.players = this.add.group();
  this.attacks = this.add.group();
  this.stats = this.add.group();
  this.spells = this.add.group();
  dolly = this.physics.add.image(100, 100, "star");
  this.cameras.main.setDeadzone(10, 10);
  this.cameras.main.startFollow(dolly, true, 0.3, 0.3);
  this.cameras.main.setZoom(1);

  this.socket.on("currentPlayers", players => {
    Object.keys(players).forEach(id => {
      if (players[id].playerID === self.socket.id) {
        displayPlayers(self, players[id], "genie");
      } else {
        displayPlayers(self, players[id], "baddie");
      }
    });
  });

  this.socket.on("newPlayer", playerInfo => {
    displayPlayers(self, playerInfo, "baddie");
  });
  this.socket.on("newAttack", playerInfo => {
    displayAttacks(self, playerInfo);
  });

  this.socket.on("disconnect", playerID => {
    self.players.getChildren().forEach(player => {
      if (playerID === player.playerID) {
        player.destroy();
      }
    });
  });

  this.socket.on("attackEnded", attackID => {
    self.attacks.getChildren().forEach(attack => {
      if (attackID === attack.attackID) {
        attack.destroy();
      }
    });
  });

  this.socket.on("spellAdded", spellInfo => {
    console.log(socket.id);
    console.log("thingthing", spellInfo.thing);
    showspell(self, spellInfo.player, spellInfo.thing);
  });

  this.socket.on("playerUpdates", players => {
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
      self.players.getChildren().forEach(player => {
        if (players[id].playerID === player.playerID) {
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);
        }
      });
      self.players.getChildren().forEach(player => {
        if (players[player.playerID] === undefined) {
          player.destroy();
          console.log("destroyed");
        }
      });
    });

    if (players[this.socket.id])
      dolly.setPosition(players[this.socket.id].x, players[this.socket.id].y);
  });

  this.socket.on("spellUpdates", data => {
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

  this.socket.on("attackUpdates", attacks => {
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

  this.socket.on("onDie", playerID => {
    self.players.getChildren().forEach(player => {
      if (player.playerID === playerID) {
        self.add.image(player.x, player.y, "dead");
        player.setTexture("star");
      }
    });
  });

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
    console.log("SHOOTING!!!");
    this.socket.emit("attackInput", "hi");
  }
  if (Phaser.Input.Keyboard.JustDown(qu)) {
    console.log("SHOOTING!!!");
    this.socket.emit("attackInput", "hi");
  }
  if (Phaser.Input.Keyboard.JustDown(wu)) {
    console.log("something!!!");
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

function showspell(self, player, sprite) {
  const myspell = self.add
    .sprite(player.x, player.y, sprite)
    .setDisplaySize(125, 125);
  myspell.spellID = player.playerID;
  self.spells.add(myspell);
}

const gameSceneConfig = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
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
