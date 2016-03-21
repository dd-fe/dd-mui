/**
 * @file: TimerMsg
 */

define(
    function (require) {

        var lib = require('../../common/lib');
        var Control = require('../../common/control');

        /**
         * TimerMsg 主类
         * @param {HtmlElement} target 对象
         */

        function TimerMsg (target, options) {
            Control.call(this, target, options);
        }

        TimerMsg.prototype.type = 'timermsg'; // 组件类型

        TimerMsg.prototype.show = function (msg, timer) {
            $('body').append('<div class="dd-mui-timermsg"><div>'
                + msg + '</div></div>');
            setTimeout(function () {
                $('body .dd-mui-timermsg').animate(
                    {
                        'opacity': '0'
                    },
                    500,
                    'ease-in-out',
                    function () {
                        $('body .dd-mui-timermsg').remove();

                    }
                );
            }, (timer || 2) * 1000);
        }

        return lib.inherits(TimerMsg, Control);
    }
);

