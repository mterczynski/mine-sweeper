import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";
import { Board } from "./Board";

export class App extends Component {
  render() {
    return (
      <div className={css(styles.App)}>
        <Board />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  App: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    background: `${THEME.background}`
  }
});
