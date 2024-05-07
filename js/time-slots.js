jQuery(document).ready(function($) {
    $('.date-link').click(function(e) {
        e.preventDefault();
        $('.date-link').removeClass('active'); // Remove active class from all date links
        $(this).addClass('active'); // Add active class to the clicked link
        var day = $(this).data('day');
        var month = $(this).data('month');
        var year = $(this).data('year');

        $(this).data('date', year + '-' + month + '-' + day);

        // Clear the previous slots and form
        $('#time-slots').empty();
        $('#booking-form').remove();

        // Generate time slots
        generateTimeSlots(day);

        // Add click event to time slot buttons
        $(document).on('click', '.time-slot-button', function() {
            var selectedTime = $(this).text();
            // Display the booking form with the selected time slot
            showBookingForm(selectedTime, month, day);
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

    function showBookingForm(selectedTime, month, day) {
        // Remove existing form if any
        $('#booking-form').remove();

        var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

        var selectedMonthName = months[month - 1];

        var formHtml = '<div id="booking-form">' +
                        '<h3>Selected time slot to reserve:</h3>' +
                        '<p>' + selectedTime + ' -- ' + selectedMonthName + ' ' + day + '</p>' +
                        '<input type="text" id="name" placeholder="Enter your name/company name" />' +
                        '<button type="submit">Reserve</button>' +
                       '</div>';
        
        $('#time-slots').after(formHtml);
    }

    $(document).on('click', '#booking-form button', function(e) {
        e.preventDefault();
    
        var name = $('#name').val();
        var timeSlot = $('#booking-form p').text();
        // Ensure the '.date-link.active' selector is actually being used and correct.
        var date = $('.date-link.active').data('date'); 
    
        $.ajax({
            url: ajax_object.ajax_url, // Updated to use the localized 'ajax_url'
            type: 'POST',
            data: {
                action: 'save_reservation',
                name: name,
                time_slot: timeSlot,
                date: date
            },
            success: function(response) {
                alert('Reservation saved!');
                $('#name').val(''); // Clear the input after submission.
            },
            error: function() {
                alert('Error saving reservation.');
            }
        });
    });    
});
