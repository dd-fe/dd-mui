/**
 * @file: radio
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
         * radio 主类
         * @param {HtmlElement} target 对象
         */

        function Radio (target, options) {
            Control.call(this, target, options);
            this.main[0].option = this.option;
        }

        Radio.prototype.type = 'radio'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        Radio.prototype.defaultOptions = {
            state: 'default', // checked disabled
            labelText: '',
            value: ''
        };

        /**
         * 渲染内部结构, 当主元素没有html的时候，才会走到该函数
         */
        Radio.prototype.render = function () {
            var className = this.option.state || STATE.DEFAULT;
            var tpl = '<span></span><label>'
                + this.option.labelText + ' </label>';

            this.main.addClass(this.getSubClassName(this.option.state));
            this.main.html(tpl);
        }

        /**
         * 初始化radio 事件
         */
        Radio.prototype.initEvents = function () {
            var me = this;
            this.main.on('click', function (e) {
                me.toggleStale();
            });
        }

        /**
         * toggle radio 状态
         */
        Radio.prototype.toggleStale = function () {
            var me = this;
            var parentNode = me.main[0].parentNode;
            if (me.option.state === STATE.DISABLED) {
                return;
            }
            if(parentNode && parentNode.className.indexOf('dd-mui-radiogroup') != -1){
                if (me.option.state === STATE.CHECKED) {
                    return;
                }
                else {
                    $(parentNode).find('.dd-mui-radio').each(function(index, element) {
                        if(element == me.main[0]){
                            me.main.addClass(me.getSubClassName(STATE.CHECKED));
                            me.option.state = STATE.CHECKED;
                            me.main.trigger('checked');

                            //给父元素赋值
                            parentNode.value = me.option.value;
                        }else if(element.option.state == STATE.CHECKED ){
                            $(element).removeClass(me.getSubClassName(STATE.CHECKED));
                            element.option.state = STATE.DEFAULT;
                            $(element).trigger('unchecked');
                        }
                    });
                }
            }else {
                if (me.option.state === STATE.CHECKED) {
                    me.main.removeClass(me.getSubClassName(STATE.CHECKED));
                    me.option.state = STATE.DEFAULT;
                    me.main.trigger('unchecked');
                }
                else {
                    me.main.addClass(me.getSubClassName(STATE.CHECKED));
                    me.option.state = STATE.CHECKED;
                    me.main.trigger('checked');
                }
            }
        }

        return lib.inherits(Radio, Control);
    }
);

