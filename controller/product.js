var moment = require('moment');

class Product {
    getDeliveryDate(orderDate, courierName) {

        // Configuration for different careers, can be fetched from DB
        let config = {
            'dhl': {
                'cutoff': '11:59:59',
                'delivery': '2' //days
            },
            'hermes': {
                'cutoff': '14:59:59',
                'delivery': '3'
            }
        }

        //Public holidays array of current year, can be added more in the same manner and German time zone
        let publicHolidays = [
            `${moment().year()}-01-01T00:00:00+01:00`,
            `${moment().year()}-04-10T00:00:00+01:00`,
            `${moment().year()}-04-13T00:00:00+01:00`,
            `${moment().year()}-05-01T00:00:00+01:00`,
            `2020-01-01T11:21:38+01:00`,
            `2020-04-10T11:21:38+01:00`,
            `2020-04-13T11:21:38+01:00`,
            `2020-05-01T11:21:38+01:00`,
        ];

        let expectedDate = '';
        let dayIndex = 0;
        expectedDate = orderDate;
        expectedDate = moment(expectedDate).utcOffset('+0100', false);
        try{
            //Check if time of order is greater than cutoff time then add 1 day
            if (this.isTimeGreaterThanCutoff(config[courierName].cutoff, moment(expectedDate).format('HH:mm:ss'))) {
                expectedDate = moment((expectedDate)).add(1, 'day').utcOffset('+0100', false);
            }

            // Looping until the delivery days are added
            while (dayIndex < config[courierName].delivery) {

                //If expected date of delivery is sunday or saturday then skip the day
                if ((moment(expectedDate).day() === 0 || moment(expectedDate).day() === 6)) {
                    expectedDate = moment((expectedDate)).add(1, 'day').utcOffset('+0100', false);
                    continue;
                }

                //if the currently expected day is happening to be holiday, skip it also
                if (this.isPublicHoliday(publicHolidays, expectedDate)) {
                    expectedDate = moment((expectedDate)).add(1, 'day').utcOffset('+0100', false);
                    continue;
                }
                //If all condition passed then add a day and record it that a day from delivery days of courier is added
                expectedDate = moment((expectedDate)).add(1, 'day').utcOffset('+0100', false);

                dayIndex++;
            }

            return {
                'status': 'success',
                'data' :{
                    'expectedDate' : moment(expectedDate).format('yyyy-MM-DD')
                }
            };
        }
        catch(e){
            return {
                'status': 'false',
                'data' :{
                    'error' : "There's something wrong!"
                }
            };
        }

    }

    isTimeGreaterThanCutoff(cutoff, time) {
        var cutoffs = moment(cutoff, 'HH:mm:ss').utcOffset('+0100', true);
        var orderTime = moment(time, 'HH:mm:ss').utcOffset('+0100', true);
        return !orderTime.isBefore(cutoffs);

    }

    isPublicHoliday(array, date) {
        return !!array.find(item => {
            let holidayDate = moment(item).format('yyyy-MM-DD');
            let currentDate = moment(date).format('yyyy-MM-DD');
            return holidayDate === currentDate;
        });

    }

}

module.exports = {Product};
