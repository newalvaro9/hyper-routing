# Ultra-Routing
![version](https://img.shields.io/npm/v/ultra-routing)
![license](https://img.shields.io/npm/l/ultra-routing)
![downloads](https://img.shields.io/npm/dt/ultra-routing)

> An amazing and simple route manager

Instalation
-----------
```
npm i ultra-routing
```

Table of contents
------------------
* [Usage](#usage)
* [Application Instance](#application-instance)
    * [\<method>](#methodpath-callbacks)
    * [use](#usemiddleware)
    * [listen](#listenport-callback)
* [Middlewares](#middlewares)
    * [bodyparser](#bodyparserparser)
* [Request](#request)
    * [body](#body)
    * [params](#params)
* [Response](#response)
    * [status](#statuscode)
    * [json](#jsondata)
    * [send](#senddata)
    * [sendFile](#sendfilepath)
* [Help](#help)
* [License](#license)

Usage
-------
```js
// Using Node.js `require()`
const ultraRouting = require('ultra-routing');

// Using ES6 imports
import ultraRouting from 'ultra-routing';

const app = new ultraRouting()
```

Application instance
--------

### \<method>(path, ...callbacks ...)
<style>
    tr { background-color: #161b22!important }
</style>
<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>method</td>
        <td>The method to be handled in the url. <br>To put one of the listed below:<br> <strong>get</strong>, <strong>post</strong>, <strong>delete</strong>, <strong>put</strong>, <strong>patch</strong>
        </td>
    </tr>
    <tr>
        <td>path</td>
        <td>
        A string representing the url to handle.<br>
        </td>
    </tr>
    <tr>
        <td>...callbacks</td>
        <td>
            A middleware function or a series of middleware functions separated by commas.<br> Must have a next() function in the middleware to pass control to the next middleware.
        </td>
    </tr>
    </tr>
</table>

```js
app.get('/', (req, res, next) => {
    // Do something
});

app.post('/', (req, res, next) => {
    // Do something
});
```

### use(middleware)

Uses a middleware function in all routes.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>middleware</td>
        <td>A function that executes some code, modifies the req or res object, ends the req-res cycle or calls the next middleware function with the next() function.<br>If the middleware function doesn't end the req-res cycleit must call next() to pass control to the next middleware function.</td>
    </tr>
</table>

```js
/* Creating own middleware */
const myOwnMiddleware = (req, res, next) => {
    console.log("Hello world!") 
    console.log(`I was called on ${req.url}`)
    next(); // Important to pass control to next middleware function
}

app.use(myOwnMiddleware)
```

### listen(port, callback)

Starts the server in the desired port.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>port</td>
        <td>A number representing the port to be used to alocate the webpage on.<br>http://localhost:port/</td>
    </tr>
    <tr>
        <td>callback</td>
        <td>What to do when the webpage is ready.</td>
    </tr>
</table>

```js
app.listen(3000, () => {
    // Do something
});
```

Middlewares
-----------

### bodyparser({...parser})

Parses the req data into object readable data.

<table>
    <tr style="background-color: #0d1117!important">        
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>...parsers</td>
        <td>Parsers can be the ones listed below seted to true or false: <br><strong>json</strong>, <strong>urlencoded</strong><br>Those are set by default to true if no ...parsers are specified and if only one parser is specified the default see example below.
        </td>
    </tr>
</table>

```js 
app.use(app.bodyparser()) // Will parse both application/json and www-x-form-urlencoded data
app.use(app.bodyparser({ json: true })) // Will only parse application-json data
app.use(app.bodyparser({ urlencoded: true })) // Will only parse www-x-form-urlencoded data
```

Request
--------

### body

Attribute of the Request class containing the `<input/>` values of the `<form/>` with key based in their `names` attribute.

```html
<form action="/login">
    <input type="text" name="username">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
```

```json
{
    username: "someusername",
    password: "somepassword"
}
```

```js
app.post('/login', (req, res) => {
    const { username, password } = req.body;
});
```

### params

Attribute of the Request class with the specified parameters in the path.

```js
// http://localhost:3000/users/12345
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(id) // Logs 123458
});
```

Response
---------

### status(code)

Sets the response status code.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>code</td>
        <td>A number or a literal string representing the status code to be sent.</td>
    </tr>
</table>

```js
app.get('/', (req, res) => {
    res.status(404) // Status Code: 404
    res.status("Not Found") // Status Code: 404
});
```

### json(data)

Sends an `application/json` content-type response.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>data</td>
        <td>The object that will be sent.</td>
    </tr>
</table>

```js
app.get('/', (req, res) => {
    res.json({
        username: "Álvaro",
        age: "16"
    }) // Will display a JSON object
});
```

### send(data)

Sends a `text/plain` content-type response.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>data</td>
        <td>Any type of data to be sent.</td>
    </tr>
</table>

```js
app.get('/', (req, res) => {
    res.send("An amazing webpage :)")
});

app.get('/', (req, res) => {
    res.send({ // As this is an object it will trigger res.json()
        data: "An amazing webpage :)" 
    })
});
```

### sendFile(path)

Sends a `text/html` content-type response.

<table>
    <tr style="background-color: #0d1117!important">
        <th>Argument</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>path</td>
        <td>The path inside views folder were the .html file is.<br>
        </td>
    </tr>
</table>

```js
app.get('/', (req, res) => {
    res.sendFile("index.html")
});
```

Help
------
Have any doubts or suggestions?<br>
Send me a private message on Discord: **Álvaro#9410**

License
--------

[MIT](https://github.com/newalvaro9/ultrajson-db/blob/main/LICENSE)

Copyright 2023, Álvaro Poblador.<br>
Inspired in express.js