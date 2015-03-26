var assert = require('chai').assert;
var validName = require('../lib/validName');


describe('package names', function(){

      it('should support simple names', function () {
          return assert.isTrue(validName('jquery'));
      });

      it('should not support names with unicode', function () {
          return assert.property(validName('ʎɹǝnbɾ'), 'error');
      });

      it('should allow dots', function () {
          return assert.isTrue(validName('jquery.is.the.coolest'));
      });

      it('should allow dashes', function () {
          return assert.isTrue(validName('jquery-is-the-coolest'));
      });

      it('should allow underscores', function () {
          return assert.isTrue(validName('jquery_is_the_coolest'));
      });

      it('should not allow consecutive dots', function () {
          return assert.property(validName('jquery..is..the..coolest'), 'error');
      });

      it('should not allow consecutive dashes', function () {
          return assert.property(validName('jquery--is--the--coolest'), 'error');
      });

      it('should not allow consecutive underscores', function () {
          return assert.property(validName('jquery__is__the__coolest'), 'error');
      });

      it('should not allow dots at the begining', function () {
          return assert.property(validName('.jquery'), 'error');
      });

      it('should not allow dots at the end', function () {
          return assert.property(validName('jquery.'), 'error');
      });

      it('should not allow dashes at the begining', function () {
          return assert.property(validName('-jquery'), 'error');
      });

      it('should not allow dashes at the end', function () {
          return assert.property(validName('jquery-'), 'error');
      });

      it('should not allow underscores at the begining', function () {
          return assert.property(validName('_jquery'), 'error');
      });

      it('should not allow underscores at the end', function () {
          return assert.property(validName('jquery_'), 'error');
      });

      // it('should not allow uppercase letters', function () {
      //     return assert.property(validName('jQuery'), 'error');
      // });

      it('should not allow names longer than 50 chars ', function () {
          return assert.property(validName('thisisastringthatsoverfiftycharacterslongforsomereason'), 'error');
      });

});
