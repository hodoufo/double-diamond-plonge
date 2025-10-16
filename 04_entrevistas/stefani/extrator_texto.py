#!/usr/bin/env python3
"""
Script para extrair texto de PDFs e fazer OCR de imagens
Autor: Assistente AI
Data: 2025
"""

import os
import sys
from pathlib import Path
import PyPDF2
import pytesseract
from PIL import Image
import argparse

def extrair_texto_pdf(caminho_pdf):
    """
    Extrai texto de um arquivo PDF
    """
    try:
        with open(caminho_pdf, 'rb') as arquivo:
            leitor_pdf = PyPDF2.PdfReader(arquivo)
            texto_completo = ""
            
            for pagina_num, pagina in enumerate(leitor_pdf.pages, 1):
                texto_pagina = pagina.extract_text()
                if texto_pagina.strip():
                    texto_completo += f"\n--- PÁGINA {pagina_num} ---\n"
                    texto_completo += texto_pagina + "\n"
            
            return texto_completo
    except Exception as e:
        return f"Erro ao processar PDF {caminho_pdf}: {str(e)}"

def extrair_texto_imagem(caminho_imagem):
    """
    Extrai texto de uma imagem usando OCR
    """
    try:
        imagem = Image.open(caminho_imagem)
        texto = pytesseract.image_to_string(imagem, lang='por')
        return texto
    except Exception as e:
        return f"Erro ao processar imagem {caminho_imagem}: {str(e)}"

def processar_arquivos(pasta):
    """
    Processa todos os PDFs e imagens na pasta
    """
    pasta_path = Path(pasta)
    resultados = {}
    
    # Processar PDFs
    for arquivo_pdf in pasta_path.glob("*.pdf"):
        print(f"Processando PDF: {arquivo_pdf.name}")
        texto = extrair_texto_pdf(arquivo_pdf)
        resultados[arquivo_pdf.name] = {
            'tipo': 'PDF',
            'texto': texto
        }
    
    # Processar imagens
    extensoes_imagem = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
    for ext in extensoes_imagem:
        for arquivo_img in pasta_path.glob(f"*{ext}"):
            print(f"Processando imagem: {arquivo_img.name}")
            texto = extrair_texto_imagem(arquivo_img)
            resultados[arquivo_img.name] = {
                'tipo': 'IMAGEM',
                'texto': texto
            }
    
    return resultados

def salvar_resultados(resultados, pasta_saida):
    """
    Salva os resultados em arquivos de texto
    """
    pasta_saida = Path(pasta_saida)
    pasta_saida.mkdir(exist_ok=True)
    
    # Salvar cada arquivo individualmente
    for nome_arquivo, dados in resultados.items():
        nome_saida = Path(nome_arquivo).stem + "_transcricao.txt"
        caminho_saida = pasta_saida / nome_saida
        
        with open(caminho_saida, 'w', encoding='utf-8') as f:
            f.write(f"ARQUIVO: {nome_arquivo}\n")
            f.write(f"TIPO: {dados['tipo']}\n")
            f.write("=" * 50 + "\n\n")
            f.write(dados['texto'])
        
        print(f"Transcrição salva: {caminho_saida}")
    
    # Salvar arquivo consolidado
    caminho_consolidado = pasta_saida / "transcricao_completa.txt"
    with open(caminho_consolidado, 'w', encoding='utf-8') as f:
        f.write("TRANSCRIÇÕES COMPLETAS - PASTA STEFANI\n")
        f.write("=" * 60 + "\n\n")
        
        for nome_arquivo, dados in resultados.items():
            f.write(f"\n{'='*60}\n")
            f.write(f"ARQUIVO: {nome_arquivo}\n")
            f.write(f"TIPO: {dados['tipo']}\n")
            f.write(f"{'='*60}\n\n")
            f.write(dados['texto'])
            f.write("\n\n")
    
    print(f"Arquivo consolidado salvo: {caminho_consolidado}")

def main():
    parser = argparse.ArgumentParser(description='Extrair texto de PDFs e imagens')
    parser.add_argument('--pasta', default='.', help='Pasta para processar (padrão: pasta atual)')
    parser.add_argument('--saida', default='transcricoes', help='Pasta de saída (padrão: transcricoes)')
    
    args = parser.parse_args()
    
    print("Iniciando extração de texto...")
    print(f"Pasta de origem: {args.pasta}")
    print(f"Pasta de saída: {args.saida}")
    print("-" * 40)
    
    # Verificar se as dependências estão instaladas
    try:
        import PyPDF2
        import pytesseract
        from PIL import Image
    except ImportError as e:
        print(f"Erro: Dependência não encontrada: {e}")
        print("\nPara instalar as dependências, execute:")
        print("pip install PyPDF2 pytesseract pillow")
        print("\nPara o tesseract OCR, instale também:")
        print("brew install tesseract tesseract-lang")
        sys.exit(1)
    
    # Processar arquivos
    resultados = processar_arquivos(args.pasta)
    
    if not resultados:
        print("Nenhum arquivo PDF ou imagem encontrado na pasta.")
        return
    
    # Salvar resultados
    salvar_resultados(resultados, args.saida)
    
    print(f"\nProcessamento concluído! {len(resultados)} arquivos processados.")
    print(f"Resultados salvos na pasta: {args.saida}")

if __name__ == "__main__":
    main()
