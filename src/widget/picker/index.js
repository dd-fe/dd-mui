/**
 * @file: 日期选择组件
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');
        var DateUtil = require('../../common/date');

        /**
         * 主类
         * @param {HtmlElement} target 对象
         */

        function Picker (target, options) {
            Control.call(this, target, options);
        }

        Picker.prototype.type = 'picker'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        Picker.prototype.defaultOptions = {
            dataSource: {}
        };

        /**
         * 渲染内部结构, 当主元素没有html的时候，才会走到该函数
         */
        Picker.prototype.render = function () {

            var tpl = '<div class="'+ this.getSubClassName('slide-container')  +'">';
            for (var key in this.option.dataSource) {
                if (this.option.dataSource.hasOwnProperty(key)
                    && this.option.dataSource[key]
                    && this.option.dataSource[key].length) {
                    var current = key + 'Current';
                    this[current] = 3;

                    tpl += '<ul class="'+ this.getSubClassName('ul-container' + key) + '" type="' + key + '">'

                    for (var i = 0, len = this.option.dataSource[key].length; i < len; i++) {
                        var item = this.option.dataSource[key][i];
                        var className = '';
                        if (i == 3) {
                            className = 'cur';
                        }
                        tpl += '<li class="'+ className + '" index="' + i + '" type="' + key + '">' + item + '</li>'
                    }

                    tpl += '</ul>';
                }
            }
            tpl += '</div>' +
                '<h1 class="split-top"></h1><h1  class="split-bottom"></h1>';

            this.main.html(tpl);
        }

        /**
         * 事件
         */
        Picker.prototype.initEvents = function () {
            var me = this;
            this.bindEvent();
            this.main.on('touchmove', function (e) {
                e.preventDefault();
                e.returnValue = false;
            })
        }

        /**
         * 绑定滚动事件
         */
        Picker.prototype.bindEvent = function () {
            var me = this;

            var bind = function (keyNames) {
                var start = key + 'TouchYStart';
                var startBg = key + 'StartTouch';
                var range = key + 'Range';
                var current = key + 'Current';

                me.main.find('.' + me.getSubClassName('ul-container' + keyNames))
                    .on('touchstart', function (e) {

                        me[start] = e.touches[0].pageY;
                        me[startBg] = true;
                    });

                me.main.find('.' + me.getSubClassName('ul-container' + keyNames))
                    .on('touchmove', function (e) {

                        if (me[startBg]) {
                            var step = e.touches[0].pageY - me[start];
                            me[start] = e.touches[0].pageY;

                            var top = $(this).css('margin-top').replace('px', '');
                            var h = +$(this).height();

                            var marginOffset = me[range] = +top + step;

                            if (marginOffset < 0) {
                                me[range] = marginOffset = 0;
                            }
                            else if (marginOffset > 3 * 29) {
                                me[range] = marginOffset = 3 * 29;
                            }

                            var bei = me[range] / 29;
                            var absBei = Math.abs(bei);
                            if (bei < 0 ) {
                                bei = Math.ceil(absBei) * -1
                            }
                            else {
                                bei = Math.floor(absBei)
                            }

                            if (bei * -1 + 3 > me.option.dataSource[keyNames].length || bei * -1 + 3 < 0) {
                                return;
                            }

                            $(this).css({
                                'margin-top': marginOffset
                            });

                            if (Math.abs(bei * 29 - me[range]) < 18) {
                                me[current] = bei * -1 + 3;
                                $(this).find('li').removeClass('cur');
                                $(this).find('li[index="' + me[current] +'"]').addClass('cur');
                            }
                        }

                    }
                );

                me.main.find('.' + me.getSubClassName('ul-container' + keyNames)).on('touchend', function (e) {
                    var ele = $(this);
                    if (me[startBg] && me[range]) {
                        var bei = me[range]  / 29;
                        var absBei = Math.abs(bei);
                        if (bei < 0 ) {
                            bei = Math.ceil(absBei) * -1
                        }
                        else {
                            bei = Math.floor(absBei)
                        }

                        me[range]  = 0;
                        me[start] = false;
                        me[current] = bei * -1 + 3;

                        if (me[current] > me.option.dataSource[keyNames].length -1) {
                            me[current] = me.option.dataSource[keyNames].length -1;
                        }
                        else if (me[current] < 0) {
                            me[current] = 0
                        }

                        $(this).animate(
                            {
                                // 'margin-top': bei * 29
                                'margin-top': (3 - me[current]) * 29
                            },
                            500,
                            function () {
                                ele.find('li').removeClass('cur');
                                ele.find('li[index="' + me[current] +'"]').addClass('cur');
                            }
                        );
                    }
                });
            }

            for (var key in this.option.dataSource) {
                if (this.option.dataSource.hasOwnProperty(key)
                    && this.option.dataSource[key]
                    && this.option.dataSource[key].length) {

                    bind(key);

                }
            }
        }

        /**
         * 获取text
         * @return {string} 选中的描述的拼接
         */
        Picker.prototype.getSelectedText = function () {
            var text = '';
            var len = Object.keys(this.option.dataSource).length;
            var count = 0;

            for (var key in this.option.dataSource) {
                if (this.option.dataSource.hasOwnProperty(key)
                    && this.option.dataSource[key]
                    && this.option.dataSource[key].length) {
                    ++ count
                    var current = key + 'Current';
                    text += this.option.dataSource[key][this[current]];

                    len === count ? text += ' ' : text += '';
                }
            }

            return text;
        }

        /**
         * 获得选中项
         * @return {Object}
         */
        Picker.prototype.getSelectedItem = function () {
            var selected = {};
            var len = Object.keys(this.option.dataSource).length;

            for (var key in this.option.dataSource) {
                if (this.option.dataSource.hasOwnProperty(key)
                    && this.option.dataSource[key]
                    && this.option.dataSource[key].length) {
                    var current = key + 'Current';
                    selected[key] = {
                        item: this.option.dataSource[key][this[current]],
                        index: this[current]
                    };
                }
            }

            return selected;
        }

        /**
         * 设置选中项
         * @param {Object} selected
         */
        Picker.prototype.setSelected = function (selected) {
            for (var key in selected) {
                var current = key + 'Current';
                this[current] = selected[key];
                this.main.find('.' + this.getSubClassName('ul-container' + key))
                    .find('li').removeClass('cur');
                this.main.find('.' + this.getSubClassName('ul-container' + key))
                    .find('li[index="' + this[current] +'"]').addClass('cur');

                this.main.find('.' + this.getSubClassName('ul-container' + key)).css(
                    {
                        'margin-top': (3 - this[current]) * 29
                    }
                );
            }
        }

        return lib.inherits(Picker, Control);
    }
);

