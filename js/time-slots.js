function formatBlockToTime(block, duration_blocks) {
    console.log(block);
    console.log(duration_blocks);
    let startHour = Math.floor((block - 1) / 2) + 8;
    let startMinute = (block - 1) % 2 === 0 ? '00' : '30';
    
    // Calculate the end block based on the start block and duration
    let endBlock = block + duration_blocks - 1;
    let endHour = Math.floor((endBlock - 1) / 2) + 8;
    let endMinute = (endBlock - 1) % 2 === 0 ? '00' : '30';


    // Adjust the end time to account for the end minute being '30'
    if ((endBlock - 1) % 2 === 1) {
        endMinute = '00';
        endHour += 1;
    } else {
        endMinute = '30';
    }

    console.log(startHour + ':' + startMinute + ' - ' + endHour + ':' + endMinute);

    return startHour + ':' + startMinute + ' - ' + endHour + ':' + endMinute;
}

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
                console.log(reservations);
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
            reservationData[date].push({
                start_block: reservation.start_block,
                duration_blocks: reservation.duration_blocks,
                name: reservation.name
            });
        });
        window.reservationData = reservationData;
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
        //generateTimeSlots(parseInt(day));

        // Add click event to time slot buttons
        $(document).on('click', '.time-slot-button', function() {
            var selectedTime = $(this).text();
            // Display the booking form with the selected time slot
            showBookingForm(selectedTime, month, day);
        });
        console.log(selectedDate);

        displayReservationsForDate(selectedDate);
    });

    function displayReservationsForDate(date) {
        var reservations = window.reservationData[date] || [];
        var listHtml = '';
    
        if (reservations.length > 0) {
            $.each(reservations, function(index, reservation) {
                console.log('Index:', index);
                console.log('Start Block:', reservation.start_block);
                console.log('Duration Blocks:', reservation.duration_blocks);
                console.log('Formatted Time:', formatBlockToTime(reservation.start_block, reservation.duration_blocks));
    
                listHtml += '<li>' + formatBlockToTime(reservation.start_block, reservation.duration_blocks) + ' - ' + reservation.name + '</li>';
            });
        } else {
            listHtml += '<li>No reservations for this date.</li>';
        }
    
        $('#reservation-items').html(listHtml);
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

        for (var block = 1; block <= 20; block++) {
            let timeSlotText = formatBlockToTime(block, 1);

            var slot = $('<button>')
                .text(timeSlotText)
                .addClass('time-slot-button');

            if (day == today && getBlockHour(block) <= currentHour) {
                slot.addClass('unavailable').prop("disabled", true);
            } else {
                // Check if the time slot has been reserved
                /*let isReserved = allReservations.some(reservation => {
                    let reservationDate = new Date(reservation.date + 'T00:00:00');
                    return reservationDate.getDate() == day && reservation.start_block <= block && block < (reservation.start_block + reservation.duration_blocks);
                }); */

                if (isReserved) {
                    slot.addClass('unavailable').prop("disabled", true);
                }
            }

            $('#time-slots').append(slot);
        }
    }

    function getBlockHour(block) {
        return Math.floor((block - 1) / 2) + 8;
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
                        '<label for="duration_blocks">Duration (in 30 min blocks, max 8):</label>' +
                        '<input type="number" id="duration_blocks" name="duration_blocks" min="1" max="8" value="1">' +
                        '<button style="margin-left:15px;" type="submit">Reserve</button>' +
                       '</div>';

        $('#time-slots').after(formHtml);
    }

    $(document).on('click', '#booking-form button', function(e) {
        e.preventDefault();

        var name = $('#name').val();
        var timeSlot = $('#booking-form p').text(); // Verify that this is capturing the correct text.
        var date = $('.date-link.active').data('date'); // Make sure this accurately reflects the selected date.
        var start_block = timeSlotToBlock(timeSlot.split(' - ')[0].trim());
        var duration_blocks = parseInt($('#duration_blocks').val());

        $.ajax({
            url: ajax_object.ajax_url,
            type: 'POST',
            data: {
                action: 'save_reservation',
                name: name,
                start_block: start_block,
                duration_blocks: duration_blocks,
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

    function timeSlotToBlock(time) {
        let [hour, minute] = time.split(':');
        hour = parseInt(hour);
        minute = parseInt(minute);
        return ((hour - 8) * 2) + (minute === 30 ? 2 : 1);
    }
});