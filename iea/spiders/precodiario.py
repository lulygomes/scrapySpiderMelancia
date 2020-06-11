# -*- coding: utf-8 -*-
import scrapy
import pymongo
from unidecode import unidecode
#User: dbUser
#Senha: 4Jcg6sQsHMGHd9TF



client = pymongo.MongoClient("mongodb+srv://dbUser:4Jcg6sQsHMGHd9TF@cluster0-074iv.gcp.mongodb.net/test?retryWrites=true&w=majority")
#client = pymongo.MongoClient('mongodb://127.0.0.1:27017')

db = client['dbCotacoes'] #criando banco
colContacao = db['cotacoes'] #criando collection
colOpcao = db['opcoes']

def limpaOpcoes(lista):
    novalista = []
    for i in lista:
        if i not in novalista:
            novalista.append(i)
    return novalista

def removeEspaco(lista): 
    newList = []
    for i in lista:
        newList.append({'Produto' : i["Produto"].split(' ')[0]})

    return newList

def imprime(lista):
    for i in lista:
        print(i)

class PrecodiarioSpider(scrapy.Spider):
    name = 'precodiario'
    allowed_domains = ['ciagri.iea.sp.gov.br/precosdiarios/']
    start_urls = ['http://ciagri.iea.sp.gov.br/precosdiarios/']
    
    def parse(self, response):
        #table = response.css('table.tabela_dados ')
        data = { "data": response.css('div span#ctl00_ContentPlaceHolder1_lblRecebidosData ::text').get() }
        
        rowsTb0 = response.css('table.tabela_dados')[0].css('tr')
        rowsTb1 = response.css('table.tabela_dados')[1].css('tr')
        rowsTb2 = response.css('table.tabela_dados')[2].css('tr')

        dados = []
        opcoes = []
        dados.append(data)
        
        for row in rowsTb0[1:]:
            produto = row.css('td ::text').get()
            cidade = row.css('td ::text')[1].get()
            valor = row.css('td ::text')[2].get()
            unidade = row.css('td ::text')[3].get()
            linha = { 
                "Produto": unidecode(produto.strip()),
                "Mercado": cidade.strip(),
                "Valor": valor.strip(),
                "Unidade": unidade.strip(),
                "Descricao": "..."
            }
            dados.append(linha)

            linhaOpcao = { "Produto": unidecode(produto.strip()) }
            opcoes.append(linhaOpcao)

        for row in rowsTb1[1:]:
            produto = row.css('td ::text')[1].get()
            descricao = row.css('td ::text')[2].get()
            unidade = row.css('td ::text')[3].get()
            precoMin = row.css('td ::text')[4].get()
            precoMed = row.css('td ::text')[5].get()
            precoMax = row.css('td ::text')[6].get()
            linha = {
                "Produto": unidecode(produto.strip()),
                "Descricao": descricao.strip(),
                "Unidade": unidade.strip(),
                "PrecoMin": precoMin.strip(),
                "Valor": precoMed.strip(),
                "PrecoMax": precoMax.strip(),
                "Mercado": "..."
            }
            dados.append(linha)

            linhaOpcao = { "Produto": unidecode(produto.strip()) }
            opcoes.append(linhaOpcao)

        for row in rowsTb2[1:]:
            produto = row.css('td ::text').get()
            mercado = row.css('td ::text')[1].get()
            entrada = row.css('td ::text')[2].get()
            cotacao = row.css('td ::text')[3].get()
            valor = row.css('td ::text')[4].get()
            unidade = row.css('td ::text')[5].get()
            linha = {
                "Produto": unidecode(produto.strip()),
                "Mercado": mercado.strip(),
                "Entrada": entrada.strip(),
                "Cotacao": cotacao.strip(),
                "Valor": valor.strip(),
                "Unidade": unidade.strip()
            }
            dados.append(linha)

            linhaOpcao = { "Produto": unidecode(produto.strip()) }
            opcoes.append(linhaOpcao)
        
        #opcoes = limpaOpcoes(opcoes)
        opcoes = removeEspaco(opcoes)
        opcoes = limpaOpcoes(opcoes)
        
        if len(dados) > 0:
            colContacao.drop()
            colOpcao.drop()
            colContacao.insert_many(dados)
            colOpcao.insert_many(opcoes)
        print('Total de {} dados coletados, com data de {}'.format(len(dados)-1, data["data"]))
