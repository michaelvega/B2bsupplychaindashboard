import json

en_path = "src/locales/en/translation.json"
es_path = "src/locales/es/translation.json"

with open(en_path, "r") as f:
    en_data = json.load(f)

with open(es_path, "r") as f:
    es_data = json.load(f)

en_data["landing"].update({
    "quoteMainPoint": "Most Procurement and Operations Teams cannot Harness AI due to Fragmented, Poor Data Quality",
    "quoteText": "Data Quality Issues Block Progress: When procurement data doesn't align with inventory systems, or when transportation information lives separately from demand planning, AI tools can't deliver the connected intelligence that supply chain leaders need.",
    "quoteSource": "TraxTech - AI in Supply Chain"
})

es_data["landing"].update({
    "quoteMainPoint": "La Mayoría de los Equipos de Operaciones y Mantenimiento no Pueden Aprovechar la IA Debido a la Pobreza y Fragmentación de los Datos",
    "quoteText": "\"Los problemas de calidad de los datos bloquean el progreso: cuando los datos de compras no se alinean con los sistemas de inventario, o cuando la información de transporte vive separada de la planificación de la demanda, las herramientas de IA no pueden ofrecer la inteligencia conectada que necesitan los líderes de la cadena de suministro.\"",
    "quoteSource": "TraxTech - IA en la Cadena de Suministro"
})

with open(en_path, "w") as f:
    json.dump(en_data, f, indent=2)

with open(es_path, "w") as f:
    json.dump(es_data, f, indent=2)
