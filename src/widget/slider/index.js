/**
 * @file: 幻灯片
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');

        /**
         * slider 主类
         * @param {HtmlElement} target 对象
         */
        function Slider (target, option) {
            Control.call(this, target, option);
        }

        Slider.prototype.type = 'slider'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        Slider.prototype.defaultOptions = {
            'currentNumber': 1, // 初始时，展示第几张
            'speed': '50', // 滚动速度
            'autoSlide': true, // 是否自动滚动
            'autoSliderSpeed': 10000,
            'goto-type': 'point', // point 下部是点，littleimg 下部是小图,
            'goto-position': 'b', // b: bottom l: left r: right t: top
            'show-goto': false, // 是否展示跳转到第n张
            'show-step-btn': true, // 是否展示前进后退的button
            'pics': []
        };

        /**
         * 事件
         */
        Slider.prototype.initEvents = function () {
            var me = this;
            me.prev = this.main.find('.J-prev');
            me.next = this.main.find('.J-next');

            // 下一张
            this.main.on('click', '.J-next', function(e) {
                me.step(1);
            });

            // 上一张
            this.main.on('click', '.J-prev', function(e) {
                me.step(-1);
            });

            // 第n张 TODO
            /*this.main.on('click', '.J-goto', function(e) {
                var goto = $(e.target).attr('goto')
                me.step(goto);
            });*/

            $(document).on('resize', function () {
                me.afterRender();
            });

            if (me.option.autoSlide) {
                me.autoSlide();
            }

            this.bindTouch();
        };


        Slider.prototype.bindTouch = function () {
            var me = this;
            me.startBg = false;
            me.initX = null;

            me.main.on('touchstart',
                function (e) {
                    me.initX = e.targetTouches[0].pageX;
                    me.startBg = true;
                }
            );

            me.main.on('touchmove',
                function (e) {
                    if (me.startBg) {
                        var range = e.targetTouches[0].pageX
                            - me.initX;

                        if (range < 0) {
                            me.step(1);
                        }

                        if (range > 0) {
                            me.step(-1);
                        }
                    }
                }
            );

            me.main.on('touchend', function (e) {
                me.startBg = false;
                me.initX = null;
            });
        }

        Slider.prototype.afterRender = function () {
            var me = this;
            var w = this.main.width();
            me.option.picsLength = me.main.find('li').length;
            this.main.find('.list-container ul').width(w * me.option.picsLength);
            this.main.find('.list-container ul li').width(w);
        }

        /**
         * 前进、后退
         * @param {number} step
         */
        Slider.prototype.step = function (step) {
            this.goto(this.option.currentNumber + step);
        };

        /**
         * 跳转到第几张
         * @param {number} number
         */
        Slider.prototype.goto = function (number) {
            var me = this;
            var w = me.main.width();
            if (me.sliderTimer) {
                clearTimeout( me.sliderTimer);
                me.sliderTimer = null;
            }
            if (number >= 1 && number <= me.option.picsLength) {
                // 跳转到第n张
                me.sliderTimer = setTimeout(
                    function () {
                        me.main.find('.list-container ul').animate(
                            {
                                marginLeft: (number - 1) * w * -1
                            },
                            me.option.speed,
                            function () {
                                // 讲跳转到的底n张增加cur的样式
                                me.main.find('.goto-item').removeClass('cur');
                                me.main.find('.goto-item[step="'+ me.option.currentNumber +'"]')
                                    .addClass('cur');
                                me.option.currentNumber = number;
                                me.disablePrevNext(number);
                                // 向外部抛出goto的事件
                                me.main.trigger('step', {
                                    current: me.option.currentNumber,
                                    total: me.option.picsLength
                                });
                            }
                        );
                    }, 0);
            }
            else {
                me.disablePrevNext(number);
            }
        };

        /**
         * prev next 是否可用
         * @param {number} step
         */
        Slider.prototype.disablePrevNext = function (step) {
            var disablied = 'disabled';

            this.prev && this.prev.removeClass(disablied);
            this.next && this.next.removeClass(disablied);

            if (step <= 1) {
                this.prev && this.prev.addClass(disablied);
            }

            else if (step >= this.option.picsLength) {
                this.next && this.next.addClass(disablied);
            }
        };

        /**
         * 自动播放
         */
        Slider.prototype.autoSlide = function () {
            var me = this;
            setInterval(function () {
                var current = me.option.currentNumber;
                if (current + 1 > me.option.picsLength) {
                    current = 0;
                }
                me.goto(current + 1);

            }, me.option.autoSliderSpeed)
        }

        return lib.inherits(Slider, Control);
    }
);
