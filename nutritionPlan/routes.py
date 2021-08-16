from nutritionPlan import app
from nutritionPlan.models import AnswersDB, userInfo, db
from nutritionPlan.forms import createAccForm, loginForm
from flask import render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required

@app.route('/')
@app.route('/home')
def homePage():
    return render_template('home.html')

@app.route('/createAccount', methods=['POST', 'GET'])
def createAccount():
    form = createAccForm()
    if form.validate_on_submit():
        userToCreate = userInfo(username=form.username.data,
                            emailAddress=form.emailAddress.data,
                            passwordHashAlgo=form.password1.data)
        db.session.add(userToCreate)
        db.session.commit()

        flash('User created successfully!', category='success')
        return redirect(url_for('homePage'))
    if form.error != {}:
        for errorMsg in form.errors.values():
            flash(f'Error with creating an account: {errorMsg}', category='danger')
    return render_template('createAccount.html', form=form)

#Login -> form
#Need to login in order to access the form
@app.route('/login', methods=['POST', 'GET'])
def checkLogin():
    form = loginForm()
    if form.validate_on_submit():
        attemptedUser = userInfo.query.filter_by(username=form.username.data).first()
        if attemptedUser and attemptedUser.check_password_correction(
            attemptedPassword=form.password.data
        ):
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