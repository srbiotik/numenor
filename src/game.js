// Desc: Main game file
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { exec } from 'child_process';

import { getDefaultSettings } from './settings.js';


// Constructs the main game object
export class Game {
    constructor(options) {
        this.options = options;
        this.settings = getDefaultSettings();
        this.currentLevel = this.settings.defaultLevel;
    }
    start() {
        console.log('Start game');
        this.run();
    }
    async startNewGame() {
        this.readline = readline.createInterface({ input, output });
        const answer = await this.readline.question('Nova igra? (da/ne) ');
        if (answer == 'da') {
            this.gameLevel = this.settings.levels[this.currentLevel]
            this.numbers = this.generateNumbers();
            this.operations = this.generateOperations();
            this.hits = 0;
            console.log(this.gameLevel.description);
            this.run();
        } else {
            this.readline.close();
            process.exit(0);
        }
    }
    run() {
        let counter = 0;
        const interval = setInterval(async () => {
            this.sayNumber(counter);
            if (counter == this.numbers.length) {
                clearInterval(interval);
                this.printResult();
                this.readline.close();
                this.startNewGame();
            } else if (counter >= this.gameLevel.n && counter < this.numbers.length) {
                let operands = this.numbers.slice(counter - this.gameLevel.n, counter + 1);
                let operations = this.operations.slice(counter - this.gameLevel.n, counter);
                let result = this.calculateResult(operands, operations);
                counter++;
                const answer = await this.readline.question('Resultat: ')
                if (parseInt(answer) == result) {
                    console.log('√');
                    this.hits++
                } else {
                    console.log('X');
                };
            } else {
                counter++;
            }
        }, this.gameLevel.interval * 1000);
    }
    generateNumbers() {
        const numbers = [];
        const [start, end] = this.gameLevel.numRange
        for (let i = 0; i < this.settings.rounds + this.gameLevel.n + 1; i++) {
            let number = Math.floor(Math.random() * (end - start + 1)) + start;
            numbers.push(number);
        }
        return numbers;
    }
    generateOperations() {
        const operations = [];
        for (let i = 0; i < this.settings.rounds + this.gameLevel.n; i++) {
            let randIndex = Math.floor(Math.random() * this.gameLevel.operations.length)
            operations.push(this.gameLevel.operations[randIndex]);
        }
        return operations;
    }
    calculateResult(operands, operations) {
        let result = operands[0];
        for (let i = 1; i < operands.length; i++) {
            if (operations[i - 1] === '+') {
                result += operands[i];
            } else if (operations[i - 1] === '-') {
                result -= operands[i];
            }
        }
        return result;
    }
    speak(text, language = 'Lana') {
        exec(`say -v ${language} ${text}`);
    }
    sayNumber(counter) {
        if (counter == 0) {
            this.speak(`${this.numbers[counter]}`);
        } else if (counter >= this.gameLevel.n && counter < this.numbers.length) {
            const operation = this.getOperationName(this.operations[counter - 1]);
            this.speak(`${operation} ${this.numbers[counter]}`)
        } else if (counter == this.numbers.length - 1) {
            this.speak(`${this.numbers[counter]}`);
        }
    }
    printResult() {
        const score = 100 * this.hits / this.operations.length;
        console.log(`Rezultat: ${this.hits}/${this.operations.length} - ${score.toFixed(2)}%`);

        if (score >= this.settings.passScore) {
            console.log('Odlicno! Prelazis na sledeci nivo!');
            if (this.currentLevel < this.settings.levels.length - 1) this.currentLevel++;
        } else if (score < this.settings.passScore && score >= this.settings.failScore) {
            console.log('Bravo! Ostajes na istom nivou!');
        } else {
            console.log('Ne prolazis!');
            if (this.currentLevel > 1) this.currentLevel--;
        }
    }
    getOperationName(operation) {
        switch (operation) {
            case '+':
                return 'plus';
            case '-':
                return 'minus';
        }
    }
}


