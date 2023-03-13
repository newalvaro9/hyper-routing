const ultrarouting = require('ultra-routing')
const ultraJDB = require('ultrajson-db')

const users = new ultraJDB("users")
const app = new ultrarouting()


app.use(app.bodyparser)

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/login', (req, res, next) => {
    res.sendFile('login.html')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.get(`${username}`)
    if (user && user.password == password) {
        res.send(`Logged in as ${username}`)
    }
    res.send("Incorrect password")

})


app.listen(3080, () => {
    console.log("Connected")
})