/**
 * 自动初始化
 */
define(
    function (require) {
        $.autoInitDDui =  function (initUis) {
            $.each(initUis, function (indexUi, ui) {
                $('[ui-type="'+ ui.prototype.type +'"]')
                    .each(function (indexItem, item) {
                    new ui(item);
                });
            });
        }
    }
);
