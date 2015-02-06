import Backbone from 'backbone';
import Metal from 'backbone-metal';

/**
 * A container for all the models of a particular type. Manages requests to your
 * server.
 *
 * @example
 * var BookStorage = Storage.extend({
 *   model: Book,
 *   collection: Books
 * });
 * var bookStorage = new BookStorage();
 *
 * bookStorage.find(1).then(function(model) {
 *   model.doSomething();
 * });
 *
 * bookStorage.findAll().then(function(collection) {
 *   collection.doSomething();
 * });
 *
 * var book = new Book({ title: 'Lord of the Flies' });
 *
 * bookStorage.save(book).then(function() {
 *   book.isNew(); // false
 * });
 *
 * @public
 * @class Storage
 */
var Storage = Backbone.Storage = Metal.Class.extend({

  /**
   * The model class to store.
   * @type {Backbone.Model}
   */
  model: Backbone.Model,

  /**
   * The collection class to store.
   * @type {Backbone.Collection}
   */
  collection: Backbone.Collection,

  /**
   * @public
   * @constructs Storage
   */
  constructor() {
    this.records = new this.collection();
    this.listenToOnce(this.records, 'sync', () => {
      this._hasSynced = true;
    });
    this._super.apply(this, arguments);
  },

  /**
   * Find a specific model from the store or fetch it from the server and insert
   * it into the store.
   *
   * @public
   * @instance
   * @method find
   * @memberOf Storage
   * @param {Number|String|Object|Backbone.Model} model - The model to find.
   * @returns {Promise} - A promise that will resolve to the model.
   */
  find(model) {
    let record = this.records.get(model);
    if (record) {
      return Promise.resolve(record);
    } else {
      model = this._ensureModel(model);
      return Promise.resolve(model.fetch()).then(() => {
        return this.insert(model);
      });
    }
  },

  /**
   * Find all the models in the store or fetch them from the server if they
   * haven't been fetched before.
   *
   * @public
   * @instance
   * @method findAll
   * @memberOf Storage
   * @returns {Promise} - A promise that will resolve to the entire collection.
   */
  findAll() {
    if (this._hasSynced) {
      return Promise.resolve(this.records);
    } else {
      return Promise.resolve(this.records.fetch()).then(() => {
        return this.records;
      });
    }
  },

  /**
   * Save a model to the server.
   *
   * @public
   * @instance
   * @method save
   * @memberOf Storage
   * @param {Number|String|Object|Backbone.Model} model - The model to save
   * @returns {Promise} - A promise that will resolve to the saved model.
   */
  save(model) {
    let record = this.records.get(model);
    model = record || this._ensureModel(model);
    return Promise.resolve(model.save()).then(() => {
      if (!record) {
        this.insert(model);
      }
      return model;
    });
  },

  /**
   * Insert a model into the store.
   *
   * @public
   * @instance
   * @method insert
   * @memberOf Storage
   * @params {Object|Backbone.Model} - The model to add.
   * @returns {Promise} - A promise that will resolve to the added model.
   */
  insert(model) {
    model = this.records.add(model);
    return Promise.resolve(model);
  },

  /**
   * Ensure that we have a real model from an id, object, or model.
   *
   * @private
   * @instance
   * @method _ensureModel
   * @memberOf Storage
   * @params {Number|String|Object|Backbone.Model} - An id, object, or model.
   * @returns {Backbone.Model} - The model.
   */
  _ensureModel(model) {
    if (model instanceof this.model) {
      return model;
    } else if (typeof model === 'object') {
      return new this.model(model);
    } else {
      return new this.model({ id: model });
    }
  }
});

export default Storage;
