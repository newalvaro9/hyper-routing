const hyperRouting = require('hyper-routing');
const { readdirSync } = require('fs');
const app = new hyperRouting();

const PORT = 3000;

function getRandomPath(category) {
    const files = readdirSync(`./views/images/${category}`);
    const randomIndex = Math.floor(Math.random() * files.length);
    return 'images' + '/' + category + '/' + files[randomIndex];
};

app.get('/', (req, res) => {
    res.send('To get images make a GET request to /images/<category>');
});

app.get('/images/:category', (req, res) => {
    const { category } = req.params;

    switch (category) {
        case 'dogs':
            res.sendFile(getRandomPath('dogs'));
            break;
        case 'cats':
            res.sendFile(getRandomPath('cats'));
            break;
        case 'rabbits':
            res.sendFile(getRandomPath('rabbits'));
            break;
        default:
            res.send("Invalid image category!");
            break;
    };
});

app.listen(PORT, () => {
    console.log(`Image API ready and listening in port ${PORT}!`);
});