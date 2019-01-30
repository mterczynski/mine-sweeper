import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import { THEME } from "../constants/theme";
import { GameState } from "../enums/gameState";
import { TileType } from "../enums/tileType";
import { Tile } from "./Tile";

type BoardState = {
  gameState: GameState;
  board: any[][];
};

export class Board extends Component<any, BoardState> {
  constructor(props: any) {
    super(props);

    this.state = {
      gameState: GameState.unstarted,
      board: this.getEmptyBoard(this.rowCount, this.columnCount)
    };
  }

  private readonly initialBombsCount = 99;
  private readonly rowCount = 20;
  private readonly columnCount = 24;

  onTileClick = (rowIndex: number, columnIndex: number) => {
    if (this.state.gameState === GameState.unstarted) {
      this.fillBoard(rowIndex, columnIndex);
      this.setState({
        gameState: GameState.started
      });
    }

    if (this.state.gameState === GameState.started) {
      if (this.state.board[rowIndex][columnIndex].hasBomb) {
        this.gameOver();
      } else {
        this.uncoverTiles(rowIndex, columnIndex);
      }
    }
  };

  uncoverTiles(clickedRowIndex: number, clickedColumnIndex: number) {
    // todo
  }

  updateAdjacentBombsCount(board: any[][]) {
    board = board.map((row, rowIndex) =>
      row.map((tile, columnIndex) => {
        let neighborPositionOffsets = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1]
        ];

        let adjacentBombs = 0;

        neighborPositionOffsets.forEach(neighbourPositionOffset => {
          try {
            let hasBomb =
              board[rowIndex + neighbourPositionOffset[0]][
                columnIndex + neighbourPositionOffset[1]
              ].props.hasBomb;
            adjacentBombs += hasBomb;
          } catch {}
        });

        return { ...tile, props: { ...tile.props, adjacentBombs } };
      })
    );

    return board;
  }

  gameOver() {
    this.setState({
      gameState: GameState.failed
    });
    alert("Game Over");
  }

  flagTile = (rowIndex: number, columnIndex: number) => {
    if (this.state.board[rowIndex][columnIndex].type === TileType.unmarked) {
      let newBoard = [...this.state.board];
      newBoard[rowIndex][columnIndex].type = TileType.flagged;

      this.setState({
        board: this.state.board
      });
    }
  };

  getEmptyBoard(rows: number, columns: number) {
    return [...Array(rows)]
      .map(() => [...Array(columns)])
      .map((row, rowIndex) =>
        row.map((_, columnIndex) => (
          <Tile
            type={TileType.unmarked}
            hasBomb={false}
            adjacentBombs={0}
            key={columnIndex}
            flagTile={this.flagTile}
            onTileClick={this.onTileClick}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        ))
      );
  }

  fillBoard(clickedRowIndex: number, clickedColumnIndex: number) {
    let board: any[][] = this.getEmptyBoard(this.rowCount, this.columnCount);

    let unplacedBombsLeft = this.initialBombsCount;

    while (unplacedBombsLeft) {
      let nextColumnIndex = Math.ceil(Math.random() * this.columnCount) - 1;
      let nextRowIndex = Math.ceil(Math.random() * this.rowCount) - 1;
      let isNewTileSameAsClickedTile =
        nextColumnIndex === clickedColumnIndex &&
        clickedRowIndex &&
        nextRowIndex;
      let newField = board[nextRowIndex][nextColumnIndex];
      if (!newField.hasBomb && !isNewTileSameAsClickedTile) {
        newField = {
          ...newField,
          props: {
            ...newField.props,
            hasBomb: true
          }
        };

        board[nextRowIndex][nextColumnIndex] = newField;
        unplacedBombsLeft--;
      }
    }

    board = this.updateAdjacentBombsCount(board);

    this.setState({ board });
  }

  render() {
    return (
      <div>
        {this.state.board.map((row, rowIndex) => {
          return (
            <div className={css(styles.row)} key={rowIndex}>
              {row}
            </div>
          );
        })}
      </div>
    );
  }
}

const styles = StyleSheet.create({
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
