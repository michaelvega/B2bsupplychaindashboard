import json

en_dict = {
  "landing": {
    "title": "Procept: The Hollistic Action Center for your AI-Powered Supply Chain",
    "subtitle": "Fix Broken Data. Automate Procure-to-Pay. Traceable at Every Single Step.",
    "enterDemo": "Enter Interactive Demo",
    "problemTitle": "Problem: Your Procurement and Operations Teams are Reactive not Proactive",
    "problemDesc1": "For procurement and operations teams, every discrepancy across the ERP, email, and 3PL logistics or manufacturing partners is entirely manual. Someone has to catch these errors and manually perform saving actions to keep the business moving.",
    "problemDesc2": "The most common administrative bottlenecks draining your margins:",
    "immediateTermsTitle": "Immediate Term Issues",
    "immediateIssue1": "Critical updates lost in email wars involving 30 people.",
    "immediateIssue2": "Lack of automated reporting or photos for overages, shortages, and damages.",
    "immediateIssue3": "Changes in the ERP aren't reflected in the warehouse system.",
    "immediateIssue4": "Converting unstructured documents to ERP entries and executing risky mass updates manually.",
    "longTermTitle": "Long-Term Silent Killers",
    "longTermIssue1": "Gathering the right data is so painful that many manufacturers simply give up and rely strictly on trailing sales figures.",
    "longTermIssue2": "Manual \"packets\" and vetting process is too slow.",
    "longTermIssue3": "Manual matching of tariff reports to POs and SKUs.",
    "longTermIssue4": "Difficulty getting clean data in/out of NetSuite, SAP, or JDE.",
    "statsIntro": "While most organizations realize they need to integrate and automate, they struggle finding the strategy and implementation that will actually deliver. Legacy EDI and expensive implementations often result in:",
    "stat1Desc": "of buyer time wasted on manual purchase order and invoice reconciliation.",
    "stat2Desc": "average industry PPV margin leakage due to delayed master data pricing updates.",
    "stat3Desc": "lag time attempting to resolve \"black hole\" shipping damage and shortage claims.",
    "solutionTitle": "Our Solution: Autonomous Agents Curing Administrative Misery",
    "solutionDesc1": "Procept AI",
    "solutionDesc2": " deploys specialized, autonomous agents that continuously monitor your ERP, WMS, and unstructured communications to proactively identify and resolve your most expensive administrative bottlenecks. By bridging disconnected data silos into a central action command, we empower your team to approve complex workflow corrections with a single click, transforming reactive manual data wrangling into a unified, zero-error supply chain operation.",
    "scenario1Title": "1. The Autonomous Procurement Co-Pilot",
    "scenario1Bul1": "Universal Connectivity:",
    "scenario1Bul1B": " Attaches directly to your ERPs, 3PL platforms, and unstructured email communications.",
    "scenario1Bul2": "Proactive Anomaly Detection:",
    "scenario1Bul2B": " Continuously scans underlying operations data to catch discrepancies ",
    "scenario1Bul2C": "before",
    "scenario1Bul2D": " they reach the warehouse floor.",
    "scenario1Bul3": "Autonomous Correction:",
    "scenario1Bul3B": " Isolates errors and proactively formats structured resolution tasks for single-click human approval.",
    "scenario1Bul4": "Data Zero Error:",
    "scenario1Bul4B": " Systematically eliminates manual data entry waste, pricing fumbles, and reactive administrative friction.",
    "scenario2Title": "2. Instant Master Data Synthesis",
    "scenario2Bul1": "Zero-Error Foundations:",
    "scenario2Bul1B": " Once automated agents scrub your operational data repositories, you achieve absolute cleanliness.",
    "scenario2Bul2": "Out-of-the-Box Intelligence:",
    "scenario2Bul2B": " Unlocks enterprise-tier capabilities without requiring an immense in-house AI and data engineering team.",
    "scenario2Bul3": "Live Vendor Scorecarding:",
    "scenario2Bul3B": " Replaces manual vetting and reporting with real-time, highly accurate supplier analytics.",
    "scenario2Bul4": "Predictive Demand Forecasting:",
    "scenario2Bul4B": " Exposes SKU volatility and prevents stock-outs through deep forecasting rather than blind sales reliance.",
    "govTitle": "Ultimate Governability and Traceability",
    "govDesc": "Every action Procept takes must be approved by a team member and is rigorously confirmed with your own rules-based ERP change logs, immediately.",
    "faqTitle": "Can Procept Really Resolve That?",
    "q1Title": "\"Can Procept catch 'Phantom Lead Times' where SAP perfectly says 30 days, but the vendor actually takes 45 days in reality?\"",
    "q1A1": "Yes, it can.",
    "q1A1B": " Procept conducts background analysis on your last 10 email threads and receiving receipts to mathematically prove the supplier is delivering in 45 days. It intervenes and flags the stale data ",
    "q1A1C": "before",
    "q1A1D": " the next MRP run generates bad purchasing schedules.",
    "q1Result": "Result:",
    "q1ResultB": " Buyers order on the correct timeline, avoiding massive expedited freight costs and preventing stockouts.",
    "q2Title": "\"What if a user changes a shipping address or ship method in the ERP, but it never makes it to the 3PL's warehouse system?\"",
    "q2A1": "Yes, Procept catches it.",
    "q2A1B": " It constantly cross-checks the ERP with your 3PL. If there's a mismatch on cuts, cancels, or addresses, it holds fulfillment immediately, routes a structured update task to the warehouse contact, and releases the hold only when they explicitly acknowledge the change.",
    "q2Result": "Result:",
    "q2ResultB": " Zero wrong-ship/reship costs caused by the standard 'our side vs your side' data gap.",
    "q3Title": "\"Can it actually manage the chaos of Shortage Claims when the warehouse receives fewer units than ordered?\"",
    "q3A1": "Absolutely.",
    "q3A1B": " Normally this triggers a 'black hole' email loop. Instead, the agent intercepts the warehouse's shortage log and photo, cross-references the original PO, and autonomously drafts a complete credit claim packet for AP—automatically blocking the vendor invoice.",
    "q3Result": "Result:",
    "q3ResultB": " Drastically higher vendor credit recovery without bleeding AP/Procurement tracking time.",
    "q4Title": "Q: Can it handle \"Lazy\" Vendor Onboarding?",
    "q4A1": "A: Yes.",
    "q4A1B": " If a vendor emails a messy mix of phone photos and inline text, the agent extracts the unstructured data and stages the W-9 and banking details perfectly into your ERP master record.",
    "q5Title": "Q: Does it catch Rogue Invoice Pricing?",
    "q5A1": "A: Yes.",
    "q5A1B": " If an invoice arrives at $12.50 vs the PO's $10.00, Procept catches it from the email, blocks AP processing, and drafts a structured dispute to the vendor before you ever pay it.",
    "q6Title": "Q: What about Tariff Shock Repricing?",
    "q6A1": "A: Yes.",
    "q6A1B": " When new freight tariffs drop, the system maps the hike to affected POs and customer price books, calculating your margin impact and automatically proposing updates.",
    "q7Title": "Q: Can it predict Sudden SKU Stockouts?",
    "q7A1": "A: Yes.",
    "q7A1B": " Procept's background telemetry detects burn-rate anomalies, predicting a stockout ahead of time, and instantly generates an expedited Air Freight PO request.",
    "launchDashboard": "Launch The Dashboard",
    "days": "28 Days",
    "qA": "Q:",
    "aA": "A:"
  }
}

es_dict = {
  "landing": {
    "title": "Procept: El Centro Holístico de Acción para su Cadena de Suministro Potenciada por IA",
    "subtitle": "Repare Datos Rotos. Automatice de Compra a Pago. Rastreable en Cada Paso.",
    "enterDemo": "Ingresar a la Prueba Interactiva",
    "problemTitle": "Problema: Sus Equipos de Compras y Operaciones son Reactivos, no Proactivos",
    "problemDesc1": "Para los equipos de compras y operaciones, cada discrepancia entre el ERP, el correo electrónico y los socios de logística o manufactura es completamente manual. Alguien tiene que detectar estos errores y realizar acciones para mantener el negocio en marcha.",
    "problemDesc2": "Los cuellos de botella administrativos más comunes que agotan sus márgenes:",
    "immediateTermsTitle": "Problemas de Corto Plazo",
    "immediateIssue1": "Actualizaciones críticas perdidas en guerras de correos que involucran a 30 personas.",
    "immediateIssue2": "Falta de informes automatizados para excedentes, escasez y daños.",
    "immediateIssue3": "Los cambios en el ERP no se reflejan en el sistema del almacén.",
    "immediateIssue4": "Convertir documentos no estructurados en entradas de ERP y ejecutar riesgosas actualizaciones.",
    "longTermTitle": "Asesinos Silenciosos de Largo Plazo",
    "longTermIssue1": "Recopilar los datos correctos es tan doloroso que muchos renuncian y dependen de cifras de ventas anteriores.",
    "longTermIssue2": "Los procesos de revisión y \"paquetes\" de incorporación de proveedores son demasiado lentos.",
    "longTermIssue3": "Coincidencia manual de informes arancelarios con Órdenes de Compra y SKUs.",
    "longTermIssue4": "Dificultad para integrar datos de NetSuite, SAP o JDE.",
    "statsIntro": "Aunque la mayoría se da cuenta de que necesitan integrar y automatizar, luchan por encontrar la estrategia adecuada. EDI heredado y costosas implementaciones a menudo resultan en:",
    "stat1Desc": "del tiempo del comprador desperdiciado en órdenes de compra y conciliación.",
    "stat2Desc": "de fuga promedio de márgenes debido a actualizaciones retrasadas en la fijación de precios de datos maestros.",
    "stat3Desc": "de tiempo de retraso intentando resolver resoluciones de reclamos de envíos.",
    "solutionTitle": "Nuestra Solución: Agentes Autónomos Curando la Miseria Administrativa",
    "solutionDesc1": "Procept AI",
    "solutionDesc2": " despliega agentes especialistas y autónomos que monitorean constantemente su ERP, WMS y comunicaciones no estructuradas para detectar de manera proactiva cuellos de botella administrativos. Al unir bases de datos desconectadas, permitimos a su equipo aprobar correcciones de procesos de manera automatizada.",
    "scenario1Title": "1. El Copiloto Automático de Adquisiciones",
    "scenario1Bul1": "Conectividad Universal:",
    "scenario1Bul1B": " Se conecta directamente a tus ERP, plataformas de 3PL y correos electrónicos.",
    "scenario1Bul2": "Detección Proactiva de Anomalías:",
    "scenario1Bul2B": " Analiza continuamente las operaciones subyacentes para detectar anomalías ",
    "scenario1Bul2C": "antes",
    "scenario1Bul2D": " de que alcancen el suelo del almacén.",
    "scenario1Bul3": "Corrección Autónoma:",
    "scenario1Bul3B": " Aísla errores y formatea automáticamente las resoluciones para aprobación humana de un clic.",
    "scenario1Bul4": "Datos con Cero Errores:",
    "scenario1Bul4B": " Elimina la pérdida manual en la entrada de datos, errores de cálculo de precios y la fricción administrativa reactiva.",
    "scenario2Title": "2. Síntesis Instantánea de Datos Maestros",
    "scenario2Bul1": "Bases Cero-Error:",
    "scenario2Bul1B": " Una vez que los agentes automáticos lavan sus repositorios de datos operacionales, logras absoluta pureza.",
    "scenario2Bul2": "Inteligencia Lista para Usar:",
    "scenario2Bul2B": " Desbloquea capacidades empresariales sin requerir un inmenso equipo de AI ni rediseños organizacionales.",
    "scenario2Bul3": "Calificación Viva de Proveedores:",
    "scenario2Bul3B": " Reemplaza las revisiones manuales y papeleos con análisis ultra-precisos de los suministradores.",
    "scenario2Bul4": "Pronósticos Predictivos:",
    "scenario2Bul4B": " Muestra la variabilidad de SKU y evita el desabasto a través de pronóstico en vivo.",
    "govTitle": "Máxima Gobernabilidad y Trazabilidad",
    "govDesc": "Cada acción tomada por Procept debe ser confirmada y rigurosamente revisada al instante por medio de sus reglas y bitácora del ERP.",
    "faqTitle": "¿Realmente Procept Puede Resolver Eso?",
    "q1Title": "\"¿Puede Procept detectar 'plazos fantasmas' donde SAP dice 30 días pero toma 45 en la realidad?\"",
    "q1A1": "Sí, lo hace.",
    "q1A1B": " Procept procesa matemática los últimos 10 hilos de correos para probar que el envío tarda 45. Y lo bloquea ",
    "q1A1C": "antes",
    "q1A1D": " de la próxima corrida de manufactura.",
    "q1Result": "Resultado:",
    "q1ResultB": " Compradores compran en el orden correcto logrando no quedarse sin stock ni pagar envíos de emergencia.",
    "q2Title": "\"¿Qué pasa si un usuario cambia la dirección de envío y no el 3PL?\"",
    "q2A1": "Sí, Procept lo detecta.",
    "q2A1B": " Constantemente hace cruces de su 3PL. Sostiene el cumplimiento y re-enruta el dato de manera estructurada.",
    "q2Result": "Resultado:",
    "q2ResultB": " Cero cobros y retrasos por incompatibilidad entre bases de datos cruzadas.",
    "q3Title": "\"¿Puede solucionar el desorden de los partes de desabastos recibidos?\"",
    "q3A1": "En lo absoluto.",
    "q3A1B": " Usualmente, activa una cadena de correos de hoyo negro. Mejor, el agente bloquea facturas, cruza con la PO original y sube ticket crediticio automáticamente.",
    "q3Result": "Resultado:",
    "q3ResultB": " Incremento en la captura económica sin vaciar el tiempo administrativo en el lado de Adquisiciones/Pagos.",
    "q4Title": "Q: ¿Soporta Integración \"Relajada\" de Contratistas?",
    "q4A1": "A: Sí.",
    "q4A1B": " Si adjuntan fotos borrosas de W-9 desde su iphone, lo pasamos perfecto y estructurado.",
    "q5Title": "Q: ¿Pesa Precios Extraños en Transacciones?",
    "q5A1": "A: Sí.",
    "q5A1B": " Detecta y disputa si un recibo fue por $12.5 en vez de $10 directamente a los vendors previo al pago.",
    "q6Title": "Q: ¿Qué de las revaluaciones de Tarifas Repentinas?",
    "q6A1": "A: Sí.",
    "q6A1B": " Cuadra un golpe porcentual al tarifario completo proponiendo el aumento instantáneamente.",
    "q7Title": "Q: ¿Predice de Stock Out de Pronto Choque?",
    "q7A1": "A: Sí.",
    "q7A1B": " Detecta la velocidad del queme del inventario, mandando una compra por carga aérea prematura para salvarlo.",
    "launchDashboard": "Lanzar el Panel de Control",
    "days": "28 Días",
    "qA": "P:",
    "aA": "R:"
  }
}

import os
os.makedirs("src/locales/en", exist_ok=True)
os.makedirs("src/locales/es", exist_ok=True)
with open("src/locales/en/translation.json", "w") as f:
    json.dump(en_dict, f, indent=2)
with open("src/locales/es/translation.json", "w") as f:
    json.dump(es_dict, f, indent=2)

with open("src/i18n.ts", "w") as f:
    f.write("""import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

const hostname = window.location.hostname;
const defaultLanguage = hostname.startsWith('mx.') || hostname.endsWith('.mx') ? 'es' : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
""")

with open("src/main.tsx", "r") as f:
    main_content = f.read()
if "import './i18n'" not in main_content:
    main_content = main_content.replace('import "./styles/index.css";', 'import "./styles/index.css";\nimport "./i18n";')
    with open("src/main.tsx", "w") as f:
        f.write(main_content)

print("Done generating i18n files")
