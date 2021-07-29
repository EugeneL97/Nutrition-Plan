from nutritionPlan import app
from nutritionPlan.models import AnswersDB
from flask import render_template, request

@app.route('/', methods=['POST', 'GET'])
def getAnswers():
    if request.method == "POST":
        questions = ['sex', 'age', 'heightInCm',
        'weightInKg', 'activity', 'meals', 'snacks']
        answers = []

        for i in questions:
            answers.append(request.form.get(i))

        return 
    else:
        return render_template("index.html")