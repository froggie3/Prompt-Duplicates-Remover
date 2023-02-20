# Prompt Duplicates Remover

<img src="../artworks/screenshot.png" alt="このツールのスクリーンショット" />

## このツールは何？

プロンプト内に存在する重複した単語を自動的に削除してくれるツール。

Stable Diffusion で画像を生成するにあたっては、関連する単語やフレーズを組み合わせて、プロンプトを自分の好きなように組み立てる必要があります。これはしばしば Prompt Engineering と呼称されますが、プロンプトの単語数が増え、複雑になっていけば行くほどふつう管理は難しくなっていくものです。中には既に重複している単語を再びプロンプトの中に組み込んでしまうことも少なくないはずです。このツールはそういった手間を解消する手助けを行い、重複したトークンを自動的に削除してくれる機能を提供します。

## 使い方

Input のセクションにある「Paste your prompt here」に自分が処理したいプロンプトを貼り付けます。貼りつけるやいなやプロンプトはすぐに処理され、すぐ隣の空白部分に処理結果が表示されます。自分で選択やコピーするなどして自分の好きなようにしてください。

「Input」セクションには、「Reduced prompts」と「Total prompts removed」がそれぞれ表示されているはずです。それぞれ、「Reduced prompts」は削除されたプロンプトの要約で、他方「Total prompts removed」は削除された単語の合計数を意味します。

## よくある質問と答え

<dl>
  <dt>
    <p>
      入力したプロンプトが外部にもれてしまうことはありますか？
    </p>
  </dt>
  <dd>
    <p>
      ありません。少し前まで内部処理を PHP で作成しており、自作のAPIを叩く必要がありましたが、現行のバージョンでは処理を全てブラウザ内で完結させるようにしています。そのため、最終的に入力したプロンプトが外部に漏れるようなことはありえません。  
    </p>
  </dd>
  <dt>
    <p>
      入力欄の下のチェックボックスはなんですか？
    </p>
  </dt>
  <dd>
    <p>
      入力された不揃いなプロンプトをある程度整えることができるオプションです。それぞれ「remove breaks」では、入力中に混じった不必要な改行を除去できます。「add space before comma」では、プロンプトをカンマ（,）とスペース（ ）で区切るようにできます。チェックボックスに一つでもチェックを入れると、右隣にボタンが自動的に出現するので、ボタンを押すと処理できます。なお、プロンプトが空白の状態で処理しても意味がないので、その場合は単純にアラートを出すようになっています。
    </p>
  </dd>
</dl>