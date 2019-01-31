import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";
import { TileType } from "../enums/tileType";

export type TileProps = {
  type: TileType;
  hasBomb: boolean;
  adjacentBombs?: number;
  rowIndex: number;
  columnIndex: number;

  // Callbacks:
  flagTile: any;
  onTileClick: any;
};
export class Tile extends Component<TileProps> {
  onRightMouseButtonClick = () => {
    this.props.flagTile();
    return false;
  };

  render() {
    let tileStyles = [styles.tile];
    if (this.props.type === TileType.exposed && !this.props.hasBomb) {
      tileStyles.push(styles.uncoveredTile);
    }

    let body: any = "";
    if (this.props.type === TileType.unmarked) {
      body = "";
    } else if (this.props.type === TileType.flagged) {
      body = <img src="assets/flag.svg" alt="" className={css(styles.icon)} />;
    } else if (this.props.type === TileType.exposed) {
      body = this.props.adjacentBombs || "";
      if (this.props.hasBomb) {
        body = (
          <img src="assets/mine.png" alt="" className={css(styles.icon)} />
        );
      }
    }

    return (
      <div
        className={css(tileStyles)}
        onContextMenu={this.onRightMouseButtonClick}
        onClick={() =>
          this.props.onTileClick(this.props.rowIndex, this.props.columnIndex)
        }
      >
        {body}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    height: "100%",
    width: "100%",
    left: 0,
    top: 0
  },

  tile: {
    position: "relative",
    "border-left": `1px solid ${THEME.tileBorder}`,
    "border-top": `1px solid ${THEME.tileBorder}`,
    height: "20px",
    width: "20px",
    ":last-child": {
      "border-right": `1px solid ${THEME.tileBorder}`
    },
    "text-align": "center",
    "line-height": "20px",
    "font-family": "impact",
    background: "rgb(128, 128, 128)"
  },

  uncoveredTile: {
    background: `rgb(192, 192, 192)`
  }
});
