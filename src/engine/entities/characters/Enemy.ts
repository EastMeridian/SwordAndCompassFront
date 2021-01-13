import { EnemyData } from 'src/engine/data/entities';
import Character from './Character';

export default abstract class Enemy extends Character {
  abstract entity: EnemyData;
}
