import { css, StyleSheet } from "aphrodite";
import React, { Component } from "react";
import Popup from "react-popup";
import { NEIGHBOUR_POSITION_OFFSETS } from "../constants/neighbourPositionOffsets";
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

  // private readonly initialBombsCount = 20;
  // private readonly rowCount = 10;
  // private readonly columnCount = 12;

  // private readonly initialBombsCount = 4;
  // private readonly rowCount = 6;
  // private readonly columnCount = 6;

  restartGame = () => {
    this.setState({
      gameState: GameState.unstarted,
      board: this.getEmptyBoard(this.rowCount, this.columnCount)
    });
  };

  onTileClick = (rowIndex: number, columnIndex: number) => {
    if (this.state.gameState === GameState.unstarted) {
      let board = this.getFilledBoard(rowIndex, columnIndex);
      this.setState({ gameState: GameState.started });
      this.uncoverTiles(rowIndex, columnIndex, board);
    } else if (this.state.gameState === GameState.started) {
      if (this.state.board[rowIndex][columnIndex].props.hasBomb) {
        this.gameOver();
      } else {
        this.uncoverTiles(rowIndex, columnIndex);
      }
    }
  };

  checkForWin(board: any[][]) {
    return board.every(row =>
      row.every(
        tile => tile.props.type === TileType.exposed || tile.props.hasBomb
      )
    );
  }

  uncoverTiles(
    clickedRowIndex: number,
    clickedColumnIndex: number,
    board: any[][] = this.state.board
  ) {
    const possiblePositionsToExpose = new Set<string>();
    const checkedPositions = new Set<string>();
    let boardCopy = [...board];

    possiblePositionsToExpose.add(clickedRowIndex + ";" + clickedColumnIndex);

    let tile = boardCopy[clickedRowIndex][clickedColumnIndex];
    if (!tile.props.hasBomb) {
      boardCopy[clickedRowIndex][clickedColumnIndex] = {
        ...tile,
        props: { ...tile.props, type: TileType.exposed }
      };
      if (!tile.props.adjacentBombs) {
        NEIGHBOUR_POSITION_OFFSETS.forEach(offset => {
          let neighbourRowIndex = clickedRowIndex + offset[0];
          let neighbourColumnIndex = clickedColumnIndex + offset[1];
          if (
            neighbourRowIndex < this.rowCount &&
            neighbourColumnIndex < this.columnCount &&
            neighbourRowIndex >= 0 &&
            neighbourColumnIndex >= 0
          ) {
            possiblePositionsToExpose.add(
              neighbourRowIndex + ";" + neighbourColumnIndex
            );
          }
        });
      }
    }

    while (possiblePositionsToExpose.size) {
      let tileCoords = [...possiblePositionsToExpose][0].split(";").map(Number);
      let tile = boardCopy[tileCoords[0]][tileCoords[1]];

      // add neighbours to possiblePositionsToExpose if they weren't checked before
      if (!tile.props.hasBomb && !tile.props.adjacentBombs) {
        NEIGHBOUR_POSITION_OFFSETS.forEach(offset => {
          let neighbourRowIndex = tileCoords[0] + offset[0];
          let neighbourColumnIndex = tileCoords[1] + offset[1];
          let neighbourPosition =
            neighbourRowIndex + ";" + neighbourColumnIndex;
          if (
            neighbourRowIndex < this.rowCount &&
            neighbourColumnIndex < this.columnCount &&
            neighbourRowIndex >= 0 &&
            neighbourColumnIndex >= 0 &&
            !checkedPositions.has(neighbourPosition)
          ) {
            possiblePositionsToExpose.add(neighbourPosition);
          }
        });
      }

      if (!tile.props.hasBomb) {
        boardCopy[tileCoords[0]][tileCoords[1]] = {
          ...tile,
          props: { ...tile.props, type: TileType.exposed }
        };
      }

      checkedPositions.add([...possiblePositionsToExpose][0]);
      possiblePositionsToExpose.delete([...possiblePositionsToExpose][0]);
    }

    if (this.checkForWin(boardCopy)) {
      boardCopy = boardCopy.map(row =>
        row.map(tile => ({
          ...tile,
          props: {
            ...tile.props,
            type:
              tile.props.type === TileType.flagged
                ? TileType.flagged
                : TileType.exposed
          }
        }))
      );
      Popup.alert("You won!");
    }
    this.setState({
      board: boardCopy
    });
  }

  updateAdjacentBombsCount(board: any[][]) {
    board = board.map((row, rowIndex) =>
      row.map((tile, columnIndex) => {
        let adjacentBombs = 0;

        NEIGHBOUR_POSITION_OFFSETS.forEach(offset => {
          try {
            adjacentBombs +=
              board[rowIndex + offset[0]][columnIndex + offset[1]].props
                .hasBomb;
          } catch {}
        });

        return { ...tile, props: { ...tile.props, adjacentBombs } };
      })
    );

    return board;
  }

  gameOver() {
    this.setState({
      gameState: GameState.failed,
      board: this.state.board.map(row =>
        row.map(tile => {
          if (tile.props.hasBomb) {
            return {
              ...tile,
              props: { ...tile.props, type: TileType.exposed }
            };
          }
          return tile;
        })
      )
    });
    Popup.alert("Game over!");
  }

  flagTile = (rowIndex: number, columnIndex: number) => {
    if (
      this.state.gameState === GameState.started &&
      this.state.board[rowIndex][columnIndex].props.type !== TileType.exposed
    ) {
      let newBoard = [...this.state.board];
      let tile = newBoard[rowIndex][columnIndex];
      let newTileType = TileType.flagged;
      if (tile.props.type === TileType.flagged) {
        newTileType = TileType.unmarked;
      }

      newBoard[rowIndex][columnIndex] = {
        ...tile,
        props: { ...tile.props, type: newTileType }
      };

      this.setState({
        board: newBoard
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

  getFilledBoard(clickedRowIndex: number, clickedColumnIndex: number) {
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

    return board;
  }

  render() {
    return (
      <div className={css(styles.boardWrapper)}>
        <button
          className={css(styles.restartGameButton)}
          onClick={this.restartGame}
        >
          Restart
        </button>
        <div>
          {this.state.board.map((row, rowIndex) => {
            return (
              <div className={css(styles.row)} key={rowIndex}>
                {row}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  boardWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  restartGameButton: {
    "margin-bottom": "20px",
    height: "30px",
    width: "60px",
    background: `red`,
    color: "white",
    "font-family": "Impact"
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
