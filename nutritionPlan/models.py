from nutritionPlan import db

class AnswersDB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sex = db.Column(db.String(length=1), default='M', nullable=False)
    age = db.Column(db.SmallInteger, default=18, nullable=False)
    heightInCm = db.Column(db.SmallInteger, default=172, nullable=False)
    weightInKg = db.Column(db.SmallInteger, default=62, nullable=False)
    activity = db.Column(db.SmallInteger, default=0, nullable=False)
    meals = db.Column(db.SmallInteger, default=1,nullable=False)
    snacks = db.Column(db.SmallInteger, default=0, nullable=False)