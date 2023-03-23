<h2>URLs</h2>

<h3 id="get">GET</h3>

<p>Combineer vooral de volgende query parameters:</p>

<ul>
  <li><a href="/api/v1/urls">/api/v1/urls</a></li>
  <li><a href="/api/v1/urls?first=100">/api/v1/urls?first=100</a></li>
  <li><a href="/api/v1/urls?orderBy=url">/api/v1/urls?orderBy=url</a></li>
  <li><a href="/api/v1/urls?direction=DESC">/api/v1/urls?direction=DESC</a></li>
  <li><a href="/api/v1/urls?skip=20">/api/v1/urls?skip=20</a></li>
</ul>

<h3 id="post">POST</h3>

<p>Voeg een nieuwe URL toe, met een referentie naar een Website.</p>

<p>De volgende structuur is vereist:</p>

<pre><code>&lbrace;
	"url": "...",
	"websiteId": "..."
&rbrace;</code></pre>

<p>Met als voorbeeld voor een URL van de Vervoerregio:</p>

<pre><code>&lbrace;
	"url": "https://vervoerregio.nl/pagina/20151221-weg-auto",
	"websiteId": "clf7ymhtc055k0bw0bufs69q3"
&rbrace;</code></pre>

<p>Hou er rekening mee dat een URL uniek moet zijn. Als je een al bestaande URL toevoegt, krijgt je een fout terug (de URL wordt dan dus niet dubbel toegevoegd).</p>

<ul><li>
  <a href="/api/v1/urls">/api/v1/urls</a>
</li></ul>