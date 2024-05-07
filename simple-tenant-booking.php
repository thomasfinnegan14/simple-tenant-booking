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

    // Variables for the current month, year, and day
    $month = date('m');
    $year = date('Y');
    $day = date("d");

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

        // Check if current day is able to be selected
        if ($currentDay >= $day) {
            // Check if current day is today
            if ($currentDay == $day) {
                $calendar .= "<td class='stb-cell currentDay'><a href='#' class='date-link' data-day='$currentDay' data-month='$month' data-year='$year'>" . $currentDay . "</a></td>";
            }
            else {
                $calendar .= "<td class='stb-cell'><a href='#' class='date-link' data-day='$currentDay' data-month='$month' data-year='$year'>" . $currentDay . "</a></td>";
            }
        } else {
            $calendar .= "<td>$currentDay</td>";
        }
        
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

    // Container for time slots
    $calendar .= "<h2 style='text-align:center;'>Time Slots:</h2>";
    $calendar .= "<div id='time-slots' style='padding-top: 20px;'></div>";

    return $calendar;
}
add_shortcode('st_booking', 'st_booking_shortcode');

function st_booking_load_plugin_css() {
    wp_enqueue_style('st_booking_styles', plugins_url('styles/style.css', __FILE__), array(), '1.0.0', 'all');
}
add_action( 'wp_enqueue_scripts', 'st_booking_load_plugin_css' );

function st_booking_enqueue_scripts() {
    wp_enqueue_script('st_booking_time_slots', plugins_url('js/time-slots.js', __FILE__), array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'st_booking_enqueue_scripts');

function st_booking_create_booking_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'st_booking_reservations';

    // Check if the table already exists
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") != $table_name) {
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE `$table_name` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `date` DATE NOT NULL,
          `time_slot` VARCHAR(50) NOT NULL,
          `name` VARCHAR(255) NOT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
register_activation_hook(__FILE__, 'st_booking_create_booking_table');

?>