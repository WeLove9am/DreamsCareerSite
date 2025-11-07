<?php
namespace modules\jobhighlights\services;

use Craft;
use craft\elements\Entry;
use GuzzleHttp\Client;
use craft\helpers\App;


class HighlightService
{
    /**
     * Process a batch of entries from the given section
     */
    public static function processJobs(string $sectionHandle, int $limit = 5): array
    {
        $entries = Entry::find()
            ->section($sectionHandle)
            ->limit($limit)
            ->all();

        $processed = [];

        foreach ($entries as $entry) {
            $desc = $entry->getFieldValue('jobDescription');
            $current = $entry->getFieldValue('highlights');

            if (!$desc || !empty($current)) {
                continue;
            }

            $result = self::getHighlightsFromClaude($desc);

            if ($result) {
                $entry->setFieldValue('highlights', $result);
                Craft::$app->getElements()->saveElement($entry);
                $processed[] = [
                    'id' => $entry->id,
                    //'title' => $entry->title,
                    'highlights' => $result
                ];
            }
        }

        return $processed;
    }

    /**
     * Call Claude API to extract 3 highlight phrases
     */
    private static function getHighlightsFromClaude(string $text): ?string
    {
        //$apiKey = Craft::$app->getConfig()->env('ANTHROPIC_API_KEY');
//         $apiKey = App::env('ANTHROPIC_API_KEY');
//         if (!$apiKey) {
//             Craft::error('Claude API key missing.', __METHOD__);
//             return null;
//         }

//         $client = new Client(['base_uri' => 'https://api.anthropic.com/']);

//         $prompt = <<<EOT
// You are an assistant that reads the following job description and returns exactly three highlight phrases, each 3–6 words long. 
// Separate phrases with semicolons.

// Job Description:
// {$text}

// Highlights:
// EOT;

//         try {
//             $response = $client->post('v1/messages', [
//                 'headers' => [
//                     'x-api-key' => $apiKey,
//                     'Content-Type' => 'application/json',
//                     'Anthropic-Version' => '2023-06-01'
//                 ],
//                 'json' => [
//                     'model' => 'claude-3-opus-20240229',
//                     'max_tokens' => 150,
//                     'messages' => [
//                         ['role' => 'user', 'content' => $prompt]
//                     ],
//                     'max_tokens_to_sample' => 100
//                 ]
//             ]);

//             // $body = json_decode((string)$response->getBody(), true);
//             // return trim($body['messages'][0]['text'] ?? '');
//             $output = $body['content'][0]['text'] ?? '';
//             return trim($output);
//         } catch (\Throwable $e) {
//             Craft::error('Claude API call failed: ' . $e->getMessage(), __METHOD__);
//             return null;
//         }


//New openAI code

        // $entry = Entry::find()->id($entryId)->one();
        // if (!$entry) {
        //     throw new \Exception("Entry not found.");
        // }

        // $description = $entry->jobDescription ?? $entry->plainText ?? '';
        // if (!$description) {
        //     throw new \Exception("No job description found.");
        // }

        $apiKey = App::env('OPENAI_API_KEY');
        if (!$apiKey) {
            throw new \Exception("Missing OpenAI API key in config/app.php");
        }

        $prompt = "Extract 3 concise job highlights (3-6 words each) from this job description:\n\n{$text}";

        $client = new Client(['base_uri' => 'https://api.openai.com/v1/']);

        $response = $client->post('chat/completions', [
            'headers' => [
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an assistant that extracts highlights.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens' => 150,
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);
        $highlights = trim($data['choices'][0]['message']['content'] ?? '');

        return $highlights;





    }
}
