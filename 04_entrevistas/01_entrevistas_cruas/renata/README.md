# Entrevista Renata - Arquivos Finais

## Arquivos Mantidos

### 1. Arquivo Original
- **`Sal, Renata-pt-1.vtt`** (43KB) - Arquivo VTT original com timestamps e transcrição completa

### 2. Script de Processamento
- **`agrupar_falas_intercaladas.py`** (5.3KB) - Script Python otimizado para agrupar falas usando timestamps

### 3. Resultado Final
- **`Sal, Renata-pt-1_dialogo_intercaladas.txt`** (21KB) - Diálogo processado com 80 falas agrupadas

## Como Usar

```bash
# Executar o script para processar o arquivo VTT
python3 agrupar_falas_intercaladas.py
```

## Características do Processamento

- ✅ **Agrupa falas consecutivas** do mesmo falante usando timestamps
- ✅ **Gap máximo de 5 segundos** entre falas para considerar como fragmentação
- ✅ **Falas curtas (< 15 caracteres)** são agrupadas com a próxima fala do mesmo falante
- ✅ **Nomes sem parênteses** (ex: "Rodolfo Sousa:" em vez de "(Rodolfo Sousa):")
- ✅ **Redução significativa**: de 1.919 linhas para 80 falas agrupadas
- ✅ **Texto original preservado** sem alterações

## Resultado

O arquivo final contém um diálogo limpo e legível, ideal para análise e leitura da entrevista.
