const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const crud = require('./crud');


app.use(morgan('tiny'));
app.use(cors());
app.use(bodyparser.json({
    limit: '50mb'
}))
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use('/crud', crud);
var port = process.env.PORT || 8000;
console.log(port);
app.listen(port, () => {
    console.log(`server running on port http://localhost:${port}`);
});

module.exports = app;