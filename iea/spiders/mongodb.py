import pymongo

client = pymongo.MongoClient('mongodb://127.0.0.1:27017')



""" 
# Lista os bancos criados
print(client.list_database_names())
dblist = client.list_database_names()
if 'wm' in dblist:
    print('The database exists.')
 """

# Criando collection
db = client['banco-teste'] #criando banco
col = db['clientes'] #criando collection
 
""" 
# Inserindo dados na collection
dados = { 
    "nome": "Luiz",
    "Endereço": "Rua 3",
    "Cidade": "Tupã"
    }
x = col.insert_one(dados)
 """

# Inserindo varios dados na collection
mylist = [
  { "name": "Amy", "address": "Apple st 652"},
  { "name": "Hannah", "address": "Mountain 21"},
  { "name": "Michael", "address": "Valley 345"},
  { "name": "Sandy", "address": "Ocean blvd 2"},
  { "name": "Betty", "address": "Green Grass 1"},
  { "name": "Richard", "address": "Sky st 331"},
  { "name": "Susan", "address": "One way 98"},
  { "name": "Vicky", "address": "Yellow Garden 2"},
  { "name": "Ben", "address": "Park Lane 38"},
  { "name": "William", "address": "Central st 954"},
  { "name": "Chuck", "address": "Main Road 989"},
  { "name": "Viola", "address": "Sideway 1633"}
]

x = col.insert_many(mylist)