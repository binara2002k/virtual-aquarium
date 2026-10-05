import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  // =========================
  // FISH
  // =========================

  fishX = 50;
  fishY = 180;

  // 1 = right
  // -1 = left
  fishDirection = 1;

  private targetX = 400;
  private targetY = 150;

  private velocityX = 1;
  private velocityY = 0;


  // =========================
  // FOOD
  // =========================

  foodVisible = false;

  foodX = 400;
  foodY = 20;


  // =========================
  // TIMERS
  // =========================

  private fishTimer:
    ReturnType<typeof setInterval> | undefined;

  private foodTimer:
    ReturnType<typeof setInterval> | undefined;


  constructor(private cdr: ChangeDetectorRef) {}


  // =========================
  // START
  // =========================

  ngOnInit(): void {

    this.chooseNewTarget();

    this.fishTimer = setInterval(() => {

      this.moveFish();

      this.cdr.detectChanges();

    }, 30);
  }


  // =========================
  // MAIN FISH MOVEMENT
  // =========================

  moveFish(): void {

    if (this.foodVisible) {

      this.moveTowardFood();

    } else {

      this.moveNormally();
    }
  }


  // =========================
  // NORMAL SWIMMING
  // =========================

  moveNormally(): void {

    const dx =
      this.targetX - this.fishX;

    const dy =
      this.targetY - this.fishY;

    const distance =
      Math.sqrt(dx * dx + dy * dy);


    // Reached random target
    if (distance < 25) {

      this.chooseNewTarget();

      return;
    }


    const speed = 2;

    const desiredVelocityX =
      (dx / distance) * speed;

    const desiredVelocityY =
      (dy / distance) * speed;


    // Smooth movement
    this.velocityX +=
      (desiredVelocityX - this.velocityX) * 0.03;

    this.velocityY +=
      (desiredVelocityY - this.velocityY) * 0.03;


    this.fishX += this.velocityX;

    this.fishY += this.velocityY;


    // Turn fish
    if (this.velocityX > 0.2) {
      this.fishDirection = 1;
    }

    if (this.velocityX < -0.2) {
      this.fishDirection = -1;
    }
  }


  // =========================
  // MOVE TOWARD FOOD
  // =========================

  moveTowardFood(): void {

    /*
      First determine which direction
      the fish SHOULD face.
    */

    const fishCenterX =
      this.fishX + 50;

    const fishCenterY =
      this.fishY + 25;


    // Food is on right side
    if (this.foodX > fishCenterX + 5) {

      this.fishDirection = 1;
    }

    // Food is on left side
    else if (this.foodX < fishCenterX - 5) {

      this.fishDirection = -1;
    }


    // =========================
    // CALCULATE MOUTH
    // =========================

    let mouthX: number;

    if (this.fishDirection === 1) {

      // Right-facing mouth
      mouthX = this.fishX + 92;

    } else {

      // Left-facing mouth
      mouthX = this.fishX + 8;
    }

    const mouthY =
      this.fishY + 25;


    // =========================
    // DISTANCE FROM MOUTH
    // =========================

    const dx =
      this.foodX - mouthX;

    const dy =
      this.foodY - mouthY;

    const distance =
      Math.sqrt(dx * dx + dy * dy);


    // =========================
    // EAT
    // =========================

    if (distance < 12) {

      this.eatFood();

      return;
    }


    // =========================
    // CHASE FOOD
    // =========================

    const speed = 2.6;

    const desiredVelocityX =
      (dx / distance) * speed;

    const desiredVelocityY =
      (dy / distance) * speed;


    /*
      Smoothly move the fish so its
      MOUTH approaches the food.
    */

    this.velocityX +=
      (desiredVelocityX - this.velocityX) * 0.08;

    this.velocityY +=
      (desiredVelocityY - this.velocityY) * 0.08;


    this.fishX += this.velocityX;

    this.fishY += this.velocityY;


    // =========================
    // KEEP FISH IN AQUARIUM
    // =========================

    if (this.fishX < 10) {
      this.fishX = 10;
    }

    if (this.fishX > 740) {
      this.fishX = 740;
    }

    if (this.fishY < 20) {
      this.fishY = 20;
    }

    if (this.fishY > 350) {
      this.fishY = 350;
    }
  }


  // =========================
  // RANDOM TARGET
  // =========================

  chooseNewTarget(): void {

    this.targetX =
      50 + Math.random() * 680;

    this.targetY =
      50 + Math.random() * 280;
  }


  // =========================
  // FEED FISH
  // =========================

  feedFish(): void {

    // Stop previous food timer
    if (this.foodTimer) {

      clearInterval(this.foodTimer);

      this.foodTimer = undefined;
    }


    // Random horizontal position
    this.foodX =
      100 + Math.random() * 600;


    // Start food at top
    this.foodY = 20;

    this.foodVisible = true;


    // =========================
    // FALLING FOOD
    // =========================

    this.foodTimer = setInterval(() => {

      this.foodY += 1.3;


      // Stop above sand
      if (this.foodY >= 400) {

        this.foodY = 400;

        if (this.foodTimer) {

          clearInterval(this.foodTimer);

          this.foodTimer = undefined;
        }
      }


      this.cdr.detectChanges();

    }, 30);
  }


  // =========================
  // EAT FOOD
  // =========================

  eatFood(): void {

    this.foodVisible = false;


    // Stop food
    if (this.foodTimer) {

      clearInterval(this.foodTimer);

      this.foodTimer = undefined;
    }


    // Give fish a new destination
    this.chooseNewTarget();
  }


  // =========================
  // CLEAN UP
  // =========================

  ngOnDestroy(): void {

    if (this.fishTimer) {
      clearInterval(this.fishTimer);
    }

    if (this.foodTimer) {
      clearInterval(this.foodTimer);
    }
  }
}