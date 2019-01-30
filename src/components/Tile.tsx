import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";
import { TileType } from "../enums/tileType";

export type TileProps = {
  type: TileType;
  hasBomb: boolean;
  adjacentBombs?: number;

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
    let body: any = "";
    if (this.props.type === TileType.flagged) {
      body = <img src="assets/flag.png" alt="" />;
    } else if (this.props.type === TileType.exposed) {
      body = this.props.adjacentBombs || "";
    }

    return (
      <div
        className={css(styles.tile, styles.uncoveredTile)}
        onContextMenu={this.onRightMouseButtonClick}
        onClick={this.props.onTileClick}
      >
        {body}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    "border-left": `1px solid ${THEME.tileBorder}`,
    "border-top": `1px solid ${THEME.tileBorder}`,
    height: "20px",
    width: "20px",
    ":last-child": {
      "border-right": `1px solid ${THEME.tileBorder}`
    },
    "text-align": "center",
    "line-height": "20px",
    "font-family": "impact"
  },

  uncoveredTile: {
    background: "rgb(192, 192, 192)"
  }
});
