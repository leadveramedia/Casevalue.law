#!/usr/bin/env python3
"""
Apply the final 7 complete translations to zh.js
"""
import re

# Read the final translations
with open('/Users/rshao/casevalue.law/translations_final_7.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract individual translations
pattern = r'([a-z_]+):\s*\{(.*?)\n\},'
matches = re.finditer(pattern, content, re.DOTALL)

translations = {}
for match in matches:
    entry_name = match.group(1)
    entry_content = match.group(2)
    translations[entry_name] = f"{entry_name}: {{{entry_content}\n}},"

print(f"Loaded {len(translations)} final translations")
print("Entries:", list(translations.keys()))

# Read zh.js
zh_file = '/Users/rshao/casevalue.law/src/translations/zh.js'
with open(zh_file, 'r', encoding='utf-8') as f:
    zh_content = f.read()

# Replace each entry
replaced_count = 0
for entry_name, new_translation in translations.items():
    # Find the existing entry in zh.js
    pattern = rf'  {entry_name}:\s*\{{.*?\n  \}},'

    if re.search(pattern, zh_content, re.DOTALL):
        # Add proper indentation (2 spaces)
        indented_translation = "  " + new_translation.replace('\n', '\n  ')
        zh_content = re.sub(pattern, indented_translation.rstrip(), zh_content, flags=re.DOTALL, count=1)
        replaced_count += 1
        print(f"Replaced: {entry_name}")
    else:
        print(f"NOT FOUND: {entry_name}")

print(f"\nReplaced {replaced_count} entries out of {len(translations)}")

# Write back to zh.js
with open(zh_file, 'w', encoding='utf-8') as f:
    f.write(zh_content)

print("Updated zh.js with final translations!")
