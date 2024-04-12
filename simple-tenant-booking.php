<?php
/*
 * Plugin Name:       Simple Tenant Booking
 * Plugin URI:        https://simpletenantbooking.tfwsolutions.com/
 * Description:       A simple booking plugin for multi-tenant property owners.
 * Version:           1.0.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            TF Web Solutions
 * Author URI:        https://tfwsolutions.com/
 * License:           GPL v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Update URI:        https://simpletenantbooking.tfwsolutions.com/
 */

function st_booking_shortcode() {
    // Set timezone - Uses WP Site Timezone
    date_default_timezone_set(wp_timezone_string());

    // Variables for the current month and year
    $month = date('m');
    $year = date('Y');

    // Get the first day of the month
    $firstDayOfMonth = mktime(0, 0, 0, $month, 1, $year);

    // Get the name of the month
    $monthName = date('F', $firstDayOfMonth);

    // Get the day of the week for the first day of the month (0-6, Sunday-Saturday)
    $dayOfWeek = date('w', $firstDayOfMonth);

    // Get the number of days in the month
    $daysInMonth = date('t', $firstDayOfMonth);

    // Start the calendar table
    $calendar = "<table>";
    $calendar .= "<caption>$monthName $year</caption>";
    $calendar .= "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

    // Initialize day counter and weeks counter
    $currentDay = 1;
    $calendar .= "<tr>";

    // The variable $dayOfWeek holds the day of the week of the first day of the month
    // We need to add empty cells until we reach that day of the week
    for ($i = 0; $i < $dayOfWeek; $i++) {
        $calendar .= "<td></td>";
    }

    while ($currentDay <= $daysInMonth) {
        // If we've reached the end of the week, close the row and start a new one
        if ($dayOfWeek == 7) {
            $dayOfWeek = 0;
            $calendar .= "</tr><tr>";
        }

        $calendar .= "<td>$currentDay</td>";
        $currentDay++;
        $dayOfWeek++;
    }

    // Complete the row of the last week in month with empty cells
    if ($dayOfWeek != 7) {
        $remainingDays = 7 - $dayOfWeek;
        for ($i = 0; $i < $remainingDays; $i++) {
            $calendar .= "<td></td>";
        }
    }

    $calendar .= "</tr>";
    $calendar .= "</table>";

    return $calendar;
}
add_shortcode('st_booking', 'st_booking_shortcode');

?>