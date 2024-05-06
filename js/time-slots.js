jQuery(document).ready(function($) {
    $('.date-link').click(function(e) {
        e.preventDefault();
        var day = $(this).data('day');
        var month = $(this).data('month');
        var year = $(this).data('year');

        let today = new Date().getDate();
        let currentHour = new Date().getHours();

        let AMPM = 'AM';
        let nextAMPM = 'AM';

        // Clear the previous slots
        $('#time-slots').empty();

        if (day == today) {
            for (var hour = 9; hour < 17; hour++) {
                if (hour < 12) {
                    AMPM = 'AM';
                }
                else {
                    AMPM = 'PM';
                }

                if ((hour + 1) < 12) {
                    nextAMPM = 'AM';
                }
                else {
                    nextAMPM = 'PM';
                }

                let printHour = hour;
                let nextHour = hour + 1;

                switch (hour) {
                    case 12:
                        nextHour = 1;
                        break;
                    case 13:
                        printHour = 1;
                        nextHour = 2;
                        break;
                    case 14:
                        printHour = 2;
                        nextHour = 3;
                        break;
                    case 15:
                        printHour = 3;
                        nextHour = 4;
                        break;
                    case 16:
                        printHour = 4;
                        nextHour = 5;
                        break;
                }

                if (hour <= currentHour) {
                    var slot = $('<button>')
                    .text(printHour + ':00 ' + AMPM + ' - ' + nextHour + ':00 ' + nextAMPM)
                    .addClass('time-slot-button')
                    .addClass('unavailable')
                    .prop("disabled", true)
                    .off('mouseenter mouseleave');
    
                    $('#time-slots').append(slot);
                } else {
                    var slot = $('<button>')
                    .text(printHour + ':00 ' + AMPM + ' - ' + nextHour + ':00 ' + nextAMPM)
                    .addClass('time-slot-button')
                    .on('click', function() {
                        // Handle booking logic here
                        alert('Booking for ' + $(this).text());
                    });
    
                    $('#time-slots').append(slot);
                }
            }
        } else {
            for (var hour = 9; hour < 17; hour++) {
                if (hour < 12) {
                    AMPM = 'AM';
                }
                else {
                    AMPM = 'PM';
                }

                if ((hour + 1) < 12) {
                    nextAMPM = 'AM';
                }
                else {
                    nextAMPM = 'PM';
                }

                let printHour = hour;
                let nextHour = hour + 1;

                switch (hour) {
                    case 12:
                        nextHour = 1;
                        break;
                    case 13:
                        printHour = 1;
                        nextHour = 2;
                        break;
                    case 14:
                        printHour = 2;
                        nextHour = 3;
                        break;
                    case 15:
                        printHour = 3;
                        nextHour = 4;
                        break;
                    case 16:
                        printHour = 4;
                        nextHour = 5;
                        break;
                }

                var slot = $('<button>')
                .text(printHour + ':00 ' + AMPM + ' - ' + nextHour + ':00 ' + nextAMPM)
                .addClass('time-slot-button')
                .on('click', function() {
                    // Handle booking logic here
                    alert('Booking for ' + $(this).text());
                });

                $('#time-slots').append(slot);
            }
        }
    });
});
