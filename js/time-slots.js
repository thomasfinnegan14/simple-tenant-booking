jQuery(document).ready(function($) {
    $('.date-link').click(function(e) {
        e.preventDefault();
        var day = $(this).data('day');
        var month = $(this).data('month');
        var year = $(this).data('year');

        // Clear the previous slots and form
        $('#time-slots').empty();
        $('#booking-form').remove();

        // Generate time slots
        generateTimeSlots(day);

        // Add click event to time slot buttons
        $(document).on('click', '.time-slot-button', function() {
            var selectedTime = $(this).text();
            // Display the booking form with the selected time slot
            showBookingForm(selectedTime);
        });
    });

    function generateTimeSlots(day) {
        let today = new Date().getDate();
        let currentHour = new Date().getHours();
        let AMPM = 'AM';
        let nextAMPM = 'AM';

        for (var hour = 9; hour < 17; hour++) {
            let printHour = hour > 12 ? hour - 12 : hour;
            let nextHour = hour + 1 > 12 ? hour - 11 : hour + 1;
            AMPM = hour >= 12 && hour < 24 ? 'PM' : 'AM';
            nextAMPM = (hour + 1) >= 12 && (hour + 1) < 24 ? 'PM' : 'AM';

            var slot = $('<button>')
                .text(printHour + ':00 ' + AMPM + ' - ' + nextHour + ':00 ' + nextAMPM)
                .addClass('time-slot-button');
            
            if (day == today && hour <= currentHour) {
                slot.addClass('unavailable').prop("disabled", true);
            }

            $('#time-slots').append(slot);
        }
    }

    function showBookingForm(selectedTime) {
        // Remove existing form if any
        $('#booking-form').remove();

        var formHtml = '<div id="booking-form">' +
                        '<h3>Selected time slot to reserve:</h3>' +
                        '<p>' + selectedTime + '</p>' +
                        '<input type="text" id="name" placeholder="Enter your name/company name" />' +
                        '<button type="submit">Reserve</button>' +
                       '</div>';
        
        $('#time-slots').after(formHtml);
    }
});