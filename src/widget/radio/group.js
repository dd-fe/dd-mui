/**
 * @file: RadioGroup
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');

        var STATE = {
            'DISABLED': 'disabled',
            'CHECKED': 'checked',
            'DEFAULT': 'default'
        }

        /**
         * RadioGroup 主类
         * @param {HtmlElement} target 对象
         */

        function RadioGroup (target, options) {
            Control.call(this, target, options);
        }

        RadioGroup.prototype.type = 'radiogroup'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        RadioGroup.prototype.defaultOptions = {
            state: 'default', // checked disabled
            labelText: '',
            value: ''
        };

        /**
         * 渲染内部结构, 当主元素没有html的时候，才会走到该函数
         */
        RadioGroup.prototype.render = function () {
            this.main.addClass(this.getSubClassName(this.option.state));
        }

        /**
         * 初始化RadioGroup 事件
         */
        RadioGroup.prototype.initEvents = function () {
            var me = this;
            this.main.on('click', function (e) {
                me.toggleStale();
            });
        }

        /**
         * toggle RadioGroup 状态
         */
        RadioGroup.prototype.toggleStale = function () {
            this.option.value = this.main[0].value;
            this.main[0].onchange(this.option.value);
        }

        return lib.inherits(RadioGroup, Control);
    }
);

