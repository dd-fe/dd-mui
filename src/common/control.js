/**
 * 主类
 */
define(
    function (require) {
        var lib = require('./lib');

        var proPrefix = 'ui-property-';

        /**
         * 控件基类
         *
         * @constructor
         * @param {HtmlElement} 初始化参数
         */
        function Control(target, options) {
            this.main = target ? $(target) : null;
            this.init(options);
            // return this.main;
        }

        Control.prototype = {

            /**
             * 初始化
             */
            init: function (options) {
                /*if (!this.main) {
                    return;
                }*/

                // 初始化参数
                this.processOptions(options);
                this.initStructure();
                this.initEvents();
            },

            getSubClassName: function (str) {
                return 'dd-mui-' + this.type + '-' + str;
            },

            /**
             * 初始化控件需要使用的选项
             *
             * @param {Object} [options] 构造函数传入的选项
             */
            processOptions: function (options) {
                // 拿到元素标签中的proprity
                var uiPorp = {};
                if (this.main) {
                    for (var key in this.defaultOptions) {
                        var prop = this.main.attr(proPrefix + key);
                        if (this.defaultOptions.hasOwnProperty(key) && prop) {
                            uiPorp[key] = prop;
                        }
                    }
                }

                this.option = $.extend(true, {}, this.defaultOptions, uiPorp, options);

                this.afterProcessOptions && this.afterProcessOptions();
            },

            /**
             * 初始化DOM结构，仅在第一次渲染时调用
             *
             * @protected
             * @abstract
             */
            initStructure: function () {

                this.main && this.main.trigger('beforeInitStructure');

                this.main && this.main.addClass('dd-mui-' + this.type);

                this.beforeRender && this.beforeRender();

                // 如果，没有存在html
                if (this.main && !$.trim(this.main.html())) {
                    this.render();
                }

                this.afterRender && this.afterRender();

                this.main && this.main.trigger('afterInitStructure');
            },

            /**
             * 初始化与DOM元素、子控件等的事件交互，仅在第一次渲染时调用
             *
             * @protected
             * @abstract
             */
            initEvents: function () {

            },

            render: function () {

            },

            dispose: function () {
                // todo
                this.main && this.main.trigger('dispose');
            }
        };

        return Control;
    }
);
