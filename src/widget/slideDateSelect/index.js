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

        function SideDateSelect (target, options) {
            Control.call(this, target, options);
        }

        SideDateSelect.prototype.type = 'sidedateselect'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        SideDateSelect.prototype.defaultOptions = {
            range: {
                bg: -31,
                end: 0
            }
        };

        /**
         * 渲染内部结构, 当主元素没有html的时候，才会走到该函数
         */
        SideDateSelect.prototype.render = function () {
            this.rangeArr = DateUtil.getRange(this.option.range, 'mm月dd日 week');

            var tpl = '<div class="'+ this.getSubClassName('slide-container')  +'"><ul class="'+ this.getSubClassName('date-container') +'">';
            for (var i = 0, len = this.rangeArr.length; i < len; i++) {
                var item = this.rangeArr[i].desc.split(' ');
                var className = 'clearfix';
                if (i === 3) {
                    className = 'clearfix cur';
                }
                tpl += '<li class="'+ className +'" index="' + i + '"><div class="date">' + item[0] + '</div><div class="week">' + item[1] + '</div></li>'
            }
            tpl += '</ul>';
            tpl += '<ul class="'+ this.getSubClassName('day-container') +'">' +
                '<li index="0">全天</li><li index="1">上午</li><li index="2">下午</li><li index="3" class="cur">晚上</li></ul></div>' +
                '<h1 class="split-top"></h1><h1  class="split-bottom"></h1>';

            this.current = 3;
            this.dayCurrent = 3;

            this.main.html(tpl);
        }

        /**
         * 事件
         */
        SideDateSelect.prototype.initEvents = function () {
            var me = this;
            this.main.find('.' + me.getSubClassName('date-container')).on('touchstart', function (e) {
                me.touchYStart = e.touches[0].pageY;
                me.startTouch = true;
            });

            this.main.find('.' + me.getSubClassName('date-container')).on('touchmove', function (e) {
                if (me.startTouch) {
                    var step = e.touches[0].pageY - me.touchYStart;
                    me.touchYStart = e.touches[0].pageY;

                    var top = me.main.find('.' + me.getSubClassName('date-container')).css('margin-top').replace('px', '');
                    var h = +me.main.find('.' + me.getSubClassName('date-container')).height();

                    var marginOffset = me.range = +top + step;
                    if (marginOffset < -1 * 29 * (me.rangeArr.length - 4)) {
                        me.range = marginOffset = -1 * 29 * (me.rangeArr.length - 4)
                    }
                    else if (marginOffset > 3 * 29) {
                        me.range = marginOffset = 3 * 29;
                    }
                    me.main.find('.' + me.getSubClassName('date-container')).css({
                        'margin-top': marginOffset
                    });

                    if (me.range%29 < 14) {

                    }

                    var bei = me.range / 29;
                    var absBei = Math.abs(bei);
                    if (bei < 0 ) {
                        bei = Math.ceil(absBei) * -1
                    }
                    else {
                        bei = Math.floor(absBei)
                    }

                    if (Math.abs(bei * 29 - me.range) < 18) {
                        me.current = bei * -1 + 3;
                        me.main.find('.' + me.getSubClassName('date-container') + ' li').removeClass('cur');
                        me.main.find('.' + me.getSubClassName('date-container') + ' li[index="' + me.current +'"]').addClass('cur');
                    }
                }
            });

            this.main.find('.' + me.getSubClassName('date-container')).on('touchend', function (e) {
                if (me.startTouch && me.range) {
                    var bei = me.range / 29;
                    var absBei = Math.abs(bei);
                    if (bei < 0 ) {
                        bei = Math.ceil(absBei) * -1
                    }
                    else {
                        bei = Math.floor(absBei)
                    }

                    me.range = 0;
                    me.startTouch = false;
                    me.moveEnd = false;

                    me.main.find('.' + me.getSubClassName('date-container')).animate(
                        {
                            'margin-top': bei * 29
                        },
                        500,
                        function () {
                            me.current = bei * -1 + 3;
                            me.main.find('.' + me.getSubClassName('date-container') + ' li').removeClass('cur');
                            me.main.find('.' + me.getSubClassName('date-container') + ' li[index="' + me.current +'"]').addClass('cur');
                        }
                    );
                }
            });

            this.bindDayEvent();

            this.main.on('touchmove', function (e) {
                e.preventDefault();
                e.returnValue = false;
            })
        }

        /**
         * 获取选中时间描述
         */
        SideDateSelect.prototype.getSelectedText =  function () {
            var days = ['全天', '上午', '下午', '晚上']
            return this.rangeArr[this.current].desc + '  ' + days[this.dayCurrent];
        }

        /**
         * 获得选中项目
         * @return {Object}
         */
        SideDateSelect.prototype.getSelectedItem =  function () {
            return {
                time: DateUtil.getDate(this.rangeArr[this.current].time, 'yy-mm-dd').desc,
                timeIndex: this.current,
                stage: this.dayCurrent == 0 ? 4 : this.dayCurrent,
                stageIndex: this.dayCurrent
            };
        }

        /**
         * 设置选中项
         * @param {Object} selected
         */
        SideDateSelect.prototype.setSelected = function (timeIndex, stageIndex) {
            this.current = timeIndex;
            this.dayCurrent = stageIndex;

            this.main.find('li').removeClass('cur');

            this.main
                .find('.' + this.getSubClassName('date-container') + ' li[index="' + this.current +'"]')
                .addClass('cur');

            this.main.find('.' + this.getSubClassName('date-container')).css(
                {
                    'margin-top': (3 - this.current) * 29
                }
            );

            this.main
                .find('.' + this.getSubClassName('day-container')+ ' li[index="' + this.dayCurrent +'"]')
                .addClass('cur');

            this.main.find('.' + this.getSubClassName('day-container')).css(
                {
                    'margin-top': (3 - this.dayCurrent) * 29
                }
            );

        }

        /**
         * 绑定白天、晚上这块的滑动——写的太烂……重构
         */
        SideDateSelect.prototype.bindDayEvent = function () {
            var me = this;
            this.main.find('.' + me.getSubClassName('day-container')).on('touchstart', function (e) {
                me.dayTouchYStart = e.touches[0].pageY;
                me.dayStartTouch = true;
            });

            this.main.find('.' + me.getSubClassName('day-container')).on('touchmove', function (e) {
                if (me.dayStartTouch) {
                    var step = e.touches[0].pageY - me.dayTouchYStart;
                    me.dayTouchYStart = e.touches[0].pageY;

                    var top = me.main.find('.' + me.getSubClassName('day-container')).css('margin-top').replace('px', '');
                    var h = +me.main.find('.' + me.getSubClassName('day-container')).height();

                    var marginOffset = me.dayRange = +top + step;
                    if (marginOffset < 0) {
                        me.dayRange = marginOffset = 0
                    }
                    else if (marginOffset > 3 * 29) {
                        me.dayRange = marginOffset = 3 * 29;
                    }
                    me.main.find('.' + me.getSubClassName('day-container')).css({
                        'margin-top': marginOffset
                    });

                    var bei = me.dayRange / 29;
                    var absBei = Math.abs(bei);
                    if (bei < 0 ) {
                        bei = Math.ceil(absBei) * -1
                    }
                    else {
                        bei = Math.floor(absBei)
                    }

                    if (Math.abs(bei * 29 - me.dayRange) < 18) {
                        me.dayCurrent = bei * -1 + 3;
                        me.main.find('.' + me.getSubClassName('day-container') + ' li').removeClass('cur');
                        me.main.find('.' + me.getSubClassName('day-container') + ' li[index="' + me.dayCurrent +'"]').addClass('cur');
                    }
                }
            });

            this.main.find('.' + me.getSubClassName('day-container')).on('touchend', function (e) {
                if (me.dayStartTouch && me.dayRange) {
                    var bei = me.dayRange / 29;
                    var absBei = Math.abs(bei);
                    if (bei < 0 ) {
                        bei = Math.ceil(absBei) * -1
                    }
                    else {
                        bei = Math.floor(absBei)
                    }

                    me.dayRange = 0;
                    me.dayStartTouch = false;

                    me.main.find('.' + me.getSubClassName('day-container')).animate(
                        {
                            'margin-top': bei * 29
                        },
                        500,
                        function () {
                            me.dayCurrent = bei * -1 + 3;
                            me.main.find('.' + me.getSubClassName('day-container') + ' li').removeClass('cur');
                            me.main.find('.' + me.getSubClassName('day-container') + ' li[index="' + me.dayCurrent +'"]').addClass('cur');
                        }
                    );
                }
            });
        }


        return lib.inherits(SideDateSelect, Control);
    }
);

