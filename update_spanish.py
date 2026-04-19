import json

es_path = "src/locales/es/translation.json"

with open(es_path, "r") as f:
    es_data = json.load(f)

es_data["landing"].update({
    "solutionTitle": "Nuestra Solución: Agentes Autónomos que Previenen Catástrofes Antes de que Lleguen al Cliente",
    "quoteMainPoint": "Los Problemas de Fragmentación de Datos Frenan en Seco a los Equipos de Operaciones y Adquisiciones",
    "quoteText": "Cuando los datos de compras no se alinean con los sistemas de inventario, o cuando la información de transporte vive separada de la planificación de la demanda, las herramientas de IA no pueden ofrecer la inteligencia conectada que necesitan los líderes de la cadena de suministro.",
    "quoteSource": "TraxTech - Por Qué Falla la IA en la Cadena de Suministro"
})

with open(es_path, "w") as f:
    json.dump(es_data, f, indent=2)
