
python "C:\dev-utils\list_tree.py" "C:\projects\moreways\argueOS-v1-form\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\argueOS-v1-form\SRC-argueOSform-full.md"

SRC TREE ONLY

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\argueOS-v1-form\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\argueOS-v1-form\SRC-argueOSform-TREE.md" --tree-only

moreways-site:

docs

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\moreways-site\docs" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\moreways-site\docs-moreways-site-TREE.md"

src

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\moreways-site\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\moreways-site\SRC-moreways-site-TREE.md"

FULL TREE ONLY:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\moreways-site" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --tree-only --output "C:\projects\moreways\moreways-site\FULL-moreways-site-TREE.md"

______________________________________________________________________________

parser engine:

SRC CODE AND TREE:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\SRC-law-parsing-engine-TREE.md"

FULL TREE ONLY:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --tree-only --output "C:\projects\moreways\law-parsing-engine\law-parsing-engine-TREE.md"

TESTS CODE:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\tests" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\TESTS-law-parsing-engine-TREE.md"

DOCS:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\docs" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\DOCS-law-parsing-engine-TREE.md"

SCRIPTS:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\scripts" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\SCRIPTS-law-parsing-engine-TREE.md"

SQL:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\scripts\sql" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\SQL-law-parsing-engine-TREE.md"
______________________________________________________________________________

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\law-parsing-engine\src\" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs --include-readme --output "C:\projects\moreways\law-parsing-engine\SRC-law-parsing-engine-TREE.md"

_________________________________________

attribution-engine

moreways pixel docs:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\attribution-engine\docs" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\attribution-engine\LLM-context-docs\docs-moreways-pixel.md"

moreways pixel src:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\attribution-engine\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\attribution-engine\LLM-context-docs\src-moreways-pixel.md"

moreways pixel tests:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\attribution-engine\tests" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\attribution-engine\LLM-context-docs\tests-moreways-pixel.md"

moreways pixel full tree:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\attribution-engine" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\attribution-engine\LLM-context-docs\TREE-moreways-pixel.md" --tree-only

moreways pixel docker:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\attribution-engine\docker" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\attribution-engine\LLM-context-docs\tests-moreways-docker.md"

--------

## moreways-deck

moreways deck src

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\moreways-deck\src" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\moreways-deck\SRC-moreways-deck.md"

moreways deck full tree:

python "C:\dev-utils\list_tree.py" "C:\projects\moreways\moreways-deck" --depth 10 --ignore node_modules .expo .git __pycache__ dist build --list-scripts .ts .tsx .js .jsx .py .html .css .json .txt .sql .toml .ps1 .ejs .md --include-readme --output "C:\projects\moreways\moreways-deck\TREE-moreways-deck.md" --tree-only
