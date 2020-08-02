
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';

// 函数形式存在的格子
function Square ( props )
{
    // 当格子被点击时, 调用棋盘里的onWowClick
    return (
        <button className="square" onClick={ props.onWowClick }>
            { props.value }
        </button>
    );
}

// 棋盘包含格子
class Board extends React.Component
{
    renderSquare ( i )
    {
        // onWowClick被调用时, 调用游戏的onCoolClick
        return (
            <Square
                key={ i }
                value={ this.props.squares[ i ] }
                onWowClick={ () => this.props.onCoolClick( i ) }
            />
        );
    }

    // 渲染9个格子
    render ()
    {
        // 附加要求: 使用两个循环来渲染出棋盘的格子，而不是在代码里写死
        let board = [];
        for ( let i = 0; i < 3; i++ )
        {
            let rows = [];
            for ( let j = 0; j < 3; j++ )
            {
                rows.push( this.renderSquare( ( i * 3 ) + j ) );
            }
            board.push( <div key={ i } className={ "board-row row-" + i }>{ rows }</div> );
        }
        return (
            <div key="board">{ board }</div>
        );
    }
}

class HistoryButton extends React.Component
{

    constructor ( props )
    {
        super( props );
        this.state = { clsName: this.props.zzz };
    }

    btnClick ( event )
    {
        event(); // 可有可无
        // ! 失败了, 因为在Game里我无法更新其他按钮的clsName为null
        // ! 也就是说所有点过的按钮都会变成加粗
        // ! 所有历史记录按钮都在moves里, 而moves在render里
        // ! 所以若想获取所有历史记录按钮, 还需要在Game的state上动手脚
        // this.setState( {
        //     clsName: "selected"
        // } );
    }

    render ()
    {
        return (
            // 为了调用setState才这么写, 应该存在更优雅的方法
            <button className={ this.state.clsName } onClick={ () => this.btnClick( this.props.yyy ) }>{ this.props.xxx }</button>
        );
    }
}

// 游戏包含棋盘和本局游戏状态
class Game extends React.Component
{
    // 游戏的state包含: 历史记录, 下一步棋子种类, 步数
    constructor ( props )
    {
        super( props );
        this.state = {
            history: [
                {
                    squares: Array( 9 ).fill( null )
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            location: []
        };
    }

    // 处理下棋
    handleClick ( i )
    {
        const hs = this.state.history.slice( 0, this.state.stepNumber + 1 );
        const cr = hs[ hs.length - 1 ];
        const sq = cr.squares.slice();
        this.state.location.push( i );
        if ( calculateWinner( sq ) || sq[ i ] )
        {
            return;
        }
        sq[ i ] = this.state.xIsNext ? "X" : "O";
        this.setState( {
            history: hs.concat( [
                {
                    squares: sq
                }
            ] ),
            stepNumber: hs.length,
            xIsNext: !this.state.xIsNext
        } );
    }

    // 跳转历史步骤
    jumpTo ( step )
    {
        this.setState( {
            stepNumber: step,
            xIsNext: step % 2 === 0
        } );
    }

    render ()
    {
        const history = this.state.history;
        const current = history[ this.state.stepNumber ];
        const winner = calculateWinner( current.squares );
        const moves = history.map( ( step, move ) =>
        {
            const row = 1 + Math.floor( this.state.location[ move - 1 ] / 3 );
            const col = 1 + this.state.location[ move - 1 ] % 3;
            const desc = move ? ( "Go to move #" + move + " (row " + row + ", col " + col + ")" ) : "Go to game start";
            // 传入的props不需要提前声明, 直接在HistoryButton就可以用这里的xxx, yyy, zzz
            let btn = <HistoryButton xxx={ desc } yyy={ () => this.jumpTo( move ) } zzz={ null } />;
            return (
                <li key={ move }>{ btn }</li>
            );
        } );
        let status;
        if ( winner ) status = "Winner: " + winner;
        else status = "Next player: " + ( this.state.xIsNext ? "X" : "O" );

        // onCoolClick被调用时, 调用游戏的handleClick
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        onCoolClick={ ( i ) => this.handleClick( i ) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// 计算赢家
function calculateWinner ( squares )
{
    const lines = [
        [ 0, 1, 2 ],
        [ 3, 4, 5 ],
        [ 6, 7, 8 ],
        [ 0, 3, 6 ],
        [ 1, 4, 7 ],
        [ 2, 5, 8 ],
        [ 0, 4, 8 ],
        [ 2, 4, 6 ]
    ];
    for ( let i = 0; i < lines.length; i++ )
    {
        const [ a, b, c ] = lines[ i ];
        if ( squares[ a ] && squares[ a ] === squares[ b ] && squares[ a ] === squares[ c ] )
        {
            return squares[ a ];
        }
    }
    return null;
}

ReactDOM.render( <Game />, document.getElementById( "root" ) );
