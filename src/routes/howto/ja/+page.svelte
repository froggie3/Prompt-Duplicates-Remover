<svelte:head>
    <title>使い方 | Prompt Duplicates Remover</title>
</svelte:head>

<img
    src="../img/ogp/ogp.png"
    width="480"
    alt="Prompts Duplicates Remover"
/>
<h2 id="このツールは何？">このツールは何？</h2>
<p>
    このツールは、プロンプト内に存在する重複した単語を自動的に削除してくれるツールです。
</p>
<p>
    Stable Diffusion
    で画像を生成するにあたっては、関連する単語やフレーズを組み合わせて、プロンプトを自分の好きなように組み立てる必要があります。プロンプトを詠唱することは楽しいですが、一方でプロンプトの単語数が増え、複雑になっていけば行くほど管理は難しくなっていくものです。中には既に重複している単語を再びプロンプトの中に組み込んでしまうことも少なくないはずです。このツールはそういった手間を解消する手助けを行い、重複したトークンを自動的に削除してくれる機能を提供します。
</p>

<h2 id="使い方">使い方</h2>
<p>
    Input のセクションにある「Paste your prompt
    here」に自分が処理したいプロンプトを貼り付けます。
</p>
<img
    src="../img/docs/2023-02-26 133316.png"
    width="480"
    alt="textbox to contain prompts"
/>
<p>
    貼りつけるやいなやプロンプトはすぐに処理され、すぐ隣の空白部分に処理結果が表示されます。自分で選択やコピーするなどして自分の好きなようにしてください。
</p>
<img
    src="../img/docs/2023-02-26 133532.png"
    width="480"
    alt="duplicated prompts marked with red background"
/>
<p>
    「Input」セクションには、「Reduced prompts」と「Total prompts
    removed」がそれぞれ表示されているはずです。「Reduced
    prompts」は削除されたプロンプトの要約で、他方「Total prompts
    removed」は削除された単語の合計数を意味します。
</p>
<img
    src="../img/docs/2023-02-26 133554.png"
    width="480"
    alt="duplicated kind of prompts"
/>

<h2 id="使い方">まだ未対応なプロンプトの種類</h2>
<ul>
    <li>Novel AI のプロンプト</li>
    <li>Prompt Matrix</li>
    <li>Alternating Words</li>
    <li>Dynamic Prompts</li>
    </ul>
<p>
    NAIのプロンプト、例えば <code>()</code> や <code>[]</code> でアテンションの度合いを変更する表記には対応していないので、別のツールを使用して変換したのちにこのツールを適用する必要があります。
</p>
<p>
    また、Dynamic Prompts、Prompt Matrix、さらには Alternating Words
    などで使われる表記にも対応していません。例えば「<code
        >a busy city street in a modern city|illustration|cinematic lighting</code
    >」や「<code>[pig|cow]</code
    >」など、こういったもの入力に対してもおかしな挙動をします。ご留意ください。
</p>
<img
    src="../img/docs/2023-02-26 133316.png"
    width="480"
    alt="textbox to contain prompts"
/>
<p>
    貼りつけるやいなやプロンプトはすぐに処理され、すぐ隣の空白部分に処理結果が表示されます。自分で選択やコピーするなどして自分の好きなようにしてください。
</p>
<img
    src="../img/docs/2023-02-26 133532.png"
    width="480"
    alt="duplicated prompts marked with red background"
/>
<p>
    「Input」セクションには、「Reduced prompts」と「Total prompts
    removed」がそれぞれ表示されているはずです。「Reduced
    prompts」は削除されたプロンプトの要約で、他方「Total prompts
    removed」は削除された単語の合計数を意味します。
</p>
<img
    src="../img/docs/2023-02-26 133554.png"
    width="480"
    alt="duplicated kind of prompts"
/>

<h2 id="よくある質問と答え">よくある質問と答え</h2>
<dl>
    <dt>
        <p>入力したプロンプトが外部にもれてしまうことはありますか？</p>
    </dt>
    <dd>
        <p>
            ありません。プロンプトの処理は全てブラウザ内で完結させるようにしています。そのため、最終的に入力したプロンプトが外部に漏れるようなことはありえません。
        </p>
    </dd>
    <dt>
        <p>入力欄の下のチェックボックスはなんですか？</p>
        <img
            src="../img/docs/2023-02-26 133419.png"
            width="480"
            alt="checkboxes shown below"
        />
    </dt>
    <dd>
        <p>
            入力された不揃いなプロンプトをある程度整えることができるオプションです。それぞれ「remove
            breaks」では、入力中に混じった不必要な改行を除去でき、「add space
            before comma」では、プロンプトをカンマ（,）とスペース（
            ）で区切るようにできます。チェックボックスに一つでもチェックを入れると、右隣にボタンが自動的に出現するので、ボタンを押すと処理できます。なお、プロンプトが空白の状態で処理しても意味がないので、その場合は単純にアラートを出すようになっています。
        </p>
    </dd>
</dl>

<style>
    p + img,
    img {
        display: block;
        width: 100%;
        margin-bottom: 1em;
    }

    h2,
    ul,
    p {
        margin-bottom: 1em;
    }
    ul {
        padding-left: 1.5em;
    }
</style>
