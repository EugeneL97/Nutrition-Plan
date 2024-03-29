from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Length, EqualTo, Email, DataRequired, ValidationError
from nutritionPlan import mongo

class RegisterForm(FlaskForm):
    
    #FlaskForm checks "validate_" functions for anything after the underscore
    #in this case username exists below so this naming convention is crucial for this to work

    def validate_username(self, usernameToCheck):
        user = mongo.db.users.find_one({'username': usernameToCheck.data})
        if user:
            raise ValidationError('That username is already taken!')
    
    def validate_emailAddress(self, emailAddressToCheck):
        email = mongo.db.users.find_one({'emailAddress': emailAddressToCheck.data})
        if email:
            raise ValidationError('An account with that email already exists!')

    username = StringField(label='User Name:', validators=[Length(min=2, max=30), DataRequired()])
    emailAddress = StringField(label='Email:', validators=[Email(), DataRequired()])
    password1 = PasswordField(label='Password:', validators=[Length(min=6), DataRequired()])
    password2 = PasswordField(label='Confirm Password:', validators=[EqualTo('password1'), DataRequired()])
    submit = SubmitField(label='Create Account')

class LoginForm(FlaskForm):
    username = StringField(label='User Name:', validators=[DataRequired()])
    password = PasswordField(label='Password:', validators=[DataRequired()])
    submit = SubmitField(label='Login')