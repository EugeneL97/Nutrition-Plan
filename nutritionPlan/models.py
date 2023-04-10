from nutritionPlan import mongo, bcrypt, login_manager
from flask_login import UserMixin
from pymongo import MongoClient

db = mongo.NutritionPlan

@login_manager.user_loader
def load_user(user_id):
    user_data = db.users.find_one({'id': int(user_id)})
    if user_data:
        return User(user_data)
    return None

class User:
    def __init__(self, user_data):
        
        self.id = str(user_data['id'])
        self.emailAddress = user_data['emailAddress']
        self.username = user_data['username']
        self.passwordHash = user_data['passwordHash']
        self.passwordSalt = user_data['passwordSalt']

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, plainTextPassword):
        self.passwordSalt = bcrypt.gensalt().decode('utf-8')
        self.passwordHash = bcrypt.hashpw(plainTextPassword.encode('utf-8'), self.passwordSalt.encode('utf-8')).decode('utf-8')

    def check_password_correction(self, attemptedPassword):
        return bcrypt.checkpw(attemptedPassword.encode('utf-8'), self.passwordHash.encode('utf-8'))

class Answers(db.Document):
    sex = db.StringField(default='M', required=True)
    age = db.IntField(default=18, required=True)
    heightInCm = db.IntField(default=172, required=True)
    weightInKg = db.IntField(default=62, required=True)
    activity = db.IntField(default=0, required=True)
    meals = db.IntField(default=1, required=True)
    snacks = db.IntField(default=0, required=True)