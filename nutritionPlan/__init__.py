from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from wtforms import Form, TextField, BooleanField, validators

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///answers.db'
app.config['SECRET_KEY'] = '2d700b21121a0917e03ae0ed'
db = SQLAlchemy(app)

from nutritionPlan import routes