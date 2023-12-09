# instalar flask con pip install flask
from flask import Flask, jsonify, request
# instalar flask_cors con pip install flask_cors
from flask_cors import CORS
import mysql.connector
import os
import time, datetime

app = Flask(__name__)
# permitir acceso desde cualquier origen externo
CORS(app, resources={r"/*": {"origins": "*"}})

class Mensaje:
    # constructor de la clase
    def __init__(self, host, user, password, database):
        # establecemos una conexión con la base de datos sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        # creamos un cursor para poder realizar consultas en la base de datos
        self.cursor = self.conn.cursor()
        # intentamos seleccionar la base de datos, si no existe la creamos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
        # creamos la tabla mensajes si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS mensajes (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            nombre VARCHAR(30) NOT NULL,
            apellido VARCHAR(30) NOT NULL,
            telefono VARCHAR(15) NOT NULL,
            email VARCHAR(60) NOT NULL,
            mensaje VARCHAR(500) NOT NULL,
            fecha_envio  datetime NOT NULL,
            leido BOOLEAN NOT NULL DEFAULT FALSE,
            gestion varchar(500) NOT NULL DEFAULT 'Sin gestion',
            fecha_gestion datetime DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci 
            ''')
        self.conn.commit()
        # cerramos el cursor inicial y abrimos uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        
    # método para insertar un mensaje en la base de datos
    def enviar_mensaje(self, nombre, apellido, telefono, email, consulta):
        sql = "INSERT INTO mensajes (nombre, apellido, telefono, email, mensaje, fecha_envio) VALUES (%s, %s, %s, %s, %s, %s)"
        # obtenemos la fecha actual
        fecha_envio = datetime.datetime.now()
        valores = (nombre, apellido, telefono, email, consulta, fecha_envio)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        # self.cursor.close()
        return True
    
    # listar mensajes
    def listar_mensajes(self):
        self.cursor.execute("SELECT * FROM mensajes")
        mensajes = self.cursor.fetchall()
        return mensajes
    
    # responder mensaje
    def responder_mensaje(self, id, gestion):
        sql = "UPDATE mensajes SET gestion = %s, leido = TRUE, fecha_gestion = %s WHERE id = %s"
        # obtenemos la fecha actual
        fecha = datetime.datetime.now()
        valores = (gestion, fecha, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0 # devuelve True si se ha actualizado algún registro
    
    # eliminar mensaje
    def eliminar_mensaje(self, id):
        sql = "DELETE FROM mensajes WHERE id = %s"
        valores = (id,)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    # mostrar mensaje
    def mostrar_mensaje(self, id):
        sql = "SELECT * FROM mensajes WHERE id = %s"
        valores = (id,)
        self.cursor.execute(sql, valores)
        mensaje = self.cursor.fetchone()
        return mensaje
# creamos una instancia de la clase Mensaje
mensaje = Mensaje( host='enzosoliz.mysql.pythonanywhere-services.com', user='enzosoliz', password='radi4850', database='enzosoliz$clientes')

# ruta para listar mensajes

@app.route('/mensajes', methods=['GET'])
def listar_mensajes():
    respuesta = mensaje.listar_mensajes()
    return jsonify(respuesta)
# ruta para agregar mensaje
@app.route('/mensajes', methods=['POST'])
def agregar_mensaje():
    # obtenemos los datos del formulario
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    telefono = request.form.get('telefono')
    email = request.form.get('email')
    consulta = request.form.get('mensaje')
    
    if mensaje.enviar_mensaje(nombre, apellido, telefono, email, consulta):
        return jsonify({'mensaje': 'Mensaje enviado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al enviar el mensaje'}), 400
    
# ruta para responder mensaje
@app.route('/mensajes/<int:id>', methods=['PUT'])
def responder_mensaje(id):
    # obtenemos los datos del formulario
    gestion = request.form.get('gestion')
    if mensaje.responder_mensaje(id, gestion):
        return jsonify({'mensaje': 'Mensaje respondido correctamente'}), 200
    else:
        return jsonify({'mensaje': 'Error al responder el mensaje'}), 403
    

# enviar mensaje para comprobar que el servidor está funcionando
# mensaje.enviar_mensaje("Juan", "Perez", "123456789", "juanPerez@gmail.com", "Hola, esto es un mensaje de prueba")

# respuesta = mensaje.listar_mensajes()
# print(respuesta)
# mensaje.responder_mensaje(1, "Mensaje respondido")

# cotrolamos el comportamiento del script cuando se ejecuta
if __name__ == "__main__":
    app.run(debug=True)
