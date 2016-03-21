/**
 * @file lib
 * @author wangshiying@zufangit.cn
 */
define(
    function (require) {

        var lib = {};

        var counter = 0x861005;

        /**
         * 获取唯一id
         *
         * @param {string} [prefix="esui"] 前缀
         * @return {string}
         */
        lib.getGUID = function (prefix) {
            prefix = prefix || 'dd-mui';
            return prefix + counter++;
        };

        /**
         * 为类型构造器建立继承关系
         *
         * @param {Function} subClass 子类构造器
         * @param {Function} superClass 父类构造器
         * @return {Function} 返回`subClass`构造器
         */
        lib.inherits = function (subClass, superClass) {
            var Empty = function () {};
            Empty.prototype = superClass.prototype;
            var selfPrototype = subClass.prototype;
            var proto = subClass.prototype = new Empty();

            for (var key in selfPrototype) {
                proto[key] = selfPrototype[key];
            }
            subClass.prototype.constructor = subClass;
            subClass.superClass = superClass.prototype;

            return subClass;
        };

        return lib;
    }
);
