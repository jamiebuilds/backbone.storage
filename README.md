# Backbone Storage

A simple storage class for Backbone Models and Collections.

[![Travis build status](http://img.shields.io/travis/thejameskyle/backbone.storage.svg?style=flat)](https://travis-ci.org/thejameskyle/backbone.storage)
[![Code Climate](https://codeclimate.com/github/thejameskyle/backbone.storage/badges/gpa.svg)](https://codeclimate.com/github/thejameskyle/backbone.storage)
[![Test Coverage](https://codeclimate.com/github/thejameskyle/backbone.storage/badges/coverage.svg)](https://codeclimate.com/github/thejameskyle/backbone.storage)
[![Dependency Status](https://david-dm.org/thejameskyle/backbone.storage.svg)](https://david-dm.org/thejameskyle/backbone.storage)
[![devDependency Status](https://david-dm.org/thejameskyle/backbone.storage/dev-status.svg)](https://david-dm.org/thejameskyle/backbone.storage#info=devDependencies)

## Usage

> _**Note:** Backbone.storage requires a global `Promise` object to
> exist, please include a `Promise` polyfill if necessary._

In order to create a new Store extend the `Storage` class and set the model and
collection to the correct classes.

```js
import Storage from 'backbone.storage';
import Book from './model';
import Books from './collection';

var BookStore = Storage.extend({
  model: Book,
  collection: Books
});

var bookStore = new BookStore();
```

### `find`

In order to retrieve a model from the store simply call `find()` with an id,
an object with an id, or a model instance with an id. If the model does not
exist in the store, it will be fetched from the server via the model's `fetch()` method.

```js
bookStore.find(1).then(model => {
  model.get('name'); // >> A Tale of Two Cities
});
```

### `findAll`

To retrieve the entire collection from the store call `findAll()`. If the
collection has not previously been synced it will call the collection's
`fetch()` method.

```js
bookStore.findAll().then(collection => {
  collection.length; // >> 10
});
```

### `save`

When you want to save a model back to the server call the `save()` method with
the model you wish to save. If the model did not previously exist in the store
it will be inserted.

```js
var book = new Book({ name: 'Lolita' });
bookStore.save(book).then(model => {
  model.id; // >> 11
});
```

### `insert`

To insert a model into the store without any server interaction use the
`insert()` method.

```js
var book = new Book({ name: 'Invisible Man' });
bookStore.insert(book).then(model => {
  model.get('name'); // >> Invisible Man
});
```

## Contibuting

### Getting Started

[Fork](https://help.github.com/articles/fork-a-repo/) and
[clone](http://git-scm.com/docs/git-clone) this repo.

```
git clone git@github.com:thejameskyle/backbone.storage.git && cd backbone.storage
```

Make sure [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/) are
[installed](http://nodejs.org/download/).

```
npm install
```

### Running Tests

```
npm test
```

===

© 2014 James Kyle. Distributed under ISC license.
