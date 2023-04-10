from flask import Flask#, render_template, url_for, request, redirect
from pymongo import MongoClient
#from wtforms import Form, TextField, BooleanField, validators
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017:nutritionPlan'
app.config['SECRET_KEY'] = '2d700b21121a0917e03ae0ed'
mongo = MongoClient(app.config['MONGO_URI'])
bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
login_manager.login_view = 'checkLogin'
login_manager.login_message_category = "info"

from nutritionPlan import routes