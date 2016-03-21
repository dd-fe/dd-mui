/**
 * @file: 侧栏
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');

        /**
         * 滚动刷新 主类
         * @param {HtmlElement} target ui绑定的元素
         * @param {Object} options 配置项
         *
         * 使用：
         *
         * <div ui-type="scrollfresh" id="test" >
         *     <div class="scroll-container"></div> 一定要加上这个容器
         * </div>
         */
        function ScrollFresh (target, options) {
            Control.call(this, target, options);
        }

        ScrollFresh.prototype.type = 'scrollfresh'; // 组件类型

        // 组件默认的option 一般是肯定存在的
        ScrollFresh.prototype.defaultOptions = {
            distance: 50 // 距离底部多远，触发fresh  默认50
        };

        /**
         * 事件
         */
        ScrollFresh.prototype.initEvents = function () {
            var me = this;
            me.main.append('<div class="'
                + this.getSubClassName('loading') +'"></div>');

            me.main.on('scroll', function(e) {
                me.scroll();
            });

            me.main.on('unfresh', function (e) {
                me.unfresh();
            });
        }

        /**
         * 滑动
         */
        ScrollFresh.prototype.scroll = function () {
            var scrollTop = this.main.scrollTop();
            var scrollHeight = this.main.find('.scroll-container').height();
            var height = this.main.height();
            if (scrollTop + height >= scrollHeight - this.option.distance && !this.isFreshing) {
                this.isFreshing = true;
                this.main.find('.' + this.getSubClassName('loading')).css('display', 'block');
                this.main.trigger('fresh');
            }
        }

        /**
         * 停止刷新
         */
        ScrollFresh.prototype.unfresh = function () {
            this.isFreshing = false;
            this.main.find('.' + this.getSubClassName('loading')).css('display', 'none');
        }

        return lib.inherits(ScrollFresh, Control);
    }
);

