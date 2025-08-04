import React, { useState, useEffect } from "react";
import { Button, Card, Typography, notification, Spin } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import { gameService } from "../../services/game-service";
import styles from "./ticTacToe.module.scss";
import { Navbar } from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useGetCurrentGame } from "../../hooks/game";
import { useQueryClient } from "@tanstack/react-query";
import { CONSTANTS } from "../../utils/constants.utils";

const { Title } = Typography;

const TicTacToe: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [gameLoading, setGameLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const { 
    data: gameData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentGame();

  const gameSession = gameData?.gameSession || null;

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load game";
      if (!errorMessage.includes("No active game session")) {
        showError("Failed to load game", errorMessage);
      }
    }
  }, [isError, error]);

  const startNewGame = async (isComputerFirst: boolean) => {
    try {
      setGameLoading(true);
      await gameService.startGame(isComputerFirst);

      // refetch to get the updated game state
      await refetch();

      showSuccess(
        "New game started!",
        `Game started with ${isComputerFirst ? "computer" : "you"} going first`
      );
    } catch (error: any) {
      showError("Failed to start new game", error.message);
    } finally {
      setGameLoading(false);
    }
  };

  const makeMove = async (row: number, col: number) => {
    if (!gameSession || gameSession.gameState.isOver) return;

    // find out if it's user's turn based on currentPlayer
    // user is "O" when computer goes first, "X" when user goes first
    const isUserTurn =
      gameSession.currentPlayer === (gameSession.isComputerFirst ? "O" : "X");

    if (!isUserTurn) {
      showError(
        "Not your turn",
        "Please wait for the computer to make its move"
      );
      return;
    }

    try {
      setGameLoading(true);
      const response = await gameService.makeMove(row, col);
      
      // update the cache with the new game state
      queryClient.setQueryData(['CURRENT_GAME'], response);

      if (response.gameSession.gameState.isOver) {
        if (response.gameSession.gameState.winner) {
          showSuccess(
            "Game Over!",
            `Winner: ${response.gameSession.gameState.winner}`
          );
        } else if (response.gameSession.gameState.isDraw) {
          showSuccess("Game Over!", "It's a draw!");
        }
      }
    } catch (error: any) {
      showError("Invalid move", error.message);
    } finally {
      setGameLoading(false);
    }
  };

  const showSuccess = (title: string, message: string) => {
    api.success({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  const showError = (title: string, message: string) => {
    api.error({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  const renderCell = (value: string, row: number, col: number) => {
    if (!gameSession) return null;

    const isUserTurn =
      gameSession.currentPlayer === (gameSession.isComputerFirst ? "O" : "X");

    const isClickable =
      !gameSession.gameState.isOver && isUserTurn && value === "";

    return (
      <div
        key={`${row}-${col}`}
        className={`${styles.cell} ${isClickable ? styles.clickable : ""}`}
        onClick={() => isClickable && makeMove(row, col)}
      >
        <span className={styles.cellValue}>{value}</span>
      </div>
    );
  };

  const renderBoard = () => {
    if (!gameSession) return null;

    return (
      <div className={styles.board}>
        {gameSession.board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </div>
        ))}
      </div>
    );
  };

  const renderStartGameButtons = () => {
    if (gameSession && !gameSession.gameState.isOver) return null;

    return (
      <div className={styles.startGameSection}>
        <Title level={3}>Start New Game</Title>
        <div className={styles.startButtons}>
          <Button
            type="primary"
            size="large"
            onClick={() => startNewGame(false)}
            loading={gameLoading}
            disabled={gameLoading}
          >
            User Goes First (X)
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => startNewGame(true)}
            loading={gameLoading}
            disabled={gameLoading}
          >
            Computer Goes First (X)
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {isLoading && (
        <div className={styles.container}>
          <Spin size="large" />
        </div>
      )}
      <div className={styles.container}>
        {contextHolder}
        <Card className={styles.gameCard}>
          <div className={styles.header}>
            <Title level={2}>Tic Tac Toe</Title>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                icon={<DashboardOutlined />}
                onClick={() => navigate(CONSTANTS.GAME_STATS_PAGE)}
                type="default"
              >
                Dashboard
              </Button>
            </div>
          </div>

          {!gameSession && renderStartGameButtons()}

          {gameSession && (
            <>
              {renderBoard()}

              <div className={styles.gameOverSection}>
                <Button
                  type="primary"
                  onClick={() => {
                    // clear the game session by invalidating the query
                    queryClient.setQueryData(['CURRENT_GAME'], null);
                  }}
                  size="large"
                >
                  Start New Game
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default TicTacToe;
