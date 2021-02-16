/* eslint-disable react/prop-types */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// マス目
function Square(props) {
  return (
    <button className={`square ${props.highlight}`} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// 盤面
class Board extends React.Component {
  // マス目を描画
  renderSquare(i) {
    const winLines = this.props.winLines
    return (
      <Square
        key={i}
        highlight={winLines && winLines.includes(i) ? 'win' : ''}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    const borad = Array(3)
    for (let row = 0; row < 3; row++) {
      const boardCol = Array(3)
      for (let col = 0; col < 3; col++) {
        boardCol[col] = this.renderSquare(row * 3 + col)
      }
      borad[row] = (
        <div key={`row-${row}`} className="board-row">
          {boardCol}
        </div>
      )
    }
    return <div key="borad">{borad}</div>
  }
}

// ゲーム
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: 0,
          row: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false
    }
  }

  // マス目がクリックされた
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares).mark || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: (i % 3) + 1,
          row: Math.floor(i / 3) + 1
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    })
  }

  reverse() {
    this.setState({
      isReverse: !this.state.isReverse
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    let moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} (${step.col}, ${step.row})`
        : 'Go to game start'
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? 'bold' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    })
    if (this.state.isReverse) {
      moves = moves.reverse()
    }

    let status
    if (winner.mark) {
      status = `Winner: ${winner.mark}`
    } else if (this.state.stepNumber === 9) {
      status = 'Draw'
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLines={winner.lines}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverse()}>昇順・降順切り替え</button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// 勝利判定
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { mark: squares[a], lines: lines[i] }
    }
  }
  return { mark: null, lines: null }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))
