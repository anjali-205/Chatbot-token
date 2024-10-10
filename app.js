const express = require('express');

const natural = require('natural');

 

const app = express();

 

// Use middleware to handle form data

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

 

// Tokenizer function using 'natural'

const tokenizer = new natural.WordTokenizer();

 

// Home route to take user input

app.get('/', (req, res) => {

    res.send(`

        <style>

            body {

                font-family: Arial, sans-serif;

                text-align: center;

                padding: 20px;

                background-color: #f9f9f9;

            }

            form {

                margin-bottom: 20px;

            }

            input[type="text"] {

                padding: 10px;

                width: 300px;

                border: 1px solid #ccc;

                border-radius: 5px;

            }

            button {

                padding: 10px 20px;

                background-color: #007bff;

                color: white;

                border: none;

                border-radius: 5px;

                cursor: pointer;

            }

            button:hover {

                background-color: #0056b3;

            }

            #plot {

                width: 100%;

                height: 500px;

            }

        </style>

        <h1>3D Token Plot with Arrows</h1>

        <form action="/tokenize" method="post">

            <label>Enter sentences (separate with a semicolon ';'):</label><br/>

            <input type="text" name="sentences" /><br/><br/>

            <button type="submit">Tokenize, Plot and Predict</button>

        </form>

        <div id="plot"></div>

    `);

});

 

// Route to handle tokenization and plotting

app.post('/tokenize', (req, res) => {

    const sentences = req.body.sentences;

 

    // Validate that 'sentences' is defined and not empty

    if (!sentences) {

        return res.send(`

            <h1>Error</h1>

            <p>Please provide some sentences.</p>

            <a href="/">Go back</a>

        `);

    }

 

    const tokens = [];

    // Split the sentences and tokenize

    sentences.split(';').forEach(sentence => {

        tokens.push(...tokenizer.tokenize(sentence.trim()));

    });

 

    // Print the tokens

    console.log("Tokens: ", tokens);

 

    // Create data for 3D plot (arrows)

    const x = [];

    const y = [];

    const z = [];

    const u = [];  // Arrow length in x-direction

    const v = [];  // Arrow length in y-direction

    const w = [];  // Arrow length in z-direction

 

    // Generate random data for each token and prepare arrays for plotting

    tokens.forEach((token, index) => {

        x.push(index); // Token index as 'x'

        y.push(token.length);  // Token length as 'y'

        z.push(Math.random() * 10);  // Random 'z' value

 

        // Set arrow directions (u, v, w) to simulate arrows

        u.push(0.5);  // Horizontal arrow component (in x-direction)

        v.push(0.5);  // Vertical arrow component (in y-direction)

        w.push(0.5);  // Z-direction arrow component (upwards)

    });

 

    // Calculate the prediction: Average token length as a simple "prediction"

    const avgTokenLength = tokens.reduce((acc, token) => acc + token.length, 0) / tokens.length;

    const predictedTokenLength = avgTokenLength.toFixed(2); // Limit prediction to 2 decimal places

 

    // Serve the HTML with embedded plot

    res.send(`

        <style>

            body {

                font-family: Arial, sans-serif;

                text-align: center;

                padding: 20px;

                background-color: #f9f9f9;

            }

            #plot {

                width: 100%;

                height: 500px;

            }

        </style>

        <h1>3D Token Plot with Arrows</h1>

        <p>Tokens: ${tokens.join(', ')}</p>

        <p>Prediction: The predicted next token length is: ${predictedTokenLength} characters</p>

        <div id="plot"></div>

 

        <!-- Plotly.js from CDN -->

        <script src=https://cdn.plot.ly/plotly-2.35.2.min.js charset="utf-8"></script>

        <script>

            // Plot arrows by connecting points with lines

            const trace = {

                x: [].concat(...${JSON.stringify(x)}.map((x, i) => [x, x + ${JSON.stringify(u)}[i]])),

                y: [].concat(...${JSON.stringify(y)}.map((y, i) => [y, y + ${JSON.stringify(v)}[i]])),

                z: [].concat(...${JSON.stringify(z)}.map((z, i) => [z, z + ${JSON.stringify(w)}[i]])),

                mode: 'lines+text',

                type: 'scatter3d',

                text: ${JSON.stringify(tokens)},  // Labels for each token

                textposition: 'top center',

                line: {

                    width: 6,

                    color: 'blue'

                }

            };

 

            const layout = {

                title: '3D Token Plot with Arrows',

                scene: {

                    xaxis: { title: 'Token Index' },

                    yaxis: { title: 'Token Length' },

                    zaxis: { title: 'Random Z' }

                }

            };

 

            const data = [trace];

            Plotly.newPlot('plot', data, layout);

        </script>

    `);

});

 

// Start the server

const port = 3001;

app.listen(port, () => {

    console.log(`App listening at http://localhost:${port}`);

});

