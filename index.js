const express = require('express')
const app = express()
const port = 3000

app.post('/user/signup', (req, res) => { })
app.post('/user/login', (req, res) => { })
app.get('/user/purchases', (req, res) => { })
app.post('/course/purchase', (req, res) => { })
app.get('/courses', (req, res) => { })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})