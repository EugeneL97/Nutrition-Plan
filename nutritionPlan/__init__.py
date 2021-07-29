from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from wtforms import Form, TextField, BooleanField, validators

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///answers.db'
db = SQLAlchemy(app)

from nutritionPlan import routes