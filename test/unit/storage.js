describe('Storage', function() {
  describe('#find', function() {
    beforeEach(function() {
      this.storage = new Backbone.Storage();
      this.model1 = new Backbone.Model({ id: 1 });
      this.model2 = new Backbone.Model({ id: 2 });

      stub(Backbone.Model.prototype, 'fetch').returns(this.model2);

      return this.storage.insert(this.model1);
    });

    it('should not fetch twice', function() {
      var self = this;
      return this.storage.find(2).then(function() {
        return self.storage.find(2);
      }).then(function(model) {
        expect(model).to.be.instanceOf(Backbone.Model);
        expect(model.id).to.equal(2);
        expect(Backbone.Model.prototype.fetch).to.have.been.calledOnce;
      });
    });

    describe('by id', function() {
      it('should return the record if it exists', function() {
        var self = this;
        return this.storage.find(1).then(function(model) {
          expect(model).to.equal(self.model1);
          expect(Backbone.Model.prototype.fetch).not.to.have.been.called;
        });
      });

      it('should fetch the model if no record exists', function() {
        return this.storage.find(2).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(2);
          expect(Backbone.Model.prototype.fetch).to.have.been.calledOnce;
        });
      });
    });

    describe('by object', function() {
      it('should return the record if it exists', function() {
        var self = this;
        return this.storage.find({ id: 1 }).then(function(model) {
          expect(model).to.equal(self.model1);
          expect(Backbone.Model.prototype.fetch).not.to.have.been.called;
        });
      });

      it('should fetch the model if no record exists', function() {
        return this.storage.find({ id: 2 }).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(2);
          expect(Backbone.Model.prototype.fetch).to.have.been.called;
        });
      });
    });

    describe('by model', function() {
      it('should return the record if it exists', function() {
        var self = this;
        return this.storage.find(this.model1).then(function(model) {
          expect(model).to.equal(self.model1);
          expect(Backbone.Model.prototype.fetch).not.to.have.been.called;
        });
      });

      it('should fetch the model if no record exists', function() {
        var self = this;
        return this.storage.find(this.model2).then(function(model) {
          expect(model).to.equal(self.model2);
          expect(Backbone.Model.prototype.fetch).to.have.been.called;
        });
      });
    });
  });

  describe('#findAll', function() {
    beforeEach(function() {
      var self = this;
      this.storage = new Backbone.Storage();
      this.model1 = new Backbone.Model({ id: 1 });
      this.model2 = new Backbone.Model({ id: 2 });

      this.insertModels = function() {
        return Promise.all([
          self.storage.insert(self.model1),
          self.storage.insert(self.model2)
        ]);
      };

      stub(Backbone.Collection.prototype, 'fetch', this.insertModels);
    });

    it('should return the collection if it has been fetched', function() {
      var self = this;
      this.storage.records.trigger('sync');
      return this.insertModels().then(function() {
        return self.storage.findAll();
      }).then(function(collection) {
        expect(collection.length).to.equal(2);
        expect(collection).to.equal(self.storage.records);
        expect(Backbone.Collection.prototype.fetch).not.to.have.been.called;
      });
    });

    it('should fetch the collection if it has not been fetched', function() {
      var self = this;
      return this.storage.findAll().then(function(collection) {
        expect(collection.length).to.equal(2);
        expect(collection).to.equal(self.storage.records);
        expect(Backbone.Collection.prototype.fetch).to.have.been.called;
      });
    });
  });

  describe('#save', function() {
    beforeEach(function() {
      this.storage = new Backbone.Storage();
      this.model1 = new Backbone.Model({ id: 1 });
      this.model2 = new Backbone.Model({ id: 2 });

      stub(Backbone.Model.prototype, 'save');

      return this.storage.insert(this.model1);
    });

    it('should insert a non-existing model', function() {
      var self = this;
      return this.storage.save(this.model2).then(function(model) {
        expect(self.storage.records.get(2)).to.equal(model);
      });
    });

    describe('by id', function() {
      it('should save an existing model', function() {
        return this.storage.save(1).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(1);
          expect(Backbone.Model.prototype.save).to.have.been.called;
        });
      });

      it('should save a non-existing model', function() {
        var self = this;
        return this.storage.save(2).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(2);
          expect(Backbone.Model.prototype.save).to.have.been.called;
          expect(self.storage.records.get(2)).to.equal(model);
        });
      });
    });

    describe('by object', function() {
      it('should save an existing model', function() {
        return this.storage.save({ id: 1 }).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(1);
          expect(Backbone.Model.prototype.save).to.have.been.called;
        });
      });

      it('should save a non-existing model', function() {
        var self = this;
        return this.storage.save({ id: 2 }).then(function(model) {
          expect(model).to.be.instanceOf(Backbone.Model);
          expect(model.id).to.equal(2);
          expect(Backbone.Model.prototype.save).to.have.been.called;
          expect(self.storage.records.get(2)).to.equal(model);
        });
      });
    });

    describe('by model', function() {
      it('should save an existing model', function() {
        var self = this;
        return this.storage.save(this.model1).then(function(model) {
          expect(model).to.equal(self.model1);
          expect(Backbone.Model.prototype.save).to.have.been.called;
        });
      });

      it('should save a non-existing model', function() {
        var self = this;
        return this.storage.save(this.model2).then(function(model) {
          expect(model).to.equal(self.model2);
          expect(Backbone.Model.prototype.save).to.have.been.called;
          expect(self.storage.records.get(2)).to.equal(model);
        });
      });
    });
  });

  describe('#insert', function() {
    beforeEach(function() {
      this.storage = new Backbone.Storage();
    });

    describe('by object', function() {
      it('should create a new model and insert it', function() {
        var self = this;
        return this.storage.insert({ id: 1 }).then(function(model) {
          expect(model.id).to.equal(1);
          expect(self.storage.records.get(1)).to.equal(model);
        });
      });
    });

    describe('by model', function() {
      it('should insert the model', function() {
        var self = this;
        var model1 = new Backbone.Model({ id: 1 });
        return this.storage.insert(model1).then(function(model) {
          expect(model).to.equal(model1);
          expect(self.storage.records.get(1)).to.equal(model1);
        });
      });
    });
  });
});
