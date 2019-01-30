import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";
import { Tile } from "./Tile";

export class Board extends Component {
  rows = 20;
  columns = 30;

  board = [...Array(this.rows)].map(() => Array(this.columns));

  render() {
    return (
      <div className={css(styles.board)}>
        {this.board.map((row, rowIndex) => (
          <div className={css(styles.row)} key={rowIndex}>
            {row.map((_, columnIndex) => (
              <Tile key={columnIndex} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  board: {
    // background: "white"
  },

  row: {
    display: "flex",
    ":last-child > *": {
      "border-bottom": `1px solid ${THEME.tileBorder}`
    }
  },

  tile: {
    "border-left": `1px solid ${THEME.tileBorder}`,
    "border-top": `1px solid ${THEME.tileBorder}`,
    height: "20px",
    width: "20px",
    ":last-child": {
      "border-right": `1px solid ${THEME.tileBorder}`
    }
  }
});
