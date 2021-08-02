from nutritionPlan import app
from nutritionPlan.models import AnswersDB, userInfo, db
from nutritionPlan.forms import createAccForm
from flask import render_template, request, redirect

@app.route('/')
@app.route('/home')
def homePage():
    return render_template('home.html')

@app.route('/createAccount', methods=['POST', 'GET'])
def createAccount():
    form = createAccForm()
    return render_template('createAccount.html', form=form)

#Login -> form
#Need to login in order to access the form
@app.route('/login', methods=['POST', 'GET'])
def checkLogin():
    if request.method == "POST":
        login = userInfo(username=request.form['username'], password=request.form['password'])
        try:
            #Check username and password in DB (if it exists)
            #Need to understand syntax
            db.query.filter_by(username)
        except:
            return "User does not exist."
    else:
        return render_template("login.html")

#Form -> answers
@app.route('/form', methods=['POST', 'GET'])
def formPage():
    if request.method == "POST":

        answers = AnswersDB(sex=request.form['sex'], age=request.form['age'], 
                            heightInCm=request.form['height'], weightInKg=request.form['weight'],
                            activity=request.form['activity'], meals=request.form['meals'], snacks=request.form['snacks'])

        try:
            db.session.add(answers)
            db.session.commit()
            return render_template("answers.html")
        except:
            return 'how did this happen lol'

    else:
        return render_template("form.html")

#Need a route (login page start of website)
#Need username/email to login (how they reference their submission in the database)
    #If new user, fill out the nutrition plan
    #Existing users can choose to view their old nutrition plan (their answers)
    #Or choose to update it with a new response