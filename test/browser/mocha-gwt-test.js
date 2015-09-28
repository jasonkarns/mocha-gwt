describe('mocha-gwt', function() {
  var append, beforeAllCheck, resultIs;
  append = (function(_this) {
    return function(char) {
      return function() {
        return this.result += char;
      };
    };
  })(this);
  resultIs = (function(_this) {
    return function(expected) {
      return function() {
        return this.result === expected;
      };
    };
  })(this);
  beforeAllCheck = 1;
  beforeAll(function() {
    window.cleanMeUp = 'dirty';
    if (beforeAllCheck++ > 1) {
      throw new Error('Before all was called more than once');
    }
  });
  afterAll(function() {
    return window.cleanMeUp = void 0;
  });
  Given(function() {
    return this.result = '';
  });
  Given(append('a'));
  When(append('b'));
  Then(resultIs('ab'));
  Invariant(function() {
    return beforeAllCheck === 2;
  });
  describe('nested given', function() {
    Given(append('1'));
    Then(resultIs('a1b'));
    describe('- no givens or thens added', function() {
      return Then(resultIs('a1b'));
    });
    describe('just when', function() {
      When(append('c'));
      return Then(resultIs('a1bc'));
    });
    return describe('sibling when', function() {
      When(append('c'));
      return Then(resultIs('a1bc'));
    });
  });
  describe('outer after inner', function() {
    return Then(resultIs('ab'));
  });
  describe('a then that changes the result', function() {
    Then(function() {
      return this.result = 42;
    });
    return describe('does not affect nested givens/whens', function() {
      Given(append('z'));
      When(append('x'));
      return Then(resultIs('azbx'));
    });
  });
  Then(resultIs('ab'));
  describe('async support', function() {
    Given(function(done) {
      return setTimeout((function(_this) {
        return function() {
          _this.result += '1';
          return done();
        };
      })(this), 1);
    });
    When(function(done) {
      return setTimeout((function(_this) {
        return function() {
          _this.result += '2';
          return done();
        };
      })(this), 1);
    });
    return Then(function() {
      return this.result === 'a1b2';
    });
  });
  describe('promise support', function() {
    Given(function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.result += '1';
        };
      })(this));
    });
    When(function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.result += '2';
        };
      })(this));
    });
    return Then(function() {
      return this.result === 'a1b2';
    });
  });
  xdescribe('ignored should not be called', function() {
    Given(function() {
      throw new Error('should not reach this given');
    });
    When(function() {
      throw new Error('should not reach this when');
    });
    Then(function() {
      throw new Error('should not reach this then');
    });
    And(function() {
      throw new Error('should not reach this and');
    });
    return describe('and neither their children', function() {
      Given(function() {
        throw new Error('should not reach child given');
      });
      When(function() {
        throw new Error('should not reach child when');
      });
      Then(function() {
        throw new Error('should not reach child then');
      });
      return And(function() {
        throw new Error('should not reach child and');
      });
    });
  });
  describe('after is called after its block', function() {
    var foo, thisFoo;
    foo = void 0;
    thisFoo = void 0;
    Given(function() {
      if (foo == null) {
        return foo = 1;
      }
    });
    Given(function() {
      return this.localFoo = 'foo';
    });
    Then(function() {
      return foo === 1;
    });
    afterBlock(function() {
      return foo = 2;
    });
    afterBlock(function() {
      return this.localFoo === 'foo';
    });
    return describe('after should have been called', function() {
      return Then(function() {
        return foo === 2;
      });
    });
  });
  return describe('aliases', function() {
    Then(function() {
      return window.context === describe;
    });
    Then(function() {
      return window.context.skip === describe.skip;
    });
    And(function() {
      return window.xcontext === describe.skip;
    });
    Then(function() {
      return window.context.only === describe.only;
    });
  });
});
