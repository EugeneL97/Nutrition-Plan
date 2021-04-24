import csv
from flask import Flask, render_template, url_for, request, redirect
from io import StringIO
from werkzeug.wrappers import Response
from wtforms import Form, TextField, BooleanField, validators


app = Flask(__name__)

# This is designed to take in the array of answers and process them into a .csv for machineLearningTesting.py to use to train and test the data
# Need to declare responses as variables and find a proper way to constrain them (fixed responses through a dropdown?)
#

answers = [(0, 18, 183, 160,
            1, 2, 0)]

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/answers', methods=['POST', 'GET'])
def getAnswers():
    def generate():
        data = StringIO()
        writer = csv.writer(data)

        # write header
        writer.writerow(('sex', 'age', 'height', 'weight', 'activityLevel',
                        'meals', 'snacks'))
        yield data.getvalue()
        data.seek(0)
        data.truncate(0)

        # write each log item
        for item in answers:
            writer.writerow((
                item[0], item[1], item[2], item[3],
                item[4], item[5], item[6],
            ))
            yield data.getvalue()
            data.seek(0)
            data.truncate(0)

    text = request.form['age']
    processed_text = text.upper()
    print(processed_text)
    # stream the response as the data is generated
    response = Response(generate(), mimetype='text/csv')
    # add a filename
    response.headers.set("Content-Disposition",
                         "attachment", filename="answers.csv")
    return response


if __name__ == "__main__":
    app.run(debug=True)
