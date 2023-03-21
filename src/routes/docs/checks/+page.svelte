<h2>Checks</h2>

<h3 id="get">GET</h3>

<ul><li>
  <a href="/api/v1/checks">/api/v1/checks</a>
</li></ul>

<h3 id="post">POST</h3>

<p>Voeg een nieuwe Check toe, met een referentie naar een URL en naar één of meerdere Succescriteria.</p>

<p>De volgende structuur is vereist:</p>

<pre><code>&lbrace;
  "urlId": "...",
  "succescriteriaIds": ["...","..."]
&rbrace;</code></pre>

<p>Met als voorbeeld voor een Check op een URL van de Vervoerregio:</p>

<pre><code>&lbrace;
  "urlId": "clf7zms5va5670bw8rb7gwll2",
  "succescriteriaIds": [
    "clf14be4z1b680bw8e36pnlix",
    "clf14bm391bt70aw4ysfmkv6l",
    "clf14ei521bbl0bw8d7hpxq87"
  ]
&rbrace;</code></pre>

<ul><li>
  <a href="/api/v1/checks">/api/v1/checks</a>
</li></ul>