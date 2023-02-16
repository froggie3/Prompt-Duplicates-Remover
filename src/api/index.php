<?php
header("Content-Type: application/json");

class PromptModifier
{
    /**
     * 配列内で重複している値を全て出力する
     * 
     * @param $array 重複している値を調べる配列
     * @return array 重複している値を全て含む配列
     */
    public function get_differences(array $array): array
    {
        $duplicates = $this->array_duplicates($array);
        $out = [];

        foreach ($duplicates as $words => $times) {
            for ($i = 0; $i <= $times - 1; $i++) {
                $out[] = $words;
            }
        }

        return $out;
        // white, white, white, repeated
    }

    /**
     * 配列内で重複している値の種類を出力する
     *
     * @param $array 重複している値を調べる配列
     * @return array key = 値, value = 重複している回数
     */
    public function array_duplicates(array $array): array
    {
        $duplicates = [];
        $NOEXISTS = 1;

        foreach (array_count_values($array) as $key => $value) {
            if ($value === $NOEXISTS) {
                continue;
            }

            $duplicates[$key] = --$value;
        }

        return $duplicates;
    }
}

function main($prompts): void
{
    if (validCheck($prompts) === false) {
        return;
    }

    $pm = new PromptModifier;

    $prompts_array = explode(", ", htmlspecialchars(trim($prompts)));

    $cleaned_prompts = array_values(array_unique($prompts_array));

    $json = json_encode(array(
        //'original' => $prompts_array,
        'prompts' => $cleaned_prompts,
        'reduced' => array(
            'prompt' => $pm->get_differences($prompts_array),
            'prompts' => array_keys(($pm->array_duplicates($prompts_array)))
        ),
    ), JSON_PRETTY_PRINT);

    echo $json;
}


function validCheck($prompt): bool
{
    $MAXLENGTH = 3000;

    return (strlen($prompt) >= $MAXLENGTH) ? false : true;
}

$test = "white, white, white, white, black, this, word, is, repeated, repeated";

main($_GET["prompts"] ?? $test);
