require("dotenv").config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override')
const app = express();

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.MONGO_URI, mongoOptions)
.then(() => {
    app.listen(3000, () => {
        console.log("APP IS LISTENING ON PORT 3000!")
    });
})
.catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!")
    console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const { title } = req.query;
    if (title) {
        const notes = await Product.find( { title })
        res.render('notes/index', { notes, title })
    } else {
        const notes = await Product.find({})
        res.render('notes/index', { notes })
    }
});

app.get('/notes', async (req, res) => {
    const { title } = req.query;
    if (title) {
        const notes = await Product.find( { title })
        res.render('notes/index', { notes, title })
    } else {
        const notes = await Product.find({})
        res.render('notes/index', { notes })
    }
});

app.get('/notes/new', (req, res) => {
    res.render('notes/new');
});

app.post('/notes', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/notes/${newProduct._id}`)
});

app.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('notes/show', { product })
});

app.get('/notes/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('notes/edit', { product });
});

app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/notes/${product._id}`);
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/notes');
});