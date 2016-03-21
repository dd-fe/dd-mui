/**
 * @file: 左右切换的button
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
         * checkbox 主类
         * @param {HtmlElement} target 对象
         */

        function SwitchButton (target, options) {
            Control.call(this, target, options);
        }

        SwitchButton.prototype.type = 'switchbutton'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        SwitchButton.prototype.defaultOptions = {
            switchitems: [
                {
                    text: '左',
                    value: 0
                },
                {
                    text: '右',
                    value: 1
                }
            ],
            currentNumber: 0
        };

        /**
         * 渲染内部结构, 当主元素没有html的时候，才会走到该函数
         */
        SwitchButton.prototype.render = function () {
            var text = this.option.switchitems[this.option.currentNumber].text;
            var className = this.getSubClassName('block');
            var tpl = '<span>' + text + '</span><div class="' + className + '"></div>';
            this.main.addClass(this.getSubClassName(this.option.currentNumber));
            this.main.html(tpl);
        }

        /**
         * 初始化checkbox 事件
         */
        SwitchButton.prototype.initEvents = function () {
            var me = this;
            /*this.main.on('click', function (e) {
                me.toggleStale();
            });*/

            this.main.on('touchstart', function (e) {
                me.touchStart = e.touches[0].pageX;
                me.StartTouch = true;
            });

            this.main.on('touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                return false;
            });

            this.main.on('touchmove', function (e) {
                if (me.touchStart - e.touches[0].pageX > 0 ) {
                    me.main.find('.' + me.getSubClassName('block')).animate(
                        {
                            'right': '100%',
                            'margin-right': '-28px'
                        },
                        100,
                        function () {
                            me.StartTouch = true;
                            me.main.removeClass(me.getSubClassName(0));
                            me.main.addClass(me.getSubClassName(1));
                            me.main.find('span').html(me.option.switchitems[1].text)
                            me.option.currentNumber = 1;

                            me.main.currentItem =
                                me.option.switchitems[me.option.currentNumber];

                            me.main.trigger('switch', {
                                switchitems: me.option.switchitems,
                                currentNumber: me.option.currentNumber,
                                currentItem: me.option.switchitems[me.option.currentNumber]
                            });
                        }
                    );
                }
                else if (me.touchStart - e.touches[0].pageX < 0) {

                    me.main.find('.' + me.getSubClassName('block')).animate(
                        {
                            'right': '0%',
                            'margin-right': '2px'
                        },
                        100,
                        function () {
                            me.StartTouch = true;
                            me.main.removeClass(me.getSubClassName(1));
                            me.main.addClass(me.getSubClassName(0));
                            me.main.find('span').html(me.option.switchitems[0].text)
                            me.option.currentNumber = 0;

                            me.main.currentItem =
                                me.option.switchitems[me.option.currentNumber];

                            me.main.trigger('switch', {
                                switchitems: me.option.switchitems,
                                currentNumber: me.option.currentNumber,
                                currentItem: me.option.switchitems[me.option.currentNumber]
                            });
                        }
                    );
                }

                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                return false;
            });
        }

        /**
         * 初始化option后，特殊的处理
         */
        SwitchButton.prototype.afterProcessOptions = function () {
            // TODO : 不太好
            this.option.switchitems = eval(this.option.switchitems);
        }

        /**
         * toggle checkbox 状态
         */
        SwitchButton.prototype.toggleStale = function () {
            var me = this;
            if (me.option.currentNumber === 0) {
                this.main.removeClass(this.getSubClassName(0));
                this.main.addClass(this.getSubClassName(1));
                this.main.find('span').html(this.option.switchitems[1].text)
                me.option.currentNumber = 1;
            }
            else {
                this.main.removeClass(this.getSubClassName(1));
                this.main.addClass(this.getSubClassName(0));
                this.main.find('span').html(this.option.switchitems[0].text)
                me.option.currentNumber = 0;
            }

            // 方便外界获取当前current的item
            me.main.currentItem =
                this.option.switchitems[this.option.currentNumber];

            me.main.trigger('switch', {
                switchitems: this.option.switchitems,
                currentNumber: this.option.currentNumber,
                currentItem: this.option.switchitems[this.option.currentNumber]
            });
        }

        /**
         * dispose 注销组件
         */
        SwitchButton.prototype.getSelectedItem = function () {
            return this.main.currentItem;
        }

        /**
         * dispose 注销组件
         */
        SwitchButton.prototype.dispose = function () {
            this.main.currentItem = null;
            this.main.html('');
            this.main.off('click');
        }

        return lib.inherits(SwitchButton, Control);
    }
);

