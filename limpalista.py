lista = [
    { 'Produto': 'nome sobre' },
    { 'Produto': 'nome sobre' },
    { 'Produto': 'nome1 sobre' },
    { 'Produto': 'nome2 sobre' },
    { 'Produto': 'nome3 sobre' },
    { 'Produto': 'nome4' },
    { 'Produto': 'nome5' },
]



def limpaOpcoes(lista):
    novalista = []
    for i in lista:
        if i not in novalista:
            novalista.append(i)
    return novalista

def removeEspaco(lista): 
    newList = []
    for i in lista:
        newList.append(i['Produto'].split(' ')[0])

    return newList

novalista = removeEspaco(limpaOpcoes(lista))

print(novalista)


      

