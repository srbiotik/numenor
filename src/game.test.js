import { Game } from './game';

test('score method lowers score when no hits', () => {
    const game = new Game({});
    game.hits = 0;
    game.operations = ['+', '+'];
    game.currentLevel = 2;
    game.score();
    expect(game.levelOffset).toBe(-1);
});
