var packages = require('../lib/routes/packages');
var Sinon = require('sinon');
var SinonChai = require('sinon-chai');
var Chai = require('chai');

Chai.should();
Chai.use(SinonChai);

describe('packages', function() {
    beforeEach(function() {
        this.sinon = Sinon.sandbox.create();
        this.sendStub = this.sinon.stub();
        this.statusStub = this.sinon.stub().returns({send: this.sendStub});
    });

    describe('removing', function() {
        beforeEach(function() {
            this.response = {
                status: this.statusStub,
                send: this.sendStub
            }
        });

        it("fails when no token", function(){
            var request = {
                query: {
                },
                params: {
                    name: "test"
                }
            };

            packages.remove(request, this.response);
            this.statusStub.should.have.been.calledWith(403);
            this.sendStub.should.have.been.calledWith("Must be a collaborator on GitHub.com repository");
        });
    });
});
