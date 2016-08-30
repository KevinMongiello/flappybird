module.exports = {
  inherits (childClass, parentClass) {
    let Surrogate = function () {};
    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
  },
  clampNum (num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
};
