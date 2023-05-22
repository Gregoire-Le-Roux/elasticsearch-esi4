# elasticsearch-esi4
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