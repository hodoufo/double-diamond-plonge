# Extrator de Texto - PDFs e Imagens

Este script Python extrai texto de arquivos PDF e faz OCR (reconhecimento óptico de caracteres) de imagens.

## Instalação

1. **Instalar dependências Python:**
```bash
pip install -r requirements.txt
```

2. **Instalar Tesseract OCR (necessário para processar imagens):**
```bash
# No macOS com Homebrew:
brew install tesseract tesseract-lang

# No Ubuntu/Debian:
sudo apt-get install tesseract-ocr tesseract-ocr-por

# No Windows:
# Baixe e instale do site oficial: https://github.com/UB-Mannheim/tesseract/wiki
```

## Como usar

### Uso básico (processa pasta atual):
```bash
python extrator_texto.py
```

### Especificar pasta de origem e destino:
```bash
python extrator_texto.py --pasta /caminho/para/arquivos --saida /caminho/para/saida
```

### Exemplos:
```bash
# Processar apenas a pasta atual
python extrator_texto.py

# Processar pasta específica e salvar em outra pasta
python extrator_texto.py --pasta . --saida transcricoes

# Processar pasta pai e salvar na pasta atual
python extrator_texto.py --pasta .. --saida .
```

## O que o script faz

1. **PDFs**: Extrai texto de todos os arquivos PDF na pasta
2. **Imagens**: Faz OCR de imagens (JPG, PNG, etc.) para extrair texto
3. **Saída**: Cria arquivos de texto individuais e um arquivo consolidado

## Arquivos gerados

- `[nome_arquivo]_transcricao.txt` - Transcrição individual de cada arquivo
- `transcricao_completa.txt` - Arquivo consolidado com todas as transcrições

## Suporte a idiomas

O script está configurado para português brasileiro. Para outros idiomas, modifique a linha:
```python
texto = pytesseract.image_to_string(imagem, lang='por')
```

Idiomas disponíveis: 'eng' (inglês), 'spa' (espanhol), 'fra' (francês), etc.
