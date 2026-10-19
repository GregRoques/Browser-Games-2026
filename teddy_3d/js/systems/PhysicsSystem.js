import { PHYSICS } from '../utils/Constants.js';

export class PhysicsSystem {
    update(teddy, dt, inputManager) {
        // Variable-height jump: apply extra force while holding
        if (teddy.isJumping && inputManager.isJumpHeld()) {
            teddy.jumpHoldTimer += dt;
            if (teddy.jumpHoldTimer < PHYSICS.JUMP_HOLD_TIME) {
                teddy.velocityY += PHYSICS.JUMP_HOLD_FORCE * dt;
            }
        }
        if (!inputManager.isJumpHeld()) {
            teddy.isJumping = false;
        }

        // Gravity
        if (!teddy.isGrounded || teddy.velocityY > 0) {
            teddy.velocityY += PHYSICS.GRAVITY * dt;
            teddy.mesh.position.y += teddy.velocityY * dt;

            // Cap max jump height
            const maxY = PHYSICS.GROUND_Y + PHYSICS.MAX_JUMP_Y;
            if (teddy.mesh.position.y > maxY) {
                teddy.mesh.position.y = maxY;
                if (teddy.velocityY > 0) teddy.velocityY = 0;
            }

            // Ground check
            if (teddy.mesh.position.y <= PHYSICS.GROUND_Y && teddy.velocityY <= 0) {
                teddy.mesh.position.y = PHYSICS.GROUND_Y;
                teddy.velocityY = 0;
                teddy.isGrounded = true;
                teddy.isJumping = false;
                teddy.jumpHoldTimer = 0;
            }
        }

        return null;
    }
}
