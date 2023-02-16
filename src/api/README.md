# 関数の説明

自分用。

## array_duplicates() の仕組み

`array_count_values($array)` でこんな感じの配列にする。

```plain
Array
(
    [white] => 4  // 重複
    [black] => 1
    [this] => 1
    [word] => 1
    [is] => 1
    [repeated] => 2 // 重複
)
```

重複していないもの（`1` の値を持つアイテム）だけ消したあと、自分自身のカウントは必要ないので重複しているものもそれぞれ `-1` する。

```plain
Array
(
    [white] => 3  // 重複
    [repeated] => 1 // 重複
)
```

## get_differences()

`white` を 3 回、`repeated`を 1 回出力用の配列に追加する。
