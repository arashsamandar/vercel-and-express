const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(3000, () => console.log('application ready to use'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

