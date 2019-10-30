[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/joln17/trading-react/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/joln17/trading-react/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/joln17/trading-react/badges/build.png?b=master)](https://scrutinizer-ci.com/g/joln17/trading-react/build-status/master)

# Frontend för tradingprojektet i jsramverk
En React-frontend för att att visa priser för kryptovalutor. Tänkt att användas tillsammans med backend-repona [trading-API](https://github.com/joln17/trading-api) för konto och depåhantering och [trading-ws](https://github.com/joln17/trading-ws) för att erhålla realtidspriser på valutorna.

## Tillgängliga skript
I projektets rotkategori kan följande kommandon köras:

* `npm start` Kör i utvecklingsläge.
* `npm test` Kör tester med Mocha.
* `npm run build` Bygg produktionsversion.
* `npm run deploy` Bygg produktionsversion och gör en deploy till droplet.

## Teknikval
Sidan är byggd med [React](https://www.npmjs.com/package/react) och [React Bootstrap](https://www.npmjs.com/package/react-bootstrap). För att hantera routing används [React Router DOM](https://www.npmjs.com/package/react-router-dom) och för att visa diagram används [Recharts](https://www.npmjs.com/package/recharts).

React med React Bootstrap är samma kombination som jag använt för Me-sidan tidigare i kursen vilket har fungerat väl så jag valde att använda dem även i projektet. För att hitta ett lämpligt bibliotek att hantera diagram i React läste jag ett par olika jämförande artiklar bl.a. [denna på Void Canvas](http://voidcanvas.com/top-10-react-graph-chart-libraries-with-demo/). Valet föll på Recharts baserat på att det tycktes vara populärt och ha ett väl [dokumenterat API](http://recharts.org/en-US/api). Jag upplevde också att det var ganska lätt att konfigurera Recharts för att rita önskad graf. Däremot tycks rendering av diagrammen vara ganska CPU-krävande så med lite mer tid hade jag undersökt om något annat alternativ hade varit bättre på den punkten.

## Om sajten
Sajten är uppdelad i följande sidor och komponenter:
* [Sajtens förstasida](https://trading.joln17.me/) som visar en tabell med de senaste kurserna i realtid för några utvalda kryptovalutor. (Källkod i [src/components/Listings](https://github.com/joln17/trading-react/tree/master/src/components/Listings)).
* [Kursutveckling och handelssida](https://trading.joln17.me/asset/bitcoin) för en enskild valuta. För att handla krävs inloggning. (Källkod i [src/components/Asset](https://github.com/joln17/trading-react/tree/master/src/components/Asset)).
* [Inloggningssida](https://trading.joln17.me/login). (Källkod i [src/components/Auth](https://github.com/joln17/trading-react/tree/master/src/components/Auth)).
* [Registreringssida](https://trading.joln17.me/register). (Källkod i [src/components/Registration](https://github.com/joln17/trading-react/tree/master/src/components/Registration)).
* [Sida för innehav](https://trading.joln17.me/holdings) som visar de kryptovalutor som köpts, procentuell avkastning samt tillgängligt saldo och totalt värde. (Källkod i [src/components/Account](https://github.com/joln17/trading-react/tree/master/src/components/Account)).
* [Sida för insättning](https://trading.joln17.me/deposit) av pengar i USD. (Källkod i [src/components/Account](https://github.com/joln17/trading-react/tree/master/src/components/Account)).

## Tester
Fem funktionstester med Selenium finns i [test-katalogen](https://github.com/joln17/trading-react/tree/master/test):

1. Går till förstasidan och kontrollerar att länk och rubrik stämmer.
2. Klickar på länken för Bitcoin-valutan från förstasidan och kontrollerar att länk och rubrik för sidan som man hamnar på stämmer.
3. Klickar på länken till inloggningssidan och kontrollerar att man hamnar på sidan för att logga in.
4. Genomför inloggning med en testanvändare och kontrollerar att man hamnar på sidan för testanvändarens innehav efter inloggning.
5. Klickar på logga ut och kontrollerar att man åter hamnar på inloggningssidan.

Notera att testerna körs live mot publika sidan. Jag valde att göra så för att förenkla testproceduren då jag begränsat åtkomst till API:et och WS-servern till bara trading.joln17.me.
