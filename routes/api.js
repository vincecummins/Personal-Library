'use strict';
const mongoose = require('mongoose')
const { Book } = require('../models/models')

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      let xx = await Book.find({}).select('-comments')
      return res.json(xx)
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      if (req.body.comment || req.body.comment == '') {
        return res.send('no book exists')
      }
      let title = req.body.title;
      if (title == '') {
        return res.send('missing required field title')
      }
      Book.findOne({ 'title': title }, (err, doc) => {
        if (!doc) {
          let newBook = new Book({ 'title': title });
          newBook.save()
          return res.json({ _id: newBook._id, title: newBook.title })
        } res.json('book is already in library')
      })
    })

    .delete(function (req, res) {
      Book.deleteMany({}, (err) => {
        if (!err) {
          console.log('deleted all')
          return res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findOne({ _id: bookid }, (err, doc) => {
        if (err) return res.send('no book exists');
        res.json({ "_id": bookid, "title": doc.title, "comments": doc.comments })
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      let update = { $push: { comments: comment } };
      if (comment == '') {
        return res.send('missing required field comment')
      }
      Book.findOneAndUpdate({ _id: bookid }, update, { new: true }, (err, book) => {
        if (!err) {
          book.commentcount = book.comments.length
          book.save()
          return res.json({ "_id": bookid, "title": book.title, "comments": book.comments })
        }
        res.send('no book exists')
      })
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.deleteOne({_id: bookid}, (err) => {
        if (err) {return res.send('no book exists')};
        res.send('delete successful')

      })
    });

};
