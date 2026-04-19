import os

files_to_update = [
    "src/locales/en/translation.json",
    "src/locales/es/translation.json",
    "src/app/pages/LandingPage.tsx",
    "index.html"
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r') as file:
            content = file.read()
        
        updated_content = content.replace("Procept AI", "Procept Technologies")
        
        with open(filepath, 'w') as file:
            file.write(updated_content)
            
print("Replacement completed.")
