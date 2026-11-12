/* L'Atelier de Boulon — données géographiques (séparées de l'interface).
   Une ligne par pays ou territoire :
   identifiant (ISO numérique) | code drapeau | nom | capitale | continent | latitude | longitude | anecdote 1 ; anecdote 2 | type
   type : (vide) = pays, T:<pays> = territoire rattaché, D = statut discuté (pas de question de jeu), C = continent sans pays.
   Le Sahara occidental est rattaché au Maroc (choix de l'auteur). */
"use strict";
(function () {
  const CONTINENTS = {
    AF: { nom: "Afrique", art: "l'", couleur: "#f08a3c", desc: "Un continent très chaud, avec le grand désert du Sahara, la savane et la forêt équatoriale." },
    EU: { nom: "Europe", art: "l'", couleur: "#5bc0eb", desc: "Un petit continent avec beaucoup de pays, de vieilles villes et de châteaux." },
    AS: { nom: "Asie", art: "l'", couleur: "#ef7fa8", desc: "Le plus grand continent : on y trouve les plus hautes montagnes et le plus d'habitants." },
    NA: { nom: "Amérique du Nord", art: "l'", couleur: "#f6c445", desc: "Du Grand Nord glacé jusqu'aux plages des Caraïbes, en passant par l'Amérique centrale." },
    SA: { nom: "Amérique du Sud", art: "l'", couleur: "#7bc950", desc: "Le continent de la forêt amazonienne et de la cordillère des Andes." },
    OC: { nom: "Océanie", art: "l'", couleur: "#8e6cc9", desc: "L'Australie et des milliers d'îles dans l'océan Pacifique." },
    AN: { nom: "Antarctique", art: "l'", couleur: "#e8f4fb", desc: "Le continent le plus froid, couvert de glace, au pôle Sud." },
  };

  const DATA = `
004|af|Afghanistan|Kaboul|AS|34.53|69.17||
008|al|Albanie|Tirana|EU|41.33|19.82||
010|aq|Antarctique|—|AN|||C'est le continent le plus froid : il est presque entièrement couvert de glace. ; Des manchots et des phoques y vivent, mais aucun pays n'y a de ville.|C
012|dz|Algérie|Alger|AF|36.75|3.06|C'est le plus grand pays d'Afrique. ; Le désert du Sahara couvre la plus grande partie du pays.|
016|as|Samoa américaines|—|OC|||Ce sont des îles du Pacifique qui dépendent des États-Unis.|T:États-Unis
020|ad|Andorre|Andorre-la-Vieille|EU|42.51|1.52|Ce petit pays est caché dans les montagnes des Pyrénées, entre la France et l'Espagne.|
024|ao|Angola|Luanda|AF|-8.84|13.23||
028|ag|Antigua-et-Barbuda|Saint John's|NA|17.12|-61.85|On dit qu'il y a une plage pour chaque jour de l'année !|
031|az|Azerbaïdjan|Bakou|AS|40.41|49.87|Il borde la mer Caspienne, la plus grande étendue d'eau fermée du monde.|
032|ar|Argentine|Buenos Aires|SA|-34.60|-58.38|Les chutes d'Iguazú, à la frontière avec le Brésil, sont parmi les plus grandes du monde. ; Au sud, la Patagonie est une région de vent et de glaciers.|
036|au|Australie|Canberra|OC|-35.28|149.13|Les kangourous et les koalas vivent en Australie. ; La Grande Barrière de corail est le plus grand récif de corail du monde.|
040|at|Autriche|Vienne|EU|48.21|16.37|Le célèbre compositeur Mozart y est né. ; Les montagnes des Alpes couvrent une grande partie du pays.|
044|bs|Bahamas|Nassau|NA|25.05|-77.35|Ce pays est formé de centaines d'îles aux eaux turquoise.|
048|bh|Bahreïn|Manama|AS|26.23|50.59|C'est un petit pays formé d'îles dans le golfe Persique.|
050|bd|Bangladesh|Dacca|AS|23.81|90.41|Le tigre du Bengale vit dans la grande forêt des Sundarbans.|
051|am|Arménie|Erevan|AS|40.18|44.51||
052|bb|Barbade|Bridgetown|NA|13.10|-59.62||
056|be|Belgique|Bruxelles|EU|50.85|4.35|Elle est célèbre pour ses frites, ses gaufres, son chocolat et ses bandes dessinées.|
060|bm|Bermudes|—|NA|||Ces îles de l'océan Atlantique dépendent du Royaume-Uni.|T:Royaume-Uni
064|bt|Bhoutan|Thimphou|AS|27.47|89.64|Ce petit royaume est perché dans les montagnes de l'Himalaya.|
068|bo|Bolivie|Sucre|SA|-19.04|-65.26|Sucre est la capitale officielle, mais le gouvernement travaille à La Paz. ; Le salar d'Uyuni est un immense désert de sel tout blanc.|
070|ba|Bosnie-Herzégovine|Sarajevo|EU|43.86|18.41||
072|bw|Botswana|Gaborone|AF|-24.63|25.92|Le delta de l'Okavango accueille beaucoup d'éléphants.|
076|br|Brésil|Brasília|SA|-15.79|-47.88|C'est le plus grand pays d'Amérique du Sud. ; La forêt amazonienne couvre une grande partie du pays.|
084|bz|Belize|Belmopan|NA|17.25|-88.77||
086|io|Territoire britannique de l'océan Indien|—|AS|||Ce sont de petites îles de l'océan Indien qui dépendent du Royaume-Uni.|T:Royaume-Uni
090|sb|Îles Salomon|Honiara|OC|-9.43|159.95||
092|vg|Îles Vierges britanniques|—|NA|||Ces îles des Caraïbes dépendent du Royaume-Uni.|T:Royaume-Uni
096|bn|Brunei|Bandar Seri Begawan|AS|4.90|114.94||
100|bg|Bulgarie|Sofia|EU|42.70|23.32||
104|mm|Birmanie|Naypyidaw|AS|19.76|96.08|Ce pays s'appelle aussi le Myanmar.|
108|bi|Burundi|Gitega|AF|-3.43|29.93||
112|by|Biélorussie|Minsk|EU|53.90|27.57||
116|kh|Cambodge|Phnom Penh|AS|11.56|104.92|Le temple d'Angkor Vat est dessiné sur son drapeau.|
120|cm|Cameroun|Yaoundé|AF|3.85|11.50|On l'appelle « l'Afrique en miniature » car on y trouve presque tous les paysages d'Afrique.|
124|ca|Canada|Ottawa|NA|45.42|-75.70|C'est le deuxième plus grand pays du monde. ; On y parle anglais et français.|
132|cv|Cap-Vert|Praia|AF|14.93|-23.51|Ce pays est formé de dix îles volcaniques au milieu de l'océan Atlantique.|
136|ky|Îles Caïmans|—|NA|||Ces îles des Caraïbes dépendent du Royaume-Uni.|T:Royaume-Uni
140|cf|Centrafrique|Bangui|AF|4.39|18.56||
144|lk|Sri Lanka|Sri Jayawardenepura Kotte|AS|6.89|79.90|C'est une île célèbre pour son thé.|
148|td|Tchad|N'Djaména|AF|12.13|15.06|Le lac Tchad est devenu beaucoup plus petit en quelques dizaines d'années.|
152|cl|Chili|Santiago|SA|-33.45|-70.67|C'est un pays très long et très étroit. ; Le désert d'Atacama est l'un des endroits les plus secs du monde.|
156|cn|Chine|Pékin|AS|39.90|116.40|La Grande Muraille de Chine mesure des milliers de kilomètres. ; Les pandas géants vivent dans ses forêts de bambous.|
158|tw|Taïwan|Taipei|AS|25.03|121.56||D
170|co|Colombie|Bogota|SA|4.71|-74.07|On y cultive beaucoup de café.|
174|km|Comores|Moroni|AF|-11.70|43.26|Ce pays est formé d'îles volcaniques dans l'océan Indien.|
178|cg|Congo|Brazzaville|AF|-4.27|15.28|Brazzaville est juste en face de Kinshasa, de l'autre côté du fleuve Congo.|
180|cd|République démocratique du Congo|Kinshasa|AF|-4.32|15.31|Le fleuve Congo, très puissant, traverse le pays. ; Ses forêts abritent des gorilles et des okapis.|
184|ck|Îles Cook|—|OC|||Ces îles du Pacifique sont associées à la Nouvelle-Zélande.|T:Nouvelle-Zélande
188|cr|Costa Rica|San José|NA|9.93|-84.09|On peut voir des paresseux dans ses forêts.|
191|hr|Croatie|Zagreb|EU|45.81|15.98|Sa côte sur la mer Adriatique compte plus de mille îles.|
192|cu|Cuba|La Havane|NA|23.11|-82.37|C'est la plus grande île des Caraïbes.|
196|cy|Chypre|Nicosie|EU|35.17|33.36|C'est une île de la mer Méditerranée.|
203|cz|Tchéquie|Prague|EU|50.08|14.44||
204|bj|Bénin|Porto-Novo|AF|6.50|2.60||
208|dk|Danemark|Copenhague|EU|55.68|12.57|Les célèbres briques LEGO y ont été inventées.|
212|dm|Dominique|Roseau|NA|15.30|-61.39||
214|do|République dominicaine|Saint-Domingue|NA|18.49|-69.93|Elle partage l'île d'Hispaniola avec Haïti.|
218|ec|Équateur|Quito|SA|-0.18|-78.47|La ligne de l'équateur traverse le pays : c'est de là que vient son nom. ; Les îles Galápagos, avec leurs tortues géantes, lui appartiennent.|
222|sv|Salvador|San Salvador|NA|13.69|-89.22|C'est le plus petit pays d'Amérique centrale.|
226|gq|Guinée équatoriale|Malabo|AF|3.75|8.78||
231|et|Éthiopie|Addis-Abeba|AF|9.03|38.74|On y boit du café depuis des siècles.|
232|er|Érythrée|Asmara|AF|15.32|38.93||
233|ee|Estonie|Tallinn|EU|59.44|24.75||
234|fo|Îles Féroé|—|EU|||Ces îles de l'Atlantique Nord dépendent du Danemark.|T:Danemark
238|fk|Îles Malouines|—|SA|||Ces îles dépendent du Royaume-Uni ; l'Argentine les réclame.|T:Royaume-Uni
239|gs|Géorgie du Sud-et-les îles Sandwich du Sud|—|SA|||Ces îles froides de l'Atlantique Sud dépendent du Royaume-Uni.|T:Royaume-Uni
242|fj|Fidji|Suva|OC|-18.14|178.44|Ce pays est formé de plus de 300 îles.|
246|fi|Finlande|Helsinki|EU|60.17|24.94|Ce pays compte des milliers de lacs.|
248|ax|Åland|—|EU|||Ces îles de la mer Baltique dépendent de la Finlande.|T:Finlande
250|fr|France|Paris|EU|48.86|2.35|La tour Eiffel, à Paris, mesure environ 330 mètres de haut. ; La Guyane, en Amérique du Sud, fait aussi partie de la France.|
258|pf|Polynésie française|—|OC|||Ce sont des îles du Pacifique, comme Tahiti, qui dépendent de la France.|T:France
260|tf|Terres australes françaises|—|AN|||Ces îles froides du sud de l'océan Indien dépendent de la France.|T:France
262|dj|Djibouti|Djibouti|AF|11.59|43.15||
266|ga|Gabon|Libreville|AF|0.42|9.47|La forêt couvre presque tout le pays.|
268|ge|Géorgie|Tbilissi|AS|41.72|44.79||
270|gm|Gambie|Banjul|AF|13.45|-16.58|C'est le plus petit pays d'Afrique continentale : il suit le fleuve Gambie.|
275|ps|Palestine|—|AS|||Le statut de ce territoire est discuté.|D
276|de|Allemagne|Berlin|EU|52.52|13.40|C'est le pays le plus peuplé de l'Union européenne.|
288|gh|Ghana|Accra|AF|5.60|-0.19|Le lac Volta est l'un des plus grands lacs créés par l'homme.|
296|ki|Kiribati|Tarawa|OC|1.33|172.98||
300|gr|Grèce|Athènes|EU|37.98|23.73|Les premiers Jeux olympiques ont eu lieu en Grèce, il y a très longtemps.|
304|gl|Groenland|—|NA|||C'est la plus grande île du monde, presque entièrement couverte de glace. ; Il dépend du Danemark.|T:Danemark
308|gd|Grenade|Saint-Georges|NA|12.06|-61.75|On l'appelle « l'île aux épices » grâce à sa noix de muscade.|
316|gu|Guam|—|OC|||Cette île du Pacifique dépend des États-Unis.|T:États-Unis
320|gt|Guatemala|Guatemala|NA|14.63|-90.51|Les Mayas y ont construit de grandes cités dans la jungle.|
324|gn|Guinée|Conakry|AF|9.64|-13.58||
328|gy|Guyana|Georgetown|SA|6.80|-58.16||
332|ht|Haïti|Port-au-Prince|NA|18.59|-72.31|On y parle le français et le créole haïtien.|
334|hm|Îles Heard-et-MacDonald|—|AN|||Ces îles glacées dépendent de l'Australie.|T:Australie
336|va|Vatican|Vatican|EU|41.90|12.45|C'est le plus petit pays du monde : il se trouve au milieu de la ville de Rome.|
340|hn|Honduras|Tegucigalpa|NA|14.07|-87.19||
344|hk|Hong Kong|—|AS|||C'est une grande ville de Chine avec des gratte-ciel au bord de la mer.|T:Chine
348|hu|Hongrie|Budapest|EU|47.50|19.04|Le Rubik's Cube a été inventé en Hongrie. ; Le Danube traverse Budapest.|
352|is|Islande|Reykjavik|EU|64.15|-21.94|On y trouve des volcans, des glaciers et des geysers qui crachent de l'eau chaude.|
356|in|Inde|New Delhi|AS|28.61|77.21|C'est le pays le plus peuplé du monde. ; Le Taj Mahal est un célèbre monument de marbre blanc.|
360|id|Indonésie|Jakarta|AS|-6.21|106.85|Ce pays compte plus de 17 000 îles. ; Les dragons de Komodo, de très grands lézards, y vivent.|
364|ir|Iran|Téhéran|AS|35.69|51.39|Les tapis persans sont célèbres dans le monde entier.|
368|iq|Irak|Bagdad|AS|33.31|44.36|C'est là, entre les fleuves Tigre et Euphrate, qu'est née l'une des premières écritures, il y a plus de 5 000 ans.|
372|ie|Irlande|Dublin|EU|53.35|-6.26|On l'appelle « l'île d'Émeraude » à cause de ses prairies très vertes.|
376|il|Israël|—|AS|||Le statut de sa capitale est discuté.|D
380|it|Italie|Rome|EU|41.90|12.50|Sa forme ressemble à une botte ! ; À Venise, on se déplace en bateau sur les canaux.|
384|ci|Côte d'Ivoire|Yamoussoukro|AF|6.83|-5.29|C'est l'un des plus grands producteurs de cacao, qui sert à faire le chocolat.|
388|jm|Jamaïque|Kingston|NA|17.97|-76.79||
392|jp|Japon|Tokyo|AS|35.68|139.69|Le Japon est formé de milliers d'îles. ; Le mont Fuji est un volcan couvert de neige.|
398|kz|Kazakhstan|Astana|AS|51.17|71.45|C'est le plus grand pays du monde qui n'a pas d'accès à l'océan.|
400|jo|Jordanie|Amman|AS|31.95|35.93|La cité de Pétra a été taillée directement dans la roche rose.|
404|ke|Kenya|Nairobi|AF|-1.29|36.82|On peut y voir d'immenses troupeaux de zèbres et de gnous dans la savane.|
408|kp|Corée du Nord|Pyongyang|AS|39.04|125.76||
410|kr|Corée du Sud|Séoul|AS|37.57|126.98||
414|kw|Koweït|Koweït|AS|29.38|47.99||
417|kg|Kirghizistan|Bichkek|AS|42.87|74.59|Les montagnes couvrent la plus grande partie du pays.|
418|la|Laos|Vientiane|AS|17.97|102.63|Le grand fleuve Mékong traverse le pays.|
422|lb|Liban|Beyrouth|AS|33.89|35.50|Un grand arbre, le cèdre, est dessiné sur son drapeau.|
426|ls|Lesotho|Maseru|AF|-29.31|27.48|Ce pays est entièrement entouré par l'Afrique du Sud.|
428|lv|Lettonie|Riga|EU|56.95|24.11||
430|lr|Liberia|Monrovia|AF|6.30|-10.80||
434|ly|Libye|Tripoli|AF|32.89|13.19|Le désert du Sahara couvre presque tout le pays.|
438|li|Liechtenstein|Vaduz|EU|47.14|9.52|Ce tout petit pays se trouve entre la Suisse et l'Autriche.|
440|lt|Lituanie|Vilnius|EU|54.69|25.28||
442|lu|Luxembourg|Luxembourg|EU|49.61|6.13|C'est l'un des plus petits pays d'Europe.|
446|mo|Macao|—|AS|||C'est une ville de Chine au bord de la mer.|T:Chine
450|mg|Madagascar|Antananarivo|AF|-18.88|47.51|Les lémuriens, de drôles de petits primates, ne vivent qu'à Madagascar. ; C'est une grande île de l'océan Indien.|
454|mw|Malawi|Lilongwe|AF|-13.96|33.79|Le lac Malawi abrite des centaines d'espèces de poissons colorés.|
458|my|Malaisie|Kuala Lumpur|AS|3.14|101.69|Les tours Petronas, à Kuala Lumpur, sont deux tours jumelles très hautes.|
462|mv|Maldives|Malé|AS|4.18|73.51|Ce pays est formé de plus de mille petites îles très basses.|
466|ml|Mali|Bamako|AF|12.64|-8.00|La ville de Tombouctou était autrefois un grand centre de savoir, avec de nombreux livres anciens.|
470|mt|Malte|La Valette|EU|35.90|14.51|Ce pays est formé de petites îles au milieu de la mer Méditerranée.|
478|mr|Mauritanie|Nouakchott|AF|18.08|-15.98|Une grande partie du pays est couverte par le désert du Sahara.|
480|mu|Maurice|Port-Louis|AF|-20.16|57.50|Le dodo, un gros oiseau qui ne volait pas, vivait autrefois sur cette île.|
484|mx|Mexique|Mexico|NA|19.43|-99.13|Les Mayas et les Aztèques y ont construit de grandes pyramides.|
492|mc|Monaco|Monaco|EU|43.73|7.42|C'est le deuxième plus petit pays du monde.|
496|mn|Mongolie|Oulan-Bator|AS|47.89|106.91|Beaucoup d'habitants vivent dans des tentes rondes appelées yourtes.|
498|md|Moldavie|Chisinau|EU|47.01|28.86||
499|me|Monténégro|Podgorica|EU|42.44|19.26||
500|ms|Montserrat|—|NA|||Cette petite île volcanique des Caraïbes dépend du Royaume-Uni.|T:Royaume-Uni
504|ma|Maroc|Rabat|AF|34.02|-6.84|On y trouve les montagnes de l'Atlas et une partie du désert du Sahara. ; Le thé à la menthe y est la boisson de bienvenue.|
508|mz|Mozambique|Maputo|AF|-25.97|32.57||
512|om|Oman|Mascate|AS|23.59|58.41||
516|na|Namibie|Windhoek|AF|-22.56|17.08|Le désert du Namib possède certaines des plus hautes dunes de sable du monde.|
520|nr|Nauru|Yaren|OC|-0.55|166.92|C'est l'un des plus petits pays du monde : une seule petite île.|
524|np|Népal|Katmandou|AS|27.72|85.32|Le mont Everest, la plus haute montagne du monde, se trouve à sa frontière avec la Chine.|
528|nl|Pays-Bas|Amsterdam|EU|52.37|4.90|Une grande partie du pays est plus basse que le niveau de la mer. ; On y voit beaucoup de moulins et de champs de tulipes.|
531|cw|Curaçao|—|NA|||Cette île des Caraïbes fait partie du royaume des Pays-Bas.|T:Pays-Bas
533|aw|Aruba|—|NA|||Cette île des Caraïbes fait partie du royaume des Pays-Bas.|T:Pays-Bas
534|sx|Saint-Martin (partie néerlandaise)|—|NA|||Cette moitié d'île fait partie du royaume des Pays-Bas ; l'autre moitié est française.|T:Pays-Bas
540|nc|Nouvelle-Calédonie|—|OC|||Cette île du Pacifique dépend de la France.|T:France
548|vu|Vanuatu|Port-Vila|OC|-17.73|168.32||
554|nz|Nouvelle-Zélande|Wellington|OC|-41.29|174.78|Le kiwi, un oiseau qui ne vole pas, est le symbole du pays.|
558|ni|Nicaragua|Managua|NA|12.11|-86.24|On y trouve de nombreux volcans et deux grands lacs.|
562|ne|Niger|Niamey|AF|13.51|2.11|Le fleuve Niger lui a donné son nom.|
566|ng|Nigeria|Abuja|AF|9.08|7.40|C'est le pays le plus peuplé d'Afrique.|
570|nu|Niue|—|OC|||Cette île du Pacifique est associée à la Nouvelle-Zélande.|T:Nouvelle-Zélande
574|nf|Île Norfolk|—|OC|||Cette petite île du Pacifique dépend de l'Australie.|T:Australie
578|no|Norvège|Oslo|EU|59.91|10.75|En été, tout au nord, le soleil ne se couche presque pas.|
580|mp|Îles Mariannes du Nord|—|OC|||Ces îles du Pacifique dépendent des États-Unis.|T:États-Unis
583|fm|Micronésie|Palikir|OC|6.92|158.16||
584|mh|Îles Marshall|Majuro|OC|7.12|171.18||
585|pw|Palaos|Ngerulmud|OC|7.50|134.62||
586|pk|Pakistan|Islamabad|AS|33.68|73.05|Le K2, deuxième plus haute montagne du monde, se trouve à sa frontière avec la Chine.|
591|pa|Panama|Panama|NA|8.98|-79.52|Le canal de Panama permet aux bateaux de passer de l'océan Atlantique à l'océan Pacifique.|
598|pg|Papouasie-Nouvelle-Guinée|Port Moresby|OC|-9.44|147.18|On y parle plus de 800 langues différentes !|
600|py|Paraguay|Asuncion|SA|-25.26|-57.58||
604|pe|Pérou|Lima|SA|-12.05|-77.04|La cité inca de Machu Picchu est perchée en haut des montagnes.|
608|ph|Philippines|Manille|AS|14.60|120.98|Ce pays est formé de plus de 7 000 îles.|
612|pn|Îles Pitcairn|—|OC|||Ces îles très isolées du Pacifique dépendent du Royaume-Uni.|T:Royaume-Uni
616|pl|Pologne|Varsovie|EU|52.23|21.01|La grande scientifique Marie Curie est née à Varsovie.|
620|pt|Portugal|Lisbonne|EU|38.72|-9.14|Il y a plus de 500 ans, les navigateurs portugais ont exploré les océans.|
624|gw|Guinée-Bissau|Bissau|AF|11.86|-15.60||
626|tl|Timor oriental|Dili|AS|-8.56|125.56||
630|pr|Porto Rico|—|NA|||Cette île des Caraïbes dépend des États-Unis.|T:États-Unis
634|qa|Qatar|Doha|AS|25.29|51.53||
642|ro|Roumanie|Bucarest|EU|44.43|26.10|Les montagnes des Carpates traversent le pays.|
643|ru|Russie|Moscou|EU|55.76|37.62|C'est le plus grand pays du monde : il s'étend sur l'Europe et sur l'Asie. ; Il compte onze fuseaux horaires !|
646|rw|Rwanda|Kigali|AF|-1.95|30.06|On l'appelle « le pays des mille collines ».|
652|bl|Saint-Barthélemy|—|NA|||Cette petite île des Caraïbes dépend de la France.|T:France
654|sh|Sainte-Hélène|—|AF|||Cette île isolée de l'Atlantique Sud dépend du Royaume-Uni.|T:Royaume-Uni
659|kn|Saint-Christophe-et-Niévès|Basseterre|NA|17.30|-62.72||
660|ai|Anguilla|—|NA|||Cette petite île des Caraïbes dépend du Royaume-Uni.|T:Royaume-Uni
662|lc|Sainte-Lucie|Castries|NA|14.01|-60.99||
663|mf|Saint-Martin (partie française)|—|NA|||Cette moitié d'île dépend de la France ; l'autre moitié est néerlandaise.|T:France
666|pm|Saint-Pierre-et-Miquelon|—|NA|||Ces petites îles près du Canada dépendent de la France.|T:France
670|vc|Saint-Vincent-et-les-Grenadines|Kingstown|NA|13.16|-61.22||
674|sm|Saint-Marin|Saint-Marin|EU|43.94|12.45|Ce tout petit pays est entièrement entouré par l'Italie.|
678|st|Sao Tomé-et-Principe|Sao Tomé|AF|0.34|6.73||
682|sa|Arabie saoudite|Riyad|AS|24.71|46.68|Le pays est en grande partie couvert de désert.|
686|sn|Sénégal|Dakar|AF|14.72|-17.47|Le lac Rose, près de Dakar, prend parfois une couleur rose grâce à de minuscules algues.|
688|rs|Serbie|Belgrade|EU|44.79|20.45||
690|sc|Seychelles|Victoria|AF|-4.62|55.45|Des tortues géantes vivent sur certaines de ses îles.|
694|sl|Sierra Leone|Freetown|AF|8.48|-13.23||
702|sg|Singapour|Singapour|AS|1.35|103.82|C'est à la fois une île, une ville et un pays !|
703|sk|Slovaquie|Bratislava|EU|48.15|17.11||
704|vn|Viêt Nam|Hanoï|AS|21.03|105.85|La baie d'Ha Long compte des centaines d'îles rocheuses.|
705|si|Slovénie|Ljubljana|EU|46.06|14.51||
706|so|Somalie|Mogadiscio|AF|2.05|45.32|Elle a la plus longue côte d'Afrique continentale.|
710|za|Afrique du Sud|Pretoria|AF|-25.75|28.19|Ce pays a trois capitales : Pretoria, Le Cap et Bloemfontein.|
716|zw|Zimbabwe|Harare|AF|-17.83|31.05|Les chutes Victoria, à la frontière avec la Zambie, font un bruit de tonnerre.|
724|es|Espagne|Madrid|EU|40.42|-3.70|On y danse le flamenco.|
728|ss|Soudan du Sud|Djouba|AF|4.85|31.58|C'est le pays le plus récent d'Afrique : il est né en 2011.|
729|sd|Soudan|Khartoum|AF|15.50|32.56|Il y a plus de pyramides au Soudan qu'en Égypte !|
740|sr|Suriname|Paramaribo|SA|5.85|-55.20|La forêt tropicale couvre presque tout le pays.|
748|sz|Eswatini|Mbabane|AF|-26.31|31.14||
752|se|Suède|Stockholm|EU|59.33|18.07|Le prix Nobel a été créé par un Suédois, Alfred Nobel.|
756|ch|Suisse|Berne|EU|46.95|7.45|On y parle quatre langues : l'allemand, le français, l'italien et le romanche.|
760|sy|Syrie|Damas|AS|33.51|36.29|Damas est l'une des plus vieilles villes du monde.|
762|tj|Tadjikistan|Douchanbé|AS|38.56|68.77|Les montagnes couvrent presque tout le pays.|
764|th|Thaïlande|Bangkok|AS|13.76|100.50|L'éléphant est l'un des symboles du pays.|
768|tg|Togo|Lomé|AF|6.13|1.22||
776|to|Tonga|Nuku'alofa|OC|-21.14|-175.20||
780|tt|Trinité-et-Tobago|Port-d'Espagne|NA|10.65|-61.51|C'est là qu'est né le steel drum, un instrument fabriqué dans un baril.|
784|ae|Émirats arabes unis|Abou Dabi|AS|24.45|54.38|Le Burj Khalifa, à Dubaï, est le plus haut gratte-ciel du monde.|
788|tn|Tunisie|Tunis|AF|36.81|10.18|On y trouve les ruines de Carthage, une ville très ancienne.|
792|tr|Turquie|Ankara|AS|39.93|32.86|La ville d'Istanbul est à cheval sur deux continents : l'Europe et l'Asie.|
795|tm|Turkménistan|Achgabat|AS|37.96|58.33|Le désert du Karakoum couvre la plus grande partie du pays.|
796|tc|Îles Turques-et-Caïques|—|NA|||Ces îles des Caraïbes dépendent du Royaume-Uni.|T:Royaume-Uni
800|ug|Ouganda|Kampala|AF|0.35|32.58|Le Nil prend l'une de ses sources au lac Victoria, en Ouganda.|
804|ua|Ukraine|Kiev|EU|50.45|30.52|C'est le plus grand pays situé entièrement en Europe.|
807|mk|Macédoine du Nord|Skopje|EU|41.99|21.43||
818|eg|Égypte|Le Caire|AF|30.04|31.24|Les célèbres pyramides de Gizeh se trouvent près du Caire. ; Le Nil, l'un des plus longs fleuves du monde, traverse le pays.|
826|gb|Royaume-Uni|Londres|EU|51.51|-0.13|Big Ben est le nom de la grosse cloche de la célèbre horloge de Londres.|
831|gg|Guernesey|—|EU|||Cette île de la Manche dépend de la Couronne britannique.|T:Royaume-Uni
832|je|Jersey|—|EU|||Cette île de la Manche dépend de la Couronne britannique.|T:Royaume-Uni
833|im|Île de Man|—|EU|||Cette île de la mer d'Irlande dépend de la Couronne britannique.|T:Royaume-Uni
834|tz|Tanzanie|Dodoma|AF|-6.16|35.75|Le Kilimandjaro, la plus haute montagne d'Afrique, s'y trouve.|
840|us|États-Unis|Washington|NA|38.90|-77.04|Le pays compte 50 États. ; Le Grand Canyon est une immense gorge creusée par une rivière.|
850|vi|Îles Vierges des États-Unis|—|NA|||Ces îles des Caraïbes dépendent des États-Unis.|T:États-Unis
854|bf|Burkina Faso|Ouagadougou|AF|12.37|-1.52|Son nom veut dire « le pays des hommes intègres ».|
858|uy|Uruguay|Montevideo|SA|-34.90|-56.16|La toute première Coupe du monde de football a eu lieu en Uruguay, en 1930.|
860|uz|Ouzbékistan|Tachkent|AS|41.30|69.24|La ville de Samarcande, sur l'ancienne route de la soie, a des mosquées aux coupoles bleues.|
862|ve|Venezuela|Caracas|SA|10.49|-66.88|Le Salto Ángel est la plus haute chute d'eau du monde.|
876|wf|Wallis-et-Futuna|—|OC|||Ces îles du Pacifique dépendent de la France.|T:France
882|ws|Samoa|Apia|OC|-13.83|-171.76||
887|ye|Yémen|Sanaa|AS|15.37|44.19|La vieille ville de Sanaa a des maisons-tours décorées de motifs blancs.|
894|zm|Zambie|Lusaka|AF|-15.39|28.32|Les chutes Victoria, à la frontière avec le Zimbabwe, sont parmi les plus grandes du monde.|
IOT||Territoires australiens de l'océan Indien|—|OC|||Ce sont de petites îles de l'océan Indien qui dépendent de l'Australie.|T:Australie
XKX|xk|Kosovo|—|EU|||Le statut de ce territoire est discuté.|D
`;

  const PAYS = DATA.trim().split("\n").map((line) => {
    const [id, a2, nom, capitale, cont, lat, lon, faits, type] = line.split("|");
    const t = (type || "").trim();
    return {
      id, a2: a2 || null, nom, cont,
      capitale: capitale && capitale !== "—" ? capitale : null,
      cap: lat && lon ? [Number(lat), Number(lon)] : null,
      faits: (faits || "").split(" ; ").map((s) => s.trim()).filter(Boolean),
      territoire: t.startsWith("T:") ? t.slice(2) : null,
      discute: t === "D",
      special: t === "C",
    };
  });
  /* pays « jouables » : vrais pays avec une capitale (pas de territoires ni de statut discuté) */
  PAYS.forEach((p) => { p.jouable = !p.territoire && !p.discute && !p.special && !!p.capitale; });

  /* océans et mers (étiquettes de la carte) */
  const MERS = [
    { nom: "Océan Pacifique", lat: -12, lon: -135, ocean: true, fait: "C'est le plus grand et le plus profond des océans." },
    { nom: "Océan Pacifique", lat: 18, lon: 165, ocean: true, fait: "C'est le plus grand et le plus profond des océans." },
    { nom: "Océan Atlantique", lat: 28, lon: -42, ocean: true, fait: "Il sépare l'Europe et l'Afrique des deux Amériques." },
    { nom: "Océan Atlantique", lat: -22, lon: -18, ocean: true, fait: "Il sépare l'Europe et l'Afrique des deux Amériques." },
    { nom: "Océan Indien", lat: -22, lon: 80, ocean: true, fait: "Il baigne l'Afrique, l'Asie et l'Australie." },
    { nom: "Océan Arctique", lat: 80, lon: -30, ocean: true, fait: "C'est le plus petit océan : il est autour du pôle Nord et souvent gelé." },
    { nom: "Océan Austral", lat: -58, lon: 30, ocean: true, fait: "Il entoure l'Antarctique : ses eaux sont très froides." },
    { nom: "Mer Méditerranée", lat: 34.5, lon: 18, fait: "Elle est entourée par l'Europe, l'Afrique et l'Asie." },
    { nom: "Mer des Caraïbes", lat: 15, lon: -75, fait: "Ses eaux chaudes entourent de nombreuses îles." },
    { nom: "Mer Rouge", lat: 20.5, lon: 38.5, fait: "Elle sépare l'Afrique de l'Asie." },
    { nom: "Mer Noire", lat: 43.2, lon: 34, fait: "Elle est reliée à la Méditerranée par la ville d'Istanbul." },
    { nom: "Mer du Nord", lat: 56, lon: 3, fait: "Elle se trouve entre le Royaume-Uni et la Norvège." },
    { nom: "Mer Baltique", lat: 58, lon: 19.5, fait: "Son eau est moins salée que celle des océans." },
    { nom: "Golfe du Mexique", lat: 25, lon: -90, fait: "Il est entouré par le Mexique, les États-Unis et Cuba." },
    { nom: "Mer de Chine", lat: 13, lon: 114, fait: "Elle baigne la Chine, le Viêt Nam et les Philippines." },
    { nom: "Mer d'Arabie", lat: 15, lon: 64, fait: "Elle fait partie de l'océan Indien." },
    { nom: "Mer Caspienne", lat: 42, lon: 50.8, fait: "C'est la plus grande étendue d'eau fermée du monde : elle ne touche aucun océan." },
    { nom: "Mer du Japon", lat: 40, lon: 134, fait: "Elle sépare le Japon du continent asiatique." },
    { nom: "Golfe de Guinée", lat: 1.5, lon: 3, fait: "Il borde la côte ouest de l'Afrique." },
  ];

  /* villes pour l'animation du jour et de la nuit */
  const VILLES = [
    { nom: "Rabat", lat: 34.02, lon: -6.84 }, { nom: "Paris", lat: 48.86, lon: 2.35 },
    { nom: "New York", lat: 40.71, lon: -74.01 }, { nom: "Rio de Janeiro", lat: -22.91, lon: -43.17 },
    { nom: "Le Caire", lat: 30.04, lon: 31.24 }, { nom: "Pékin", lat: 39.90, lon: 116.40 },
    { nom: "Tokyo", lat: 35.68, lon: 139.69 }, { nom: "Sydney", lat: -33.87, lon: 151.21 },
    { nom: "Los Angeles", lat: 34.05, lon: -118.24 },
  ];

  window.GEO_CONTINENTS = CONTINENTS;
  window.GEO_PAYS = PAYS;
  window.GEO_MERS = MERS;
  window.GEO_VILLES = VILLES;
})();
