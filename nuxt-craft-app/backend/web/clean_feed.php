<?php
// 3rd-party XML feed URL
$feedUrl = 'https://dreams-careers.com/rssoutDreams.php'; // feed URL

// 1. Fetch the raw content from the URL (your XML feed)
$xml_url = 'https://dreams-careers.com/rssoutDreams.php';
$raw_content = file_get_contents($xml_url);

// 2. Convert the encoding from ISO-8859-1 (the file's actual encoding) to UTF-8
// The iconv function will preserve all whitespace, including newlines.
// It will convert the single-byte '£' (0xA3) into the two-byte UTF-8 '£' (0xC2 0xA3).
$utf8_content = iconv('ISO-8859-1', 'UTF-8//IGNORE', $raw_content);

// 3. Optional: Fix the XML declaration to be accurate
$fixed_xml_content = preg_replace(
    '/<\?xml version="1.0".*\?>/i',
    '<?xml version="1.0" encoding="UTF-8"?>',
    $utf8_content
);
print $fixed_xml_content;

// Now, $fixed_xml_content is a UTF-8 string that can be processed by Feed Me.