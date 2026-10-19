import { Mummy } from './Mummy.js';
import { Zombie } from './Zombie.js';
import { Bat } from './Bat.js';
import { Ghost } from './Ghost.js';
import { Spider } from './Spider.js';
import { Skeleton } from './Skeleton.js';
import { JackOLantern } from './JackOLantern.js';

export class EnemyFactory {
    create(type, lane, z) {
        switch (type) {
            case 'mummy':       return new Mummy(lane, z);
            case 'zombie':      return new Zombie(lane, z);
            case 'bat':         return new Bat(lane, z);
            case 'ghost':       return new Ghost(lane, z);
            case 'spider':      return new Spider(lane, z);
            case 'skeleton':    return new Skeleton(lane, z);
            case 'jackolantern': return new JackOLantern(lane, z);
            default:
                console.warn(`Unknown enemy type: ${type}`);
                return null;
        }
    }
}
