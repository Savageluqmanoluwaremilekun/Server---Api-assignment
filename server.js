const http = require('http');

let db = [
    {
        title : "What did the mic tell the user? Stop spitting on me",
        comedian: "John Doe",
        year: 1994,
        id: 1
    },
    {
        title: "Why is it called fried rice when it is not fried with the pan",
        comedian: "Erik ten hag",
        year: 1849,
        id: 2
    },
    {
        title: "Some code like they dress",
        comedian: "David moyes",
        year: 2000,
        id: 3
    },
    {
        title: "After cooking for 4 months, it was a spaghetti code",
        comedian: "Starly Chambers",
        year: 1888,
        id: 4
    }
];

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        handlePost(req, res);
    } else if (req.method === 'GET' && req.url === '/') {
        handleGet(req, res);
    } else if (req.method === 'PATCH' && req.url.startsWith('/joke/')) {
        handlePatch(req, res);
    } else if (req.method === 'DELETE' && req.url.startsWith('/joke/')) {
        handleDelete(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

function handlePost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const newJoke = JSON.parse(body);
            newJoke.id = db.length + 1;
            db.push(newJoke);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid JSON');
        }
    });
}

function handleGet(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
}

function handlePatch(req, res) {
    const jokeId = parseInt(req.url.slice(6), 10);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const updatedJoke = JSON.parse(body);
            db = db.map(joke => {
                if (joke.id === jokeId) {
                    return {
                        ...joke,
                        ...updatedJoke
                    };
                } else {
                    return joke;
                }
            });
            const updatedJokeIndex = db.findIndex(joke => joke.id === jokeId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db[updatedJokeIndex]));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid JSON');
        }
    });
}

function handleDelete(req, res) {
    const jokeId = parseInt(req.url.slice(6), 10);
    const deletedJokeIndex = db.findIndex(joke => joke.id === jokeId);
    if (deletedJokeIndex !== -1) {
        const deletedJoke = db.splice(deletedJokeIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedJoke));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Joke not found');
    }
}

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
