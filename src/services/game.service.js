// Временное хранилище в памяти (в будущем можно заменить на БД)
let games = [];
let nextId = 1;

/**
 * Сервис для работы с играми
 */
export class GameService {
  /**
   * Получить все игры
   */
  static async getAllGames() {
    return games;
  }

  /**
   * Получить игру по ID
   */
  static async getGameById(id) {
    const gameId = parseInt(id, 10);
    return games.find(game => game.id === gameId) || null;
  }

  /**
   * Создать новую игру
   */
  static async createGame(gameData) {
    const newGame = {
      id: nextId++,
      ...gameData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    games.push(newGame);
    return newGame;
  }

  /**
   * Обновить игру
   */
  static async updateGame(id, gameData) {
    const gameId = parseInt(id, 10);
    const gameIndex = games.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
      return null;
    }

    games[gameIndex] = {
      ...games[gameIndex],
      ...gameData,
      id: gameId,
      updatedAt: new Date().toISOString()
    };

    return games[gameIndex];
  }

  /**
   * Удалить игру
   */
  static async deleteGame(id) {
    const gameId = parseInt(id, 10);
    const gameIndex = games.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
      return false;
    }

    games.splice(gameIndex, 1);
    return true;
  }
}

