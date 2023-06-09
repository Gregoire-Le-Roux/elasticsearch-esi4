# Elasticsearch ESI4
Cours d'Elasticsearch la semaine du 22/05/2023 par Mounir B.

[TP1](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4#tp1---mise-en-place-delasticsearch--kibana-en-local)

[TP2](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4#tp2---projet-avec-elasticsearch)

[TP3](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4#tp3)
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

    Attention à vérifier que vous avez assez d'espace sur votre disque, il peut arriver que la liaison entre Kibana et Elasticsearch ou la connexion à Kibana retourne une erreur mais cela peut être aussi due à la connexion internet, il peut suffir de simplement réessayer.

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

Dataset: Fichier <b>Dataset-Commands.csv</b> à la racine du projet

(Source: https://www.kaggle.com/datasets/aslanahmedov/market-basket-analysis)

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

###	Utilisez l’API _analyze pour tester des analyseurs et n’utilisez que des mappings explicites

Exemples d'utilisations de l'API _analyse :

    GET _analyze
    {
      "tokenizer" : "standard",
      "filter" : ["lowercase"],
      "text" : "pizza"
    }

    GET _analyze
    {
      "tokenizer" : "whitespace",
      "filter" : ["lowercase"],
      "text" : "Rubber towel"
    }


## TP3
### A - Schéma des concepts d'Elasticsearch

<img width="1894" alt="Schéma global permettant l’illustration de concepts d’Elasticsearch et leurs interactions" src="https://github.com/Gregoire-Le-Roux/elasticsearch-esi4/assets/84314581/8451566a-2bcf-424f-8adf-d43c3ee8c472">


### A - Expliquez comment Elasticsearch stocke ses données et comment certaines de ces notions permettent de gagner en robustesse (en termes de sauvegarde et d’intégrité des données).
Pour stocker ses données, Elasticsearch les stocke dans une table appelée <b>index</b>. Il est possible de créer un alias de l'index qui s'utilise alors comme l'index initial, en changeant par exemple l'index en cours d'utilisation par l'alias et donc peut permettre la maintenance d'index sans l'interruption du service.

De plus, Elasticsearch a un système de <b>cluster</b> qui est constitué de plusieurs <b>noeuds</b> qui peuvent communiquer entre eux et avec l'index. Chaque noeud correspond à une instance d'Elasticsearch et a un ou plusieurs rôles. Les rôles définissent les tâches que peut réaliser chaque noeud et le cluster doit obligatoirement avoir un noeud avec un rôle <b>master</b> (gestion du cluster) et <b>data</b> (gestion des index/shards).

Il est conseillé d'avoir au moins 3 noeuds master dans un cluster disposé sur 3 machines différentes, cela permet à Elasticsearch de gagner robustesse en terme d’intégrité des données car même si un noeud tombe en panne, il reste au moins 2 autres qui peuvent reprendre la charge et gérer le cluster.

Les noeuds avec le rôle data servent à la gestion des index et des shards, un <b>shard</b> étant une partie de l'index que l'on va stocker dans un noeud. Ensuite, on peut créer un <b>réplica</b> de ce shard que l'on va stocker sur un autre noeud, cela permettra en cas d'incident avec le shard primaire d'avoir une redondance des données dans le shard réplica.

### A - Résumez les fonctionnalités de mise à l’échelle
Elasticsearch a plusieurs fonctionnalités pour la mise à l'échelle, tout d'abord, à savoir que sur Elasticsearch, l'unité de base de la mise à l'échelle est le shard. Donc lorsqu'un shard commence à avoir beaucoup de données, on peut en ajouter un pour partager la charge. Mais attention à ne pas trop en avoir car si des shards ne sont pas sollicités cela va juste consommer beaucoup de ressources et provoquer des ralentissements sur le système.

Un shard est stocké sur un noeud et Elasticsearch gère automatiquement la répartition des shards sur les noeuds. Sachant qu'il est conseillé d'avoir toujours plus de shards que de noeuds, les shards peuvent changer de noeud rapidement et sans interruption de service.

Il est aussi possible de faire de la mise à l'échelle en ajoutant des replicas pour offrir une meilleure disponibilité ou encore en ajoutant des index en répartissant les données.

### B - D’après vos recherches pourquoi utiliser scroll API ? Est-ce le bon paramètre de recherche pour effectuer de la recherche paginée ? 

Exemple d'utilisation de la scroll API:

    GET /commands/_search?scroll=1m

    GET /_search/scroll
    {
      "scroll" : "1m",
      "scroll_id" : "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFnBkams1RWxaUlFTeW1UWVFJZXhsOGcAAAAAAAAGshZkRHJMY1AtM1RiU2ZndVBTRFJ0UTh3"
    }

Scroll API permet de retrouver rapidement un grand nombre de résultats, selon un scroll ID généré par une requête search effectuée au préalable. Scroll API va récupérer les données avec les mêmes critères de recherche que le search mais ce sera les données suivantes du search. À savoir que les résultats renvoyés du scroll API seront au même état au moment du search, c'est-à-dire que toute indexation, modification ou suppression ne seront pas prises en compte.

L'utilisation de scroll API sert pour récupérer beaucoup de données en une seule requête mais n'est pas pertinent pour utiliser dans le cas d'une recherche paginée due à la propriété de ne pas avoir les modifications entre le temps du search et du scroll donc des informations pas à jour peuvent être affiché à l'utilisateur, ce qui est déconseillé. Il serait plus préférable d'utiliser la scroll API par exemple dans le cas où l'on voudrait ré-indexer les données d'un index dans un nouveau.
Pour effectuer de la recherche paginée, le paramètre <b>search_after</b> de search est utile pour récupérer la page suivante.

### C - Kibana: Quel est l’usage principal de Kibana ? 
Le principal usage de Kibana est la data visualisation avec des tableaux, des graphes de données.

### Qu’est-ce qu’un Dashboard ? 
Dans Kibana, un Dashboard est le regroupement de visualisations créé à partir de données d'index.

### Créer deux visualisations, Créer un dashboard
![Dashboard - Kibana](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4/assets/84314581/acc32239-669b-4f2d-9a7b-b90e76b98a22)

### Explorer les données (Discover)
![Discover - Kibana](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4/assets/84314581/67d36943-a51f-4afc-ba2f-9c187a5d49f0)

### Créer une data view
![Create Data View - Kibana](https://github.com/Gregoire-Le-Roux/elasticsearch-esi4/assets/84314581/8e8e97cf-6b3a-4bf3-b1e3-e753c3f63227)


