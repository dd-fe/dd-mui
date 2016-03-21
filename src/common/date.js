/**
 * @file: 日期处理常用函数
 */

define(
    function (require) {

        var date = {};

        /**
         * 获得星期几
         *
         * @param {Object} 日期类型
         * @return {string}
         */
        date.getWeekName = function (dateObj) {
            var dateObj = dateObj || new Date();
            var weekName = [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            ];
            return weekName[dateObj.getDay()];
        };

        /**
         * 获得某天
         *
         * @param {number} range
         * @param {string} 格式
         * @param {string|date} 基础日期
         * @return {string} 日期
         */
        date.getDate = function (range, format, base) {
            var range = range || 0;
            if (typeof range === 'number') {
                var base = base ? new Date(base) : new Date();
                var time = new Date(base.getTime() + range * 1000 * 60 * 60 * 24);
            }
            else {
                var time = new Date(range);
            }

            var yy = time.getFullYear();
            var mm = time.getMonth() + 1;
            if (mm < 10) {
                mm = '0' + mm;
            }
            var dateNum = time.getDate();

            if (dateNum < 10) {
                dateNum = '0' + dateNum;
            }

            var week = date.getWeekName(time);

            if (format) {
                format = format.replace('yy', yy);
                format = format.replace('mm', mm);
                format = format.replace('dd', dateNum);
                format = format.replace('week', week);
            }

            return {
                desc: format || time,
                time: time.toString(),
                timeOrigin: time
            };
        };

        /**
         * 按照一定格式，获得一段时间的日期的数组
         *
         * @param {object} range
         * @param {string} 格式
         * @return {string} 日期
         */
        date.getRange = function (range, format) {
            var bg = date.getDate(range.bg).timeOrigin;
            var end = date.getDate(range.end).timeOrigin;
            var arr = [];
            var count = 0;

            while(date.getDate(count, null, bg).timeOrigin.getTime() < end.getTime()) {
                var time = date.getDate(count, format, bg);
                ++ count;
                arr.push(time);
            }
            arr.push(date.getDate(end, format));
            return arr;
        };

        return date;
    }
);
