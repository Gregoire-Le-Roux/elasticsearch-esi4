import { useState, useEffect } from "react";

import * as apiCommand from "./api/commands";

import {
  Container,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { DataGrid, frFR } from "@mui/x-data-grid";
import { Add, Search, Delete } from "@mui/icons-material";
import { faker } from "@faker-js/faker";
import moment from "moment";
import "./App.css"

const columns = [
{
    field: "billNo",
    headerName: "N° commande",
    flex: 2,
    minWidth: 100,
},
  {
    field: "itemName",
    headerName: "Produit",
    flex: 2,
    minWidth: 150,
  },
  {
    field: "country",
    headerName: "Pays",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "price",
    headerName: "Prix",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "quantity",
    headerName: "Quantité",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    minWidth: 150,
    renderCell: (rowData) => moment(rowData.value).format("DD/MM/YY HH:mm")
  },
];

const App = () => {
    const [loading, setLoading] = useState(true);
    const [commands, setCommands] = useState([]);
    const [selection, setSelection] = useState([]);
    const [query, setQuery] = useState("");
    const [nbCommand, setNbCommand] = useState(1);

    // Ajout d'un document
    const addCommand = async () => {
        setLoading(true);
        const command = getFakerCommand();
        const response = await apiCommand.addCommand(command);
        if(!query) setCommands([...commands, { ...command, id: response._id }]);
        setLoading(false);
    };

    // Ajout de plusieurs documents (bulk)
    const addCommands = async () => {
        setLoading(true);
        let newCommands = [];
        for(let i = 0; i <= nbCommand - 1; i++) {
            newCommands.push(getFakerCommand())
        }

        const response = await apiCommand.addCommands(newCommands);

        if(!query) {
            let updCommands = [...commands]
            response.items.map((command, index) => (
                updCommands.push({
                    ...newCommands[index], id: command.index._id
                })
            ))
            setCommands(updCommands);
        } 
        setLoading(false);
    };

    const getFakerCommand = () => {
        return {
            billNo: faker.number.int({ min: 100000, max: 999999 }),
            price: faker.commerce.price({ min: 1, max: 300 }),
            quantity: faker.number.int({ min: 1, max: 6 }),
            country: faker.location.country(),
            itemName: faker.commerce.productName(),
            date: faker.date.anytime(),
        }
    }

    // Suppression de documents sélectionnées
    const removeCommands = async (removedIds) => {
        setLoading(true);
        setCommands(commands.filter((command) => !removedIds.includes(command.id)));
        await Promise.all(removedIds.map((id) => apiCommand.removeCommand(id)));
        setLoading(false);
    };

    // Recherche des documents selon des mots-clés
    const search = async (event) => {
        // Fais la recherche si un clique sur la loupe dans l'input ou si la touche Entrer est pressé
        if(event.type === "click" || event.type === "keydown" && event.key === "Enter") {
            setLoading(true);
            const response = await apiCommand.search(query);
            setCommands(
                response.hits.hits.map((hit) => ({
                    id: hit._id,
                    ...hit._source,
                }))
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        // Récupère tous les documents
        apiCommand.getAllCommands().then((response) => {
            setCommands(
                response.hits.hits.map((hit) => ({
                    id: hit._id,
                    ...hit._source,
                }))
            );
            setLoading(false);
        });
    }, []);


    return (
        <div className="app-center">
            <Container maxWidth="md">
                <h1 style={{ textAlign: "center" }} >Elasticsearch - Commandes</h1>
                <TextField
                    placeholder="Rechercher"
                    fullWidth
                    value={query}
                    onInput={(event) => setQuery(event.target.value)}
                    onKeyDown={search}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment sx={{ pr: 1.5 }} position="start">
                            <IconButton onClick={search} >
                            <Search />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
                <div className="actions">
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        sx={{ my: 1, mr: 1 }}
                        onClick={() => nbCommand > 1 ? addCommands() : addCommand()}
                    >
                        Ajouter
                    </Button>
                    <TextField
                        size="small"
                        value={nbCommand}
                        type="number"
                        onChange={(event) =>  setNbCommand(event.target.value >= 1 && event.target.value <= 150 ? event.target.value : nbCommand)}
                        InputProps={{ min: "1", max: "150" }}
                        style={{ width: "75px"}}
                    />
                    <Button
                        startIcon={<Delete />}
                        variant="contained"
                        disabled={selection.length === 0}
                        sx={{ my: 1, ml: 1 }}
                        onClick={() => removeCommands(selection)}
                    >
                        Supprimer
                    </Button>
                </div>
                <div style={{ width: "100%", height: 450 }}>
                    <DataGrid
                        rows={commands}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(model) => setSelection(model)}
                        selectionModel={selection}
                        loading={loading}
                        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                    />
                </div>
            </Container>
        </div>
    );
};

export default App;