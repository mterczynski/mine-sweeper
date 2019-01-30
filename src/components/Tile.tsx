import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";

export class Tile extends Component {
  render() {
    return <div className={css(styles.tile, styles.uncoveredTile)}>1</div>;
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
