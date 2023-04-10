from nutritionPlan import app, mongo, bcrypt
from nutritionPlan.models import Answers
from nutritionPlan.forms import RegisterForm, LoginForm
from flask import render_template, request, redirect, url_for, flash
from flask_login import current_user, login_user, logout_user, login_required

@app.route('/')
@app.route('/home')
def homePage():
    return render_template('home.html')

@app.route('/createAccount', methods=['POST', 'GET'])
def createAccount():
    form = RegisterForm()
    if form.validate_on_submit():
        userToCreate = {
            "username": form.username.data,
            "emailAddress": form.emailAddress.data,
            "password": bcrypt.generate_password_hash(form.password1.data).decode('utf-8')
        }    

        mongo.db.users.insert_one(userToCreate)
        flash('User created successfully!', category='success')
        return redirect(url_for('homePage'))
    if form.errors != {}:
        for errorMsg in form.errors.values():
            flash(f'Error with creating an account: {errorMsg}', category='danger')

    return render_template('createAccount.html', form=form)

#Login -> form
#Need to login in order to access the form
@app.route('/login', methods=['POST', 'GET'])
def checkLogin():
    form = LoginForm()
    if form.validate_on_submit():
        attemptedUser = mongo.db.users.find_one({"username": form.username.data})
        if attemptedUser and bcrypt.check_password_hash(attemptedUser["password"], form.password.data):
            login_user(attemptedUser)
            flash('Login successful!', category='success')
            return redirect(url_for('homePage'))
            
        else:
            flash('The username and password combo does not exist!', category='danger')
    return render_template("login.html", form=form)

@app.route('/logout')
def logoutUser():
    logout_user()
    flash('Logged out successfully!', category='info')
    return redirect(url_for("homePage"))

#Form -> answers
@app.route('/form', methods=['POST', 'GET'])
@login_required
def formPage():
    if request.method == "POST":
        answers = {
            "user_id": current_user["_id"],
            "sex": request.form['sex'],
            "age": request.form['age'],
            "heightInCm": request.form['height'],
            "weightInKg": request.form['weight'],
            "activity": request.form['activity'],
            "meals": request.form['meals'],
            "snacks": request.form['snacks']
        }
        try:
            mongo.db.answers.insert_one(answers)
            return render_template("answers.html")
        except:
            return "You broke my code. I hope you're happy."
    else:
        return render_template("form.html")
    
@app.route('/answers')
@login_required
def answers():
    user_answers = mongo.db.answers.find_one({"user_id": current_user["_id"]})
    return render_template('answers.html', user_answers=user_answers)
#Need a route (login page start of website)
#Need username/email to login (how they reference their submission in the database)
    #If new user, fill out the nutrition plan
    #Existing users can choose to view their old nutrition plan (their answers)
    #Or choose to update it with a new response