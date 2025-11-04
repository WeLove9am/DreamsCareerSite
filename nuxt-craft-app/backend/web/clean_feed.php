<?php
// PHP Script: clean_feed.php

// 3rd-party XML feed URL
$feedUrl = 'https://dreams-careers.com/rssoutDreams.php'; // feed URL

// --- STEP 1: Fetch the raw content using cURL (Secure method) ---
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $feedUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$raw_content = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch) || $http_code !== 200) {
    error_log("cURL Error fetching feed: " . curl_error($ch) . " | HTTP Code: " . $http_code);
    die("Error fetching feed content.");
}
curl_close($ch);
// --- END cURL FETCH ---


// 2. Convert the encoding from ISO-8859-1 to UTF-8
$utf8_content = iconv('ISO-8859-1', 'UTF-8//IGNORE', $raw_content);

// --- NEW STEP: Modify the <postdate> format ---
$final_content = $utf8_content;

// Regular expression to find <postdate> tag content (e.g., 31 Oct 25)
$final_content = preg_replace_callback(
    '/<postdate>(.*?)<\/postdate>/',
    function ($matches) {
        $original_date_str = trim($matches[1]);
        
        // Convert the short year (25) to a four-digit year (2025) and month name to number.
        // PHP's strtotime can handle '31 Oct 25' correctly.
        $timestamp = strtotime($original_date_str);
        
        // Format the timestamp into the desired DD/MM/YYYY format
        $new_date_format = date('d/m/Y', $timestamp);
        
        // Rebuild the <postdate> tag with the new format
        return "<postdate>{$new_date_format}</postdate>";
    },
    $final_content
);
// --- END DATE MODIFICATION ---


// 3. Optional: Fix the XML declaration to be accurate
$fixed_xml_content = preg_replace(
    '/<\?xml version="1.0".*\?>/i',
    '<?xml version="1.0" encoding="UTF-8"?>',
    $final_content
);

// Print the final, cleaned XML feed
header('Content-Type: application/xml');
print $fixed_xml_content;

?>