import json

en_path = "src/locales/en/translation.json"
es_path = "src/locales/es/translation.json"

with open(en_path, "r") as f:
    en_data = json.load(f)

with open(es_path, "r") as f:
    es_data = json.load(f)

en_data["landing"].update({
    "immediateIssue1Label": "\"Black Hole\" Communications:",
    "immediateIssue2Label": "Shipping Claims:",
    "immediateIssue3Label": "3PL & ERP Synchronization:",
    "immediateIssue4Label": "Data Synchronization Errors:",
    "longTermIssue1Label": "Blind Demand Forecasting:",
    "longTermIssue2Label": "Vendor Qualification & Onboarding:",
    "longTermIssue3Label": "Tariff Calculation & Reconciliation:",
    "longTermIssue4Label": "Integration \"Nightmares\":"
})

es_data["landing"].update({
    "immediateIssue1Label": "Comunicaciones de \"Agujero Negro\":",
    "immediateIssue2Label": "Reclamaciones de Envío:",
    "immediateIssue3Label": "Sincronización 3PL y ERP:",
    "immediateIssue4Label": "Errores de Sincronización de Datos:",
    "longTermIssue1Label": "Pronóstico de Demanda a Ciegas:",
    "longTermIssue2Label": "Calificación y Alta de Proveedores:",
    "longTermIssue3Label": "Cálculo y Conciliación de Aranceles:",
    "longTermIssue4Label": "\"Pesadillas\" de Integración:"
})

with open(en_path, "w") as f:
    json.dump(en_data, f, indent=2)

with open(es_path, "w") as f:
    json.dump(es_data, f, indent=2)
