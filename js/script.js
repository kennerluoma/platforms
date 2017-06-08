const canvas = document.getElementById(`canvas`);
const ctx = canvas.getContext(`2d`);
const canvasW = canvas.width;
const canvasH = canvas.height;
const tilesheetImage = new Image();
tilesheetImage.addEventListener(`load`, rafLoop, false);
tilesheetImage.src = `images/map.png`;
const heroSprite = new Image();
heroSprite.addEventListener(`load`, rafLoop, false);
heroSprite.src = `images/dude.png`;
const itemSprite = new Image();
itemSprite.addEventListener(`load`, rafLoop, false);
itemSprite.src = `images/coin.png`;
class SpriteMap {
  constructor() {
    this.sourceX = 0;
    this.sourceY = 0;
    this.sourceWidth = 256;
    this.sourceHeight = 256;
    this.width = 32;
    this.height = 32;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
  }
}
let tileMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
];
const EMPTY = 0,
  GROUND1 = 1,
  GROUND2 = 2,
  GROUND3 = 3;
const spriteSize = 256,
  tileSize = 32,
  ROWS = tileMap.length,
  COLUMNS = tileMap[0].length;
const tilesheetColumns = 2;
let sprites = [];
class BuildMap {
  constructor(map) {
    this.map = map;
    this.build = () => {
      for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
          const currentTile = this.map[row][column];
          const tileX = ~~((currentTile) % tilesheetColumns) * spriteSize;
          const tileY = ~~((currentTile) / tilesheetColumns) * spriteSize;
          if (currentTile !== EMPTY) {
            switch (currentTile) {
              case GROUND1:
                const ground = new SpriteMap;
                ground.sourceX = tileX;
                ground.sourceY = tileY;
                ground.x = column * tileSize;
                ground.y = row * tileSize;
                sprites.push(ground);
                break;
              case GROUND2:
                const ground2 = new SpriteMap;
                ground2.sourceX = tileX;
                ground2.sourceY = tileY;
                ground2.x = column * tileSize;
                ground2.y = row * tileSize;
                sprites.push(ground2);
                break;
              case GROUND3:
                const ground3 = new SpriteMap;
                ground3.sourceX = tileX;
                ground3.sourceY = tileY;
                ground3.x = column * tileSize;
                ground3.y = row * tileSize;
                sprites.push(ground3);
                break;
            }
          }
        }
      }
    };
    this.map = map;
  }
}
class Hero {
  constructor() {
    this.updateFrames = () => {
      this.spriteX = ~~(this.currentFrame % this.columns) * this.spriteW;
      this.spriteY = ~~(this.currentFrame / this.columns) * this.spriteH;
      this.currentFrame = 0;
      if (spacebar) {
        this.currentFrame = 1;
      }
    };
    this.movement = () => {
      const leftCollision = collision(this.x, this.y) && collision(this.x, this.y + this.h),
        rightCollision = collision(this.x + this.w, this.y) && collision(this.x + this.w, this.y + this.h),
        collisionBottomLeft = collision(this.x, this.y + this.w),
        collisionBottomRight = collision(this.x + this.w, this.y + this.h),
        collisionTopLeft = collision(this.x, this.y),
        collisionTopRight = collision(this.x + this.w, this.y);
      if (left && right) {
        this.speedX += -this.speedX / 10;
      } else if (left && !leftCollision) {
        this.speedX -= this.speed;
      } else if (right && !rightCollision) {
        this.speedX += this.speed;
      } else if (leftCollision) {
        this.x = (this.x + this.w) >> 5 << 5;
        this.speedX = 0;
      } else if (rightCollision) {
        this.x = this.x >> 5 << 5;
        this.speedX = 0;
      } else {
        this.speedX += -this.speedX / 10;
      }
      this.speedX = constrain(this.speedX, -this.speedLimit, this.speedLimit);
      this.x += this.speedX;
      this.speedY += this.gravity;
      this.speedY = constrain(this.speedY, -this.jumpSpeed, this.speedLimit * 2);
      this.y += this.speedY;
      if ((spacebar || up) && this.canJump && this.speedY >= 0) {
        this.speedY = -this.jumpSpeed;
      }
      if (collisionBottomLeft || collisionBottomRight) {
        this.y = this.y >> 5 << 5;
        this.canJump = true;
      } else if (collisionTopLeft || collisionTopRight) {
        this.y = (this.y + this.h) >> 5 << 5;
        this.speedY -= this.speedY;
      } else {
        this.canJump = false;
      }
      if (down) {}
      this.centerX = this.x + (this.w >> 1);
      this.centerY = this.y + (this.h >> 1);
      this.x = constrain(this.x, 0, canvas.width - this.w);
      this.y = constrain(this.y, 0, canvas.height - this.h);
    };
    this.display = () => {
      ctx.drawImage(heroSprite, this.spriteX, this.spriteY, this.spriteW, this.spriteH, this.x, this.y, this.w, this.h);
    };
    this.x = 0;
    this.y = 0;
    this.w = 32;
    this.h = 32;
    this.centerX = this.x + (this.w >> 1);
    this.centerY = this.y + (this.h >> 1);
    this.spriteX = 0;
    this.spriteY = 0;
    this.spriteW = 256;
    this.spriteH = 256;
    this.frames = 2;
    this.columns = 2;
    this.currentFrame = 0;
    this.speed = 0.1;
    this.speedX = 0;
    this.speedY = 0;
    this.speedLimit = 2;
    this.canJump = false;
    this.jumpSpeed = 4;
    this.gravity = 0.05;
  }
}
class Item {
  constructor() {
    this.collision = () => {
      if (this.centerX === hero.centerX && this.centerY === hero.centerY) {
        console.log(`Hooray`);
      }
    };
    this.display = () => {
      ctx.drawImage(itemSprite, this.spriteX, this.spriteY, this.spriteW, this.spriteH, this.x, this.y, this.w, this.h);
    };
    this.x = 352;
    this.y = 160;
    this.w = 32;
    this.h = 32;
    this.centerX = this.x + (this.w >> 1);
    this.centerY = this.y + (this.h >> 1);
    this.spriteX = 0;
    this.spriteY = 0;
    this.spriteW = 256;
    this.spriteH = 256;
    this.frames = 2;
    this.columns = 2;
    this.currentFrame = 0;
  }
  update() {}
}
const constrain = (n, min, max) => {
  return n <= min ? min : n >= max ? max : n;
};
const collision = (x, y, map = tileMap) => {
  return map[y >> 5][x >> 5];
};
let left = false,
  up = false,
  right = false,
  down = false,
  spacebar = false;
let moveKey = (e, isPressed) => {
  switch (e.keyCode) {
    case 65:
      left = isPressed;
      break;
    case 87:
      up = isPressed;
      break;
    case 68:
      right = isPressed;
      break;
    case 83:
      down = isPressed;
      break;
    case 32:
      spacebar = isPressed;
      break;
  }
};
const level1 = new BuildMap(tileMap);
level1.build();
const hero = new Hero;
hero.x = 64;
hero.y = 374;
const item = new Item;
window.addEventListener("keydown", (e) => {
  moveKey(e, true);
}, false);
window.addEventListener("keyup", (e) => {
  moveKey(e, false);
}, false);
canvas.focus();

function rafLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (sprites.length !== 0) {
    for (let i = 0; i < sprites.length; i++) {
      let sprite = sprites[i];
      ctx.drawImage(tilesheetImage, sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight, Math.floor(sprite.x), Math.floor(sprite.y), sprite.width, sprite.height);
    }
  }
  item.display();
  hero.display();
  hero.movement();
  hero.updateFrames();
  window.requestAnimationFrame(rafLoop);
}
window.requestAnimationFrame(rafLoop);
