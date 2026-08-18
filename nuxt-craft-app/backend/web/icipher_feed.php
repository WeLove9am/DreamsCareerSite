<?php
// PHP Script: icipher_feed.php

// 3rd-party XML feed URL
$feedUrl = 'https://dreams.ciphr-irecruit.com/rssfeed.aspx'; // feed URL

// Generated XML file name
$outputFile = __DIR__ . '/icipher-feed.xml';

function replaceNodeName(DOMDocument $document, DOMElement $node, string $newName): DOMElement
{
    $newNode = $document->createElement($newName);

    while ($node->attributes && $node->attributes->length > 0) {
        $attribute = $node->attributes->item(0);
        $node->removeAttributeNode($attribute);
        $newNode->setAttributeNode($attribute);
    }

    while ($node->firstChild) {
        $newNode->appendChild($node->firstChild);
    }

    $node->parentNode->replaceChild($newNode, $node);

    return $newNode;
}

function parseDateToTimestamp(string $dateString): ?int
{
    $dateString = trim($dateString);

    if ($dateString === '') {
        return null;
    }

    if (ctype_digit($dateString)) {
        return strlen($dateString) > 10 ? (int) floor(((int) $dateString) / 1000) : (int) $dateString;
    }

    $timezone = new DateTimeZone('UTC');
    $formats = [
        'd/m/Y',
        'd/m/y',
        'd-m-Y',
        'd-m-y',
        'Y-m-d',
        'Y-m-d H:i:s',
        'Y-m-d\TH:i:s',
        'Y-m-d\TH:i:s.v',
        'Y-m-d\TH:i:s.u',
        'Y-m-d\TH:i:sP',
        'Y-m-d\TH:i:s.vP',
        'Y-m-d\TH:i:s.uP',
        'D, d M Y H:i:s O',
        'd M Y',
        'd M y',
    ];

    foreach ($formats as $format) {
        $date = DateTime::createFromFormat('!' . $format, $dateString, $timezone);
        $errors = DateTime::getLastErrors();

        if (
            $date instanceof DateTime
            && (
                $errors === false
                || ($errors['warning_count'] === 0 && $errors['error_count'] === 0)
            )
        ) {
            return $date->getTimestamp();
        }
    }

    $timestamp = strtotime($dateString);

    return $timestamp === false ? null : $timestamp;
}

function isDateElement(DOMElement $node): bool
{
    $name = strtolower($node->localName);

    if ($name !== 'pubdate' && $name !== 'expdate') {
        return false;
    }

    return !($name === 'pubdate' && $node->parentNode instanceof DOMElement && strtolower($node->parentNode->localName) === 'channel');
}

function splitEmploymentType(string $employmentType): array
{
    $employmentType = trim(preg_replace('/\s+/', ' ', $employmentType));
    $parts = array_map('trim', explode('/', $employmentType, 2));

    return [
        $parts[0] ?? '',
        $parts[1] ?? '',
    ];
}

// --- STEP 1: Fetch the raw content using cURL (Secure method) ---
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $feedUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
curl_setopt($ch, CURLOPT_TIMEOUT, 45);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    'User-Agent: DreamsCareersFeedCleaner/1.0',
]);

$raw_content = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch) || $http_code !== 200 || $raw_content === false || trim($raw_content) === '') {
    error_log("cURL Error fetching CIPHR feed: " . curl_error($ch) . " | HTTP Code: " . $http_code);
    http_response_code(502);
    die("Error fetching feed content.");
}
curl_close($ch);
// --- END cURL FETCH ---


// 2. Convert the encoding to UTF-8 when required
$encoding = 'UTF-8';
if (preg_match('/<\?xml[^>]+encoding=["\']([^"\']+)["\']/i', $raw_content, $matches)) {
    $encoding = strtoupper(trim($matches[1]));
}

if ($encoding !== 'UTF-8' && $encoding !== 'UTF8') {
    $utf8_content = iconv($encoding, 'UTF-8//IGNORE', $raw_content);
} else {
    $utf8_content = $raw_content;
}

if ($utf8_content === false) {
    http_response_code(500);
    die("Error converting feed encoding.");
}

// --- STEP 3: Clean the XML structure for Feed Me ---
$document = new DOMDocument('1.0', 'UTF-8');
$document->preserveWhiteSpace = false;
$document->formatOutput = true;

libxml_use_internal_errors(true);
$xmlLoaded = $document->loadXML($utf8_content);

if (!$xmlLoaded) {
    error_log("Unable to parse CIPHR feed XML.");
    http_response_code(500);
    die("Error parsing feed content.");
}

$xpath = new DOMXPath($document);

// Convert only pubDate and expDate values to Unix timestamp seconds.
foreach ($xpath->query('//*') as $dateNode) {
    if (!$dateNode instanceof DOMElement || !isDateElement($dateNode)) {
        continue;
    }

    $hasElementChildren = false;
    foreach ($dateNode->childNodes as $childNode) {
        if ($childNode instanceof DOMElement) {
            $hasElementChildren = true;
            break;
        }
    }

    if ($hasElementChildren) {
        continue;
    }

    $timestamp = parseDateToTimestamp($dateNode->textContent);

    if ($timestamp !== null) {
        $dateNode->nodeValue = (string) $timestamp;
    }
}

// Rename each job's 1st, 2nd and 3rd textDescription fields.
$descriptionNames = ['jobDescription', 'thePerson', 'aboutDreams'];
$descriptionGroups = [];
foreach ($xpath->query('//*[translate(local-name(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "textdescription"]') as $textDescription) {
    $parent = $textDescription->parentNode;
    $parentKey = spl_object_hash($parent);

    if (!isset($descriptionGroups[$parentKey])) {
        $descriptionGroups[$parentKey] = [];
    }

    $descriptionGroups[$parentKey][] = $textDescription;
}

foreach ($descriptionGroups as $textDescriptions) {
    foreach ($textDescriptions as $index => $textDescription) {
        if (isset($descriptionNames[$index])) {
            replaceNodeName($document, $textDescription, $descriptionNames[$index]);
        }
    }
}

// Replace EmploymentType with contractType and contractHours.
foreach ($xpath->query('//*[translate(local-name(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "employmenttype"]') as $employmentType) {
    $parent = $employmentType->parentNode;
    [$contractType, $contractHours] = splitEmploymentType($employmentType->textContent);

    $contractTypeNode = $document->createElement('contractType');
    $contractTypeNode->appendChild($document->createTextNode($contractType));
    $parent->insertBefore($contractTypeNode, $employmentType);

    $contractHoursNode = $document->createElement('contractHours');
    $contractHoursNode->appendChild($document->createTextNode($contractHours));
    $parent->insertBefore($contractHoursNode, $employmentType);

    $parent->removeChild($employmentType);
}

$fixed_xml_content = $document->saveXML();
// --- END XML CLEANING ---

if ($fixed_xml_content === null) {
    http_response_code(500);
    die("Error cleaning feed content.");
}

// 4. Create/update the XML file
if (file_put_contents($outputFile, $fixed_xml_content) === false) {
    error_log("Unable to write CIPHR feed file: " . $outputFile);
    http_response_code(500);
    die("Error writing feed file.");
}

// Print the final, cleaned XML feed
header('Content-Type: application/xml; charset=UTF-8');
print $fixed_xml_content;
