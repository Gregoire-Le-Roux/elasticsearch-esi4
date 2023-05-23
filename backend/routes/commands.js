const index = "commands", size = 10_000;
module.exports = function (app, elasticClient) {    
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Créé un document
    app.post("/create-command", async (req, res) => {
        const result = await elasticClient.index({
            index: index,
            document: {
                billNo: req.body.billNo,
                price: req.body.price,
                quantity: req.body.quantity,
                country: req.body.country,
                itemName: req.body.itemName,
                date: req.body.date,
            },
        });

        res.send(result);
    });

    // Créé plusieurs documents (bulk)
    app.post("/create-multiple-command", async (req, res) => {
        let body = [], commands = req.body;
        commands.map((command) => {
            body.push({ index: { _index: index } })
            body.push(command);
        })

        const result = await elasticClient.bulk({
            body: body
        });

        res.send(result);
    });

    // Supprime un document
    app.delete("/remove-command", async (req, res) => {
        const result = await elasticClient.delete({
            index: index,
            id: req.query.id,
        });

        res.json(result);
    });

    // Récupère les documents filtrer par un champ de recherche
    app.get("/search", async (req, res) => {
        // Dans le cas où le champ de recherche est vide, on retourne tous les documents
        let query = { match_all: {} };
        if(req.query.query) {
            query = { fuzzy: { title: req.query.query } };
        }

        const result = await elasticClient.search({
            index: index,
            query: query,
            size: size,
        });

        res.json(result);
    });

    // Récupère tous les documents
    app.get("/commands", async (req, res) => {
        const result = await elasticClient.search({
            index: index,
            query: { match_all: {} },
            size: size,
        });

        res.send(result);
    });
}