import { TileType } from "../enums/tileType";

export interface Tile {
  type: TileType;
  hasBomb: boolean;
}
