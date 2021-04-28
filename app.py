import csv
from flask import Flask, render_template, url_for, request, redirect, stream_with_context
from io import StringIO
from werkzeug.wrappers import Response
from wtforms import Form, TextField, BooleanField, validators


app = Flask(__name__)

# This is designed to take in the array of answers and process them into a .csv for machineLearningTesting.py to use to train and test the data
# Need to declare responses as variables and find a proper way to constrain them (fixed responses through a dropdown?)
#

@app.route('/', methods=['POST', 'GET'])
def getAnswers():
    if request.method == "POST":
        answers = []
        answers.append(request.form.get('sex'))
        answers.append(request.form.get('age'))
        answers.append(request.form.get('height'))
        answers.append(request.form.get('weight'))
        answers.append(request.form.get('activity'))
        answers.append(request.form.get('meals'))
        answers.append(request.form.get('snacks'))

        @stream_with_context
        def generateCSV():
            data = StringIO()
            writer = csv.writer(data)

            # write header
            writer.writerow(('sex', 'age', 'height', 'weight', 
                             'activity', 'meals', 'snacks'))
            yield data.getvalue()
            data.seek(0)
            data.truncate(0)
        
            # write each log item
            writer.writerow((
                answers[0], answers[1], answers[2], answers[3],
                answers[4], answers[5], answers[6]
            ))
            yield data.getvalue()
            data.seek(0)
            data.truncate(0)

        # stream the response as the data is generated
        response = Response(generateCSV(), mimetype='text/csv')
        # add a filename
        response.headers.set("Content-Disposition",
                            "attachment", filename="answers.csv")
        return response
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
