import { expect, describe, it } from '@jest/globals';
import { Game } from './game';

describe('score()', () => {
    describe('when score is less than fail', () => {
        const game = new Game({});
        it('should levelOffset should be -1', () => {
            game.hits = 0;
            game.operations = ['+', '+'];
            game.currentLevel = 2;
            game.score();
            expect(game.levelOffset).toBe(-1);
        });
    });
    describe('when score is greater than pass', () => {
        const game = new Game({});
        it('should levelOffset should be 1', () => {
            game.hits = 2;
            game.operations = ['+', '+'];
            game.currentLevel = 2;
            game.score();
            expect(game.levelOffset).toBe(1);
        });
    });
    describe('when score is greater than fail but less then pass', () => {
        const game = new Game({});
        it('should levelOffset should be 0', () => {
            game.hits = 3;
            game.operations = ['+', '+', '+', '+'];
            game.currentLevel = 2;
            game.score();
            expect(game.levelOffset).toBe(0);
        });
    });
});
