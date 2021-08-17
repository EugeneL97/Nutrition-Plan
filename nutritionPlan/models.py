from enum import unique
from os import EX_TEMPFAIL
from nutritionPlan import db, bcrypt, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return userInfo.query.get(int(user_id))

class userInfo(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    emailAddress = db.Column(db.String(254), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    passwordSalt = db.Column(db.String(50), nullable=True)
    passwordHash = db.Column(db.String(50))

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, plainTextPassword):
        self.passwordHash = bcrypt.generate_password_hash(plainTextPassword).decode('utf-8')

    def check_password_correction(self, attemptedPassword):
        return bcrypt.check_password_hash(self.passwordHash, attemptedPassword)

class Answers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sex = db.Column(db.String(length=1), default='M', nullable=False)
    age = db.Column(db.SmallInteger, default=18, nullable=False)
    heightInCm = db.Column(db.SmallInteger, default=172, nullable=False)
    weightInKg = db.Column(db.SmallInteger, default=62, nullable=False)
    activity = db.Column(db.SmallInteger, default=0, nullable=False)
    meals = db.Column(db.SmallInteger, default=1,nullable=False)
    snacks = db.Column(db.SmallInteger, default=0, nullable=False)