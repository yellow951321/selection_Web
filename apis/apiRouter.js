const express = require('express')
const test1 = require('./test')
const router = express.Router({
    // case sensitive for route path
    caseSensitive: true,
    // parent path req.parmas take precedence over child path
    mergeParams: false,
    // fool proof route path
    strict: false,
})

router.get('/test', (req, res) => {
    console.log(1)
    console.log(test1())
    res.send()
})

module.exports = router