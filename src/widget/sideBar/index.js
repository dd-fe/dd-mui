/**
 * @file: 侧栏
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');

        /**
         * checkbox 主类
         * @param {HtmlElement} target 对象
         */
        function SideBar (target, options) {
            Control.call(this, target, options);
        }

        SideBar.prototype.type = 'sidebar'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        SideBar.prototype.defaultOptions = {
            hasMask: '0', // 是否有引用遮罩
            autoClose: '0', // 点击其他地方，自动关闭
            transTime: 500,
            zIndex: 3,
            pushItem: '',
            mainPage: '',
            useWindowHeight: 0, // 是否和视窗一样高 0 不是 1 是
            animateStyle: '', // push 会有推动当前页的效果，必须添加pushItem，即要推动的元素是什么；all 遮住整屏幕；
            slideOrientation: 'left' // left right bottom top
        };

        /**
         * 事件
         */
        SideBar.prototype.initEvents = function () {
            var me = this;

            if (this.option.useWindowHeight == 1) {
                this.main.css({
                    'min-height': $(window).height() + 'px'
                });
            }

            if (this.option.animateStyle === 'all') {
                this.main.css({
                    'min-height': $(window).height() + 'px',
                    bottom: 'auto',
                    top: '0px!important'
                });
            }

            this.main.addClass(this.getSubClassName('from-'
                + this.option.slideOrientation));

            $(document).on('touchstart', '[open-sidebar="'+ this.main.attr('id') + '"]', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                me.open();
                return false;
            });

            $(document).on('touchstart', '[close-sidebar="'+ this.main.attr('id') + '"]', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                me.close();
                return false;
            });

            if (this.option.autoClose == 1
                && this.option.hasMask == 1) {
                $(document).on('touchstart', '.global-mask', function(e) {
                    var id = $('.global-mask').attr('for');
                    if (id === me.main.attr('id')) {
                        me.close();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    e.returnValue = false;
                    return false;
                });
            }

            this.main.on('open', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                me.open();
                return false;
            });

            this.main.on('close', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.returnValue = false;
                me.close();
                return false;
            });
        }

        /**
         * 添加阴影遮罩
         */
        SideBar.prototype.showMask = function () {
            var zIndex = +this.option.zIndex || 3;
            //$('body').append('<div class="global-mask" style="z-index: '+ zIndex +'"></div>');
            this.main.parent().append('<div class="global-mask" for="'
                + this.main.attr('id') + '" style="z-index: '+ zIndex +'"></div>');
        }

        /**
         * 取消阴影遮罩
         */
        SideBar.prototype.hideMask = function () {
            $('.global-mask').remove();
        }

        /**
         * 打开侧栏
         */
        SideBar.prototype.open = function () {
            var me = this;

            this.main.addClass(this.getSubClassName('active'));

            this.main.trigger('bgOpen');

            var size = this.main.width();
            var translateStr = size + 'px, 0, 0'; // 左

            if (this.option.slideOrientation === 'right') {
                translateStr = '-' + size + 'px, 0, 0'; // 右
            }
            else if (this.option.slideOrientation === 'bottom') {
                translateStr = '0, -' + size + 'px, 0'; // 下
            }
            else if (this.option.slideOrientation === 'top') {
                translateStr = '0, ' + size + 'px, 0'; // 上
            }

            if (this.option.hasMask == 1) {
                this.showMask();
            }

            if (this.option.animateStyle === 'push') {
                $('body ' + this.option.pushItem).animate(
                    {
                        'translate3d': translateStr
                    },
                    this.option.transTime,
                    'ease-in-out'
                );
            }

            this.initScrollTop = $(window).scrollTop();
            $(window).scrollTop(0);

            if (me.option.animateStyle === 'all') {
                me.option.mainPage && $(me.option.mainPage).css({
                    'display': 'none'
                });
            }

            this.main.animate(
                {
                    'translate3d': '0, 0, 0'
                },
                this.option.transTime,
                'ease-in-out',
                function () {

                    if (me.option.useWindowHeight == 1) {
                        $(me.option.mainPage).css({
                            'height': me.main.height() + 'px',
                            'overflow': 'hidden'
                        });
                    }

                    if (me.option.animateStyle === 'all') {
                        $(me.option.mainPage).css({
                            'height': me.main.height() + 'px',
                            'overflow': 'hidden',
                            'display': 'none'
                        });
                        $('body').css({
                            'height': me.main.height() + 'px'
                        });
                    }
                }
            );
        }

        /**
         * 关闭侧栏
         */
        SideBar.prototype.close = function () {
            var me = this;

            this.main.trigger('bgClose');

            var translateStr = '-100%, 0, 0'; // 左

            if (this.option.slideOrientation === 'right') {
                translateStr = '100%, 0, 0'; // 右
            }
            else if (this.option.slideOrientation === 'bottom') {
                translateStr = '0, 100%, 0'; // 下
            }
            else if (this.option.slideOrientation === 'top') {
                translateStr = '0, -100%, 0'; // 上
            }

            if (this.option.animateStyle === 'push') {
                $('body .current-page').animate(
                    {
                        'translate3d': '0, 0, 0'
                    },
                    this.option.transTime,
                    'ease-in-out',
                    function () {
                        me.main.removeClass(me.getSubClassName('active'));
                    }
                );
            }

            this.main.animate(
                {
                    'translate3d': translateStr
                },
                this.option.transTime,
                'ease-in-out',
                function () {
                    if (me.option.useWindowHeight == 1) {
                        $(me.option.mainPage).css({
                            'height': '100%',
                            'overflow': 'auto'
                        });
                    }

                    if (me.option.animateStyle === 'all') {
                        $(me.option.mainPage).css({
                            'height': '100%',
                            'overflow': 'auto',
                            'display': 'block'
                        });
                        $('body').css({
                            'height': 'auto'
                        });
                    }
                    $(window).scrollTop(me.initScrollTop);
                    me.main.removeClass(me.getSubClassName('active'));

                    if (me.option.hasMask == '1') {
                        me.hideMask();
                    }
                }
            );
        }

        return lib.inherits(SideBar, Control);
    }
);

