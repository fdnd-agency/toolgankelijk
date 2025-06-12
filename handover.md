# Toolgankelijk Handover

Dit bestand bevat de handover voor het project Toolgankelijk voor Vervoerregio Amsterdam.

## Wat is de huidige status van het project?

Het project geeft je de optie om een partner toe te voegen op de home pagina, dit opent een formulier waarin je de nodige informatie kan invullen maar ook kan aanvinken om de sitemap op te halen.
Als een partner is toegevoegd kan je de partner bewerken, verwijderen (dit verwijderd ook alle urls van de partner als die er zijn) en een audit starten, dit houdt in dat alle urls worden gecheckt op de WCAG richtlijnen.
Wanneer je op een partner klikt krijgt je alle urls te zien van de partner, als er meer dan 20 urls zijn dan heb je ook een navigatie menu voor het navigeren tussen alle url pagina's van de partner.
Ook de urls kan je net als de partner bewerken en verwijderen.
Als je op een url klikt krijg je de optie om een principe aan te klikken die je vervolgens brengt naar alle richtlijnen op basis van de niveaus: A, AA, AAA.
Elke niveau heeft een lijst van richtlijnen die je kan openen en die dan een lijst tonen van criteria die je kan aanvinken en opslaan.
Wanneer een criteria is opgeslagen dan wordt het percentage in de voortgangsbalk aagepast om aan te geven dat er iets is ingevuld.
Tijdens het ophalen van de sitemap en/of het auditen van de partner wordt er een loading state gegeven met een array van logs die aangeven wat er stap voor stap op de back-end gebeurt voor optimale feedback aan de gebruiker.

## Wat zijn de belangrijkste features die al werken?

Het ophalen van de sitemap van een partner door alle mogelijke url paden te checken met als fallback de link elementen values ophalen en dan opslaan in Hygraph.
Een audit kunnen starten voor een partner die alle urls checkt op de WCAG richtlijnen
en die dan aanpast in Hygraph en ook daadwerkelijk te criteria aancheckt in de applicatie.
Je kan ook als gebruiker kunnen registreren en inloggen hierbij zit ook een email verificatie waarbij je ingevoerde email deel moet zijn van de partners die toegestaan zijn (@vervoerregio, @ebs...) op Hygraph.

## Wat zijn de grootste aandachtspunten of uitdagingen?

Hygraph heeft een rate limiet en kan ook maar 10 items max fetchen hierdoor hebben we de code moeten aanpassen om rekening te houden met delays maar ook parameters zoals first en skip moeten meegeven in queries om meerdere items te kunnen ophalen.
Als er een mogelijkheid is om een andere database te gebruiken dan Hygraph zonder rate limiet of met een hogere rate limiet en geen item limiet dan kan de applicatie sneller draaien en worden daardoor de audit en sitemap checks sneller uitgevoerd.
Daarnaast draait het project nog op een oudere versie van SvelteKit wat niet optimaal is, als dit ook
kan worden overgezet naar de nieuwe versie kan je beter gebruik maken van alle handige nieuwe features van
SvelteKit.
Het is ook nodig om niveau A van de richtlijnen niet te tonen omdat een website moet voldoen aan minstens niveau AA.

## Wat wordt aangeraden als eerste stap voor het volgende team?

Wij raden aan om te focussen op het verwerken van het nieuwe ontwerp in de code
zodat de website voldoet aan de eisen van de opdrachtgever om het toegankelijk
te maken door kleuren te gebruiken met een beter contrast.
Pas het global CSS bestand aan om doormiddel van custom properties de kleuren
toe te voegen met behulp van HSL values.
Daarna is het belangrijk om elke component apart aan te passen om te voldoen
aan het nieuw ontwerp.
Als het nieuwe ontwerp is verwerkt in de code is het aan te raden om te kijken of je
als team het project kan overzetten naar de nieuwe versie van SvelteKit of te werken
aan een database met geen rate limiet om vertragingen in requests te vermijden.
