jQuery(document).ready(function($) {
    var today = new Date();
    var startOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    function fetchMonthlyReservations() {
        $.ajax({
            url: ajax_object.ajax_url,
            type: 'POST',
            data: {
                action: 'fetch_monthly_reservations',
                start_date: formatDate(startOfMonth),
                end_date: formatDate(endOfMonth)
            },
            success: function(reservations) {
                processReservations(reservations);
            }
        });
    }
    fetchMonthlyReservations();

    function formatDate(date) {
        return date.getFullYear() + '-' +
               ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
               ('0' + date.getDate()).slice(-2);  // Correct zero-padding for month and day
    }    

    function processReservations(reservations) {
        var reservationData = {};
        $.each(reservations, function(i, reservation) {
            var date = reservation.date;
            if (!reservationData[date]) {
                reservationData[date] = [];
            }
            reservationData[date].push(reservation.time_slot + ' - ' + reservation.name);
        });
        window.reservationData = reservationData;
        console.log(window.reservationData); // Check the updated reservation data
    
        // Update the display for the currently selected date
        var selectedDate = $('.date-link.active').data('date');
        if (selectedDate) {
            displayReservationsForDate(selectedDate);
        }
    }    

    $('.date-link').click(function(e) {
        e.preventDefault();
        $('.date-link').removeClass('active'); // Remove active class from all date links
        $(this).addClass('active'); // Add active class to the clicked link

        var day = $(this).data('day').toString().padStart(2, '0');
        var month = $(this).data('month').toString().padStart(2, '0');
        var year = $(this).data('year').toString();
        var selectedDate = year + '-' + month + '-' + day;

        $(this).data('date', selectedDate);

        // Update the title with the new date
        $('#reservation-list-title').text('Reservations for ' + formatDateDisplay(selectedDate));

        // Clear the previous slots and form
        $('#time-slots').empty();
        $('#booking-form').remove();

        // Generate time slots
        generateTimeSlots(parseInt(day));

        // Add click event to time slot buttons
        $(document).on('click', '.time-slot-button', function() {
            var selectedTime = $(this).text();
            // Display the booking form with the selected time slot
            showBookingForm(selectedTime, month, day);
        });

        displayReservationsForDate(selectedDate);
    });

    function displayReservationsForDate(date) {
        var reservations = window.reservationData[date] || []; // Default to an empty array if no data
        var listHtml = '';
        if (reservations.length > 0) {
            $.each(reservations, function(index, reservation) {
                listHtml += '<li>' + reservation + '</li>';
            });
        } else {
            listHtml += '<li>No reservations for this date.</li>';
        }
        $('#reservation-items').html(listHtml); // Only update the list items, not the entire container
    }    
    
    function formatDateDisplay(dateStr) {
        var dateObj = new Date(dateStr + 'T00:00:00'); // Ensure timezone doesn't affect the date
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);  // This will format the date as "Month Day, Year"
    }    

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
                        '<div style="display:flex;">' +
                            '<p>' + selectedTime + '</p>' +
                            '<span>' + ' -- ' + selectedMonthName + ' ' + day + '</span>' +
                        '</div>' +
                        '<input type="text" autocomplete="name" id="name" placeholder="Enter your name/company name" />' +
                        '<button style="margin-left:15px;" type="submit">Reserve</button>' +
                       '</div>';
        
        $('#time-slots').after(formHtml);
    }

    $(document).on('click', '#booking-form button', function(e) {
        e.preventDefault();
    
        var name = $('#name').val();
        var timeSlot = $('#booking-form p').text(); // Verify that this is capturing the correct text.
        var date = $('.date-link.active').data('date'); // Make sure this accurately reflects the selected date.
    
        $.ajax({
            url: ajax_object.ajax_url,
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
    
                // Call to refresh the reservations after successful booking
                fetchMonthlyReservations();
            },
            error: function() {
                alert('Error saving reservation.');
            }
        });
    });    
});
