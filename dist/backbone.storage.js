(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("backbone"), require("backbone-metal")) : typeof define === "function" && define.amd ? define(["backbone", "backbone-metal"], factory) : global.Backbone.Storage = factory(global.Backbone, global.Metal);
})(this, function (Backbone, Metal) {
  "use strict";

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
    constructor: function constructor() {
      var _this = this;
      this.records = new this.collection();
      this.listenToOnce(this.records, "sync", function () {
        _this._hasSynced = true;
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
    find: function find(model) {
      var _this = this;
      var record = this.records.get(model);
      if (record) {
        return Promise.resolve(record);
      } else {
        model = this._ensureModel(model);
        return Promise.resolve(model.fetch()).then(function () {
          return _this.insert(model);
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
    findAll: function findAll() {
      var _this = this;
      if (this._hasSynced) {
        return Promise.resolve(this.records);
      } else {
        return Promise.resolve(this.records.fetch()).then(function () {
          return _this.records;
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
    save: function save(model) {
      var _this = this;
      var record = this.records.get(model);
      model = record || this._ensureModel(model);
      return Promise.resolve(model.save()).then(function () {
        if (!record) {
          _this.insert(model);
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
    insert: function insert(model) {
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
    _ensureModel: function _ensureModel(model) {
      if (model instanceof this.model) {
        return model;
      } else if (typeof model === "object") {
        return new this.model(model);
      } else {
        return new this.model({ id: model });
      }
    }
  });

  var backbone_storage = Storage;

  return backbone_storage;
});
//# sourceMappingURL=./backbone.storage.js.map