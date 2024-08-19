<script setup lang="ts">
import vrApiImage from '@/assets/vr-api-id.jpg';
import junalahdotApiImage from '@/assets/junalahdot-api-id.jpg';
import lslApiImage from '@/assets/lsl-api-id.png';
import lprApiImage from '@/assets/lpr-api-id.png';
import locationCity from '@/assets/location-kaupunki.png';

</script>

<template>
  <div class="help-view-container">
    <article class="help-content">

      <h2>Yleisiä käyttöohjeita</h2>

      <p>
        Tekninen dokumentti taustapalveluiden käyttämiseen sekä yleisimpien virhetilanteiden korjaamiseen
        lötytyy <a href="https://version.lab.fi/ovinaytto-tiimi/jubu-aikataulut/-/blob/dev-jari/server/tech-documentation.md">
        JuBun repositoriosta.</a>
      </p>

      <p>
        Projektin lähdekoodit löytyvät osoitteesta:
      </p>
        <ul>
          <li><a href="https://version.lab.fi/ovinaytto-tiimi/jubu-aikataulut">https://version.lab.fi/ovinaytto-tiimi/jubu-aikataulut</a></li>
          <li><a href="https://version.lab.fi/ovinaytto-tiimi/nuc-setup">https://version.lab.fi/ovinaytto-tiimi/nuc-setup</a></li>
        </ul>
      <p>
        Repositoriot eivät ole julkisesti selattavissa. Ota yhteys ylläpitäjään Karri Miettinen
        <a href="mailto:karri.miettinen@lab.fi">karri.miettinen@lab.fi</a>.
      </p>

      <h3>Hallintapaneelin yleisiä ohjeita</h3>
      <ul>
        <li>Jos teet muutoksia hallintapaneelissa, klikkaa lopuksi <span class="yleisohje">Hallinta -> Päivitä välimuisti</span>,
        että muutokset tulevat voimaan.</li>
        <li>Jos jonkin näyttölaitteen IP-osoitetta ei ole ilmoitettu JuBulle, näytetään siinä oletuksena sijaintilistan
          ensimmäisen sijainnin tiedot.</li>
        <li>Juna-näkymiä voi olla vain 1 kerrallaan voimassa. Jos sijainnilla on useampi juna-näkymä, näytetään
          viimeisenä listalla oleva.</li>
      </ul>

      <h2>Pysäkkien hakeminen</h2>

      <p>Julkiset aikataulutiedot haetaan pysäkkitunnuksien perusteella.</p>

      <h3>Juna-asemat</h3>

      <p>Hallintapaneeliin on laitettu valmiiksi Lahden ja Lappeenrannan pysäkkitunnukset.
        Jos haluaa hakea muiden juna-asemien aikataulutietoja, voi niiden pysäkkitunnukset hakea
        esimerkiksi <a href="https://vr.fi">VR:n virallisilta sivuilta</a>,
        tai <a href="https://junalahdot.fi/" target="_blank">Junalähdöt-sivustolta.</a></p>

      <p><a href="https://vr.fi">VR.fi</a> sivuilta voi hakea haluamansa paikkakunnan kohdasta "Mistä". Hakutuloksen
        valitsemisen jälkeen selaimen osoitekentässä lukee sivuston osoite, sekä <em>from=TUNNUS</em>
        Esimerkiksi jos hakee paikkakunnaksi Helsinki, lukee osoiterivillä <em>https://vr.fi/?from=HKI</em>, jolloin
        tunnus on siis HKI. Tämän tunnuksen voi lisätä JuBu-hallintapaneelin juna-tyyppiseen
        näkymään sellaisenaan.
      </p>

      <div class="images-row">
        <img :src="vrApiImage" alt="Screenshot of VR.fi with API key highlighted">
      </div>

      <p><a href="https://junalahdot.fi/" target="_blank">Junalähdöt.fi</a>-sivustolla hakutunnukset
        näkyvät hakutulosten vieressä suluissa.
      </p>

      <div class="images-row">
        <img :src="junalahdotApiImage" alt="Screenshot of junalahdot.fi with API key highlighted">
      </div>

      <h3>Linja-autopysäkit</h3>

      <p>
        Myös linja-autoaikatauluille on laitettu valmiisiin ehdotuksiin Mukkulankadun LAB-ammattikorkeakoulun
        pysäkkitunnukset, sekä Lappeenrannan LUT-yliopiston pysäkin tunnus.

        Lahden linja-autoaikataulujen pysäkkitunnukset muille pysäkeille löytyvät
        LSL:n reittioppaasta, <a href="https://lahti.digitransit.fi" target="_blank">lahti.digitransit.fi</a>.
        Lahden reittioppaassa pysäkkitunnus löytyy useasta eri kohdasta. Minkä tahansa näin löydetyn
        pysäkkitunnuksen voi lisätä JuBu:n pysäkkeihin.
      </p>

      <div class="images-row">
        <img :src="lslApiImage" alt="Screenshot of lahti.digitransit.fi with API keys highlighted">
      </div>

      <p>
        Huom!⚠️ JuBu-hallintapaneelin sijainteihin ilmoitetaan tieto kaupungista. Tätä tietoa käytetään
        sekä linja-autojen aikataulujen hakemiseen, että myös säätietojen sijaintina. Eli kun hakee
        jostain kaupungista aikatauluja, on tärkeää että tämä kaupunki on ilmoitettu oikein
        pysäkkitunnuksen lisäksi.
      </p>

      <div class="images-row">
        <img :src="locationCity" alt="Screenshot of lahti.digitransit.fi with API keys highlighted">
      </div>

      <p>
        Lappeenrannan reittioppaassa,
        <a href="https://lappeenranta.digitransit.fi" target="_blank">lappeenranta.digitransit.fi</a>,
        pysäkkitunnukset löytyvät selaimen osoiteriviltä sen jälkeen, kun on valinnut jonkin pysäkin
        hakutuloksista tai kartalta. A:n jälkeinen (yleensä 6-numeroinen) merkkisarja
        ilmaisee pysäkkitunnusta.
      </p>

      <div class="images-row">
        <img :src="lprApiImage" alt="Screenshot of lahti.digitransit.fi with API keys highlighted">
      </div>

      <h3>Muiden kaupunkien linja-autoaikataulut</h3>

      <p>
        Waltti tarjoaa yhtenäisen rajapinnan aikataulutiedoille, joten periaatteessa myös muiden
        <a href="https://kauppa.waltti.fi/en/content/contact/" target="_blank">Waltin alaisten kaupunkien</a>
        linja-autoaikatauluja voi hakea JuBu:n pysäkkeihin:
      </p>

      <ul>
        <li>Hämeenlinna</li>
        <li>Joensuu</li>
        <li>Jyväskylä</li>
        <li>Kajaani</li>
        <li>Kotka</li>
        <li>Kouvola</li>
        <li>Kuopio</li>
        <li>Lahti</li>
        <li>Lappeenranta</li>
        <li>Mikkeli</li>
        <li>Oulun seutu</li>
        <li>Pori</li>
        <li>Raasepori</li>
        <li>Rovaniemi</li>
        <li>Salo</li>
        <li>Tampere</li>
        <li>Turku</li>
        <li>Vaasa</li>
      </ul>

      <p>
        Eri kaupunkien reittiopastoteutukset eroavat kuitenkin toisistaan enemmän tai vähemmän.
        Esimerkiksi Jyväskylän reittiopas
        <a href="https://jyvaskyla.digitransit.fi" target="_blank">jyvaskyla.digitransit.fi</a>,
        käyttää hakutunnuksessa
        kaupungin nimen sijaan termiä "LINKKI". Jos siis Jyväskylän linja-autoaikatauluja haluaa
        hakea JuBun näkymissä, tulee sijainnin kaupunki-kohtaan kirjoittaa "LINKKI" ilman lainausmerkkejä.
        <em>Tällöin tosin säätietoja ei voida hakea.</em>
      </p>

      <p>
        Yleinen nyrkkisääntö vaikuttaisi olevan, että osoiterivillä näkyy tarvittavan kaupungin <em>nimitunnus</em>, ja
        A-kirjaimen jälkeen <em>pysäkkitunnus</em>.
        <br>
        <br>
        Esimerkkeinä:<br>
        <br>
        Jyväskylän matkakeskuksen pysäkki:
        <a href="https://jyvaskyla.digitransit.fi/pysakit/LINKKI%3A186632" target="_blank">
          https://jyvaskyla.digitransit.fi/pysakit/<strong>LINKKI</strong>%3A<strong>186632</strong><br>
        </a>
        <br>

        Kotkantie 1 Rautatieasema keskustaan:
        <a href="https://kotka.digitransit.fi/pysakit/Kotka%3A155504" target="_blank">
          https://kotka.digitransit.fi/pysakit/<strong>Kotka</strong>%3A<strong>155504</strong>
        </a>
      </p>

    </article>
  </div>
</template>

<style scoped>
.help-view-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.help-content {
  max-width: 60ch;
  width: 100%;
}

article h2 {
  margin-top: 0;
}

h1, h2, h3 {
  text-align: left;
}

p {
  font-size: 0.9em;
  line-height: 1.5;
}

.images-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.images-row img {
  height: auto;
}

a {
  color: #00c1e4;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:visited {
  color: #00c1e4;
  text-decoration: none;
}

img {
  display: block;
  margin: 20px auto;
  max-width: 100%;
  height: auto;
}

strong {
  text-decoration: underline;
}

.yleisohje {
  background-color: #e40067;
  color: white;
}
</style>