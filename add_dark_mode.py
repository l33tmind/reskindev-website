import os
import re

directories = ["src/app", "src/components"]

replacements = {
    r'\bbg-white\b': 'bg-white dark:bg-gray-900',
    r'\bbg-gray-50\b': 'bg-gray-50 dark:bg-gray-950',
    r'\bbg-gray-100\b': 'bg-gray-100 dark:bg-gray-800',
    r'\bbg-gray-200\b': 'bg-gray-200 dark:bg-gray-700',
    r'\border-gray-200\b': 'border-gray-200 dark:border-gray-800',
    r'\border-gray-100\b': 'border-gray-100 dark:border-gray-800',
    r'\btext-gray-900\b': 'text-gray-900 dark:text-white',
    r'\btext-gray-800\b': 'text-gray-800 dark:text-gray-200',
    r'\btext-gray-700\b': 'text-gray-700 dark:text-gray-300',
    r'\btext-gray-600\b': 'text-gray-600 dark:text-gray-400',
    r'\btext-gray-500\b': 'text-gray-500 dark:text-gray-400',
}

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            # Simple approach: Replace exact classes if they don't already have dark: variants next to them.
            # A bit tricky with regex, so we'll just be careful.
            original_content = content
            for old, new in replacements.items():
                # Avoid doubling up if we already replaced it
                content = re.sub(old + r'(?!\s+dark:)', new, content)
            
            if content != original_content:
                with open(path, "w") as f:
                    f.write(content)
                print(f"Updated {path}")
