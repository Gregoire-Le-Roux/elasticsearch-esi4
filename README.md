# Elasticsearch ESI4
Cours d'Elasticsearch la semaine du 22/05/2023 par Mounir B.

## TP1 - Mise en place d'Elasticsearch & Kibana en local

Installer la dernière version d'Elasticsearch sur ce lien : https://www.elastic.co/fr/downloads/elasticsearch

Dezipper le dossier installé puis lancer dans un invite de commande à la racine du nouveau dossier la commande :  ```bin\elasticsearch.bat```

Patienter puis récupérer le mot de passe généré automatiquement pour le user “elastic” et le token pour la configuration du kibana (expire après 30 minutes). 

    Pour réinitialiser le mot de passe automatiquement : bin\elasticsearch-reset-password.bat -a -u=elastic

    Pour regénérer un token pour configuer Kibana : bin\elasticsearch-create-enrollment-token.bat -s="kibana"

Installer la dernière version de Kibana sur ce lien : https://www.elastic.co/fr/downloads/kibana

Dezipper le dossier installé puis lancer dans un invite de commande à la racine du nouveau dossier la commande :  ```bin\kibana.bat```

Patienter le lancement de Kibana puis accéder au lien : http://localhost:5601/ 

Ensuite coller le token récupérer au préalable par elasticsearch et faire la liaison entre Kibana et Elasticsearch.

Enfin, après la liaison, se connecter avec les identifiants "elastic" pour le user et le mot de passe généré précédemment.

    Attention à vérifier que vous avez assez d'espace sur votre disque et il arrive parfois que la liaison entre Kibana et Elasticsearch ou la connexion à Kibana retourne une erreur mais cela peut être due à la connexion internet.

### Créer un index avec Mapping explicite
```
PUT /students
{
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "age": { "type": "integer" },
      "classroom": { "type": "text" }
    }
  }
}
```

### Indexer un document
```
POST /students/_doc
{"name": "Grégoire LE ROUX",
 "age": 22,
 "classroom": "ESI4"
}
```

### Indexer des documents en lots (bulk) 
```
POST _bulk
{"index":{"_index":"students"}}
{"name":"Greg LE ROUX", "age": 20, "classroom": "ESI4"}
{"index":{"_index":"students"}}
{"name":"Grégoire LE ROUX", "age": 21, "classroom": "ESI3"}
```

### Rechercher dans les documents

Récupère tous les étudiants
```
GET /students/_search
```

Récupère tous les étudiants étant dans la classe "ESI4".
```
GET /students/_search
{
  "query": {
    "match": {
      "classroom": "ESI4"
    }
  }
}
```

### Modifier la configuration d'un index
Ajout du champ "city" dans le Mapping de l'index students
```
PUT /students/_mapping
{
  "properties": {
    "city": { "type": "text" }
  }
}
```

## Exercice Mapping
### Comment Elasticsearch procède-t-il au <b>mapping</b> ?
Lors d'un mapping d'un index procédé par Elasticsearch, soit le mapping est <b>dynamique</b> soit il est <b>statique</b>. 

Lorsqu'il est dynamique, à l'indexation, les types des champs sont déduits et il est possible d'ajouter des champs autres que ces des index déjà présents. Et lorsqu'il est statique, les types et les champs sont déjà défini au préalable et à l'indexation, l'objet doit correspondre à ce mapping.

### Peut-on modifier le mapping sans recréer l’index ? 
Oui, il est possible de modifier le mapping sans recréer l'index avec par exemple la requête ci-dessous pour ajouter le champ de texte "city" à l'index "students"
```
PUT /students/_mapping
{
  "properties": {
    "city": { "type": "text" }
  }
}
```

## Exercice Analyseur
### Définir Tokenisation et Normalisation
Pour permettre d'analyser et de faire correspondre des mots-clés avec un long texte pour avoir les résultats les plus pertinents dans Elasticsearch, il peut être nécessaire de mettre en place des analyseurs comme la tokenisation, la normalisation ou encore des moyens de recherche personnalisés.

Tokenisation: Compacter une phrase en plusieurs combinaisons de mots-clés. Exemple, nous avons dans un champ texte la phrase suivante : ```le chat roux court dans la rue```. Si on applique la tokenisation, on pourra retrouver cette phrase avec les mots clés "chat roux", "chat rue" alors que sans on aurait pas eu forcément tous les résultats pertinents.

Normalisation: Standardiser après la tokenisation, pour faire correspondre nos tokens qui sont similaires pas exactes aux mots-clés de la recherche. 
On peut faire cela en mettant par exemple en miniscules tous les caractères (Chat -> chat), en réduisant le mot à sa racine (rousse -> roux), en reconnaissant les synonymes pour les unifier (rue et cour -> rue).

## TP2 - Projet avec Elasticsearch

Projet: Suivi de commandes réalisées dans les magasins à travers le monde. React pour le front et Node(Express) pour le back + Elasticsearch & Kibana en local

(J'ai suivi principalement ce guide pour réaliser le projet:  https://developer.okta.com/blog/2022/04/27/ultimate-guide-elasticsearch-nodejs)

### Mettre en place le projet en local 

Il faut tout d'abord avoir fait la mise en place d'Elasticsearch & de Kibana comme présenté dans la première partie du TP1.

Ensuite, télécharger ce dépôt, installer les dépendances dans le dossier <b>frontend</b> et <b>backend</b> avec la commande : `npm install`

Côté backend, faire une copie du fichier <b>.elastic.env-example</b> en le renommant <b>.elastic.env</b> et y ajouter les <b>variables d'environnement </b> récupérer d'Elasticsearch.

De plus, coller à la racine du dossier backend, le certificat généré par Elasticsearch nommé <b>http_ca.crt</b> qui se situe dans le dossier d'Elasticsearch au chemin <b>~\elasticsearch-8.7.1\config\certs</b>

Il ne reste plus qu'à lancer :
- Elasticsearch: ```bin\elasticsearch.bat```
- Kibana: ```bin\kibana.bat```
- Frontend: ```npm run dev```
- Backend: ```npm run dev```

### Créer un index avec un mapping spécifique
Pour créer un index avec l'api, voir le fichier <b>create-index.js</b> dans le dossier backend et pour exécuter le fichier, faire la commande: `node create-index.js`

### Indexer des documents 
Toutes les fonctions pour récupérer, ajouter, supprimer, recherher des documents se trouve dans le fichier <b>.\backend\routes\commands.js</b> et il y a deux routes pour créer des documents. 

<b>/create-command</b> pour indexer un seul document et <b>/create-multiple-command</b> pour indexer plusieurs documents avec bulk.

### Recherche de documents
La recherche de documents est réalisée par la route <b>/search</b> qui prend en paramètre du texte.

La query ci-dessous recherche les commandes selon le paramètre, en regardant dans les champs du nom du produit et dans le pays si un mot correspond à la recherche. L'analyzer est le standard, il permet de comparer la recherche et les champs en les mettant en miniscules, cherchant les correspondances de mots à n'importe quelle position...

    query = {
        multi_match: { 
            query: req.query.query,
            analyzer: "standard",
            fields: ["itemName", "country"]
        } 
    }
La query ci-dessus en requête correspond à : 

    GET commands/_search
    {
      "query": {
        "multi_match": {
          "query":  "req.query.query",
          "analyzer": "standard", 
          "fields": ["itemName", "country"]
        }
      }
    }

Des filtres sont aussi disponibles sur les colonnes du tableau pour chercher selon une valeur dans une colonne, trier par colonne.
###	Tenter d’expliquer comment les données indexées sont analysées 
Lorsque Elasticsearch réalise une analyse, son objectif est de renvoyer les documents étant les plus pertinents plutôt que ceux correspondant le plus aux termes de la recherche. 

Pour réaliser ces analyses, nous avons ce qu'on appelle des <b>analyzer</b> qui sont réalisés en trois étapes : 
- <b>les filtres de charactères</b>, qui peut ajouter, supprimer ou changer des charactères. Par exemple, de retirer des balises HTML dans le texte.
- <b>la tokenisation</b>, séparé le texte en plusieurs en plusieurs parties appelées <b>tokens</b>. Par exemple, enlever tous les espaces, les ponctuactions, les déterminants d'une phrase pour ne garder que les mots les plus importants pour notre recherche.
- <b>la normalisation</b>, ajout, change ou supprime les tokens pour les faire correspondre à notre recherche. Par exemple, garder que les racines des mots, mettre en miniscules pour augmenter la pertinence de la recherche.

