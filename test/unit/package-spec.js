var Package = require('../../lib/models/package');
var expect = require('expect.js');

Package.prototype.database = {}; // Mock!


describe('Package model', function () {

    it('accepts valid properties in the constructor', function () {
        var package = new Package({
            name: 'jquery',
            description: 'awesomez',
            type: 'amd',
            url: 'http://jquery.com',
            keywords: ['DOM', 'sizzle'],
            attachments: false
        });

        expect(package.name).to.be('jquery');
        expect(package.description).to.be('awesomez');
        expect(package.owners).to.be.an('array');
        expect(package.type).to.be('amd');
        expect(package.url).to.be('http://jquery.com');
        expect(package.versions).to.be.an('array');
        expect(package.keywords).to.be.an('array');
        expect(package.attachments).to.not.be(true);

    });

    describe('Prototype methods', function () {

        it('Package should have a \'documentType\' method', function () {
            expect(Package.prototype).to.have.property('documentType');
        });

        it('Package should have a \'database\' method', function () {
            expect(Package.prototype).to.have.property('database');
        });

        it('Package should have a \'update\' method', function () {
            expect(Package.prototype).to.have.property('update');
        });

        it('Package should have a \'addOwner\' method', function () {
            expect(Package.prototype).to.have.property('addOwner');
        });

        it('Package should have a \'ownedBy\' method', function () {
            expect(Package.prototype).to.have.property('ownedBy');
        });

    });

});

