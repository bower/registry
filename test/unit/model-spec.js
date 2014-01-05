var Model = require('../../lib/models/model');
var expect = require('expect.js');

describe('Model model', function () {

    it('accepts valid properties in the constructor', function () {
        var model = new Model();

        expect(model.fields).to.not.be(true);
        expect(model._id).to.not.be(true);
        expect(model._rev).to.not.be(true);
        expect(model.created).to.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
        expect(model.modified).to.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
    });

    describe('Prototype methods', function () {

        it('Model should have a \'toCouch\' method', function () {
            expect(Model.prototype).to.have.property('toCouch');
        });

        it('Model should have a \'toClient\' method', function () {
            expect(Model.prototype).to.have.property('toClient');
        });

        it('Model should have a \'getId\' method', function () {
            expect(Model.prototype).to.have.property('getId');
        });

        it('Model should have a \'save\' method', function () {
            expect(Model.prototype).to.have.property('save');
        });

        it('Model should have a \'destroy\' method', function () {
            expect(Model.prototype).to.have.property('destroy');
        });

    });

});

