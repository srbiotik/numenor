#!/usr/bin/env node

/*
Numenor represents an CLI application which will help users build their numeric working memory capacity.
It is based on the N-Back test, which is a continuous performance task that is commonly used as an assessment in psychology and cognitive neuroscience to measure a part of working memory and working memory capacity.
The N-Back was introduced by Wayne Kirchner in 1958.
It uses an approach where it gradually increases the difficulty of the test, by increasing the number of items that the user has to remember, with a twist the user will have to perform mathematical operations with sets of data.
*/
import { Game } from "../src/game.js";

const game = new Game({})
game.startNewGame();
