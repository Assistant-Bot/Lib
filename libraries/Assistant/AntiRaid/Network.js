class NeuralNetwork {
    /**
     * @param {Any} input - Known Input
     * @param {Any} expected - Known For the inputs
     * @param {Number} trainingIterations - How many times to train?
     * @param {Number} trainingMax - The Time to stop training.
     */
    constructor (input, expected, trainingIterations=10000, trainingTime=10000) {
        this.input = input;
        this.expected = expected;
        this.trainingIterations = trainingIterations;
        this.trainingMax = trainingTime;
    }

    sigmoid(x) {return 1 / (1 + Math.exp(x))};
    sigmoid_derative(x) {return x * (1 - x)};

    think(inputs) {

    }

    train(data) {
        this.__iterationStart = new Date();
        for (let x = 0; x < this.trainingIterations; x++) {
            if (new Date() - this.__iterationStart >= this.trainingMax) break;
        }

        return output;
    }

}

/* EXAMPLE */
const n = new NeuralNetwork(['test', {test: true}, 0], ['String', 'Object', 'Number']);
n.train(['what is this?', 'and this?', {how_about_this: '?'}, 1]); //['String', 'String', 'Object', 'Object']
/**
 * Prints:
 * ['String', 'String', 'Object', 'Object']
 */