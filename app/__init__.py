'''
TwoFortyNine -- Kazi Jamal, Eric Lau, and Raymond Lee
SoftDev1 pd9
P04 -- Let the Data Speak
2020-05-04
'''

from flask import Flask, request, redirect, session, render_template, url_for, flash
import os
import urllib.request
import json
from covid import Covid
covid = Covid()

app = Flask(__name__)
app.secret_key = os.urandom(32)

# DASHBOARD
@app.route('/')
def root():
    data = covid.get_status_by_country_name("us")
    return render_template('dashboard.html', confirmed = "{:,}".format(data['confirmed']), active = "{:,}".format(data['active']), recovered = "{:,}".format(data['recovered']), deaths = "{:,}".format(data['deaths']))

# ABOUT
@app.route('/about')
def about():
    return render_template('about.html')

# SENTIMENT ANALYSIS

# absolute path to num-articles-per-day.csv
num_articles_per_day_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "data", "num-articles-per-day.csv") 
news_domains_on_average_subjectivity_ranges_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "data", "news-domains-on-average-subjectivity-ranges.csv") 
trumps_tweets_on_polarity_range_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "data", "trump-tweets-on-polarity-range.csv") 

@app.route('/sentiment')
def sentiment():
    return render_template('sentiment/sentiment.html')


@app.route('/sentiment/publicmedia')
def publicmedia():
    return render_template('sentiment/publicmedia.html')

@app.route("/data/sentiment/publicmedia")
def publicMediaData():
    return open(num_articles_per_day_csv).read()

@app.route("/data/sentiment/newsdomainsubjectivities")
def newsDomainSubjectivities():
    return open(news_domains_on_average_subjectivity_ranges_csv).read()

@app.route("/data/sentiment/trumptweetspolarities")
def trumpTweetsPolarities():
    return open(trumps_tweets_on_polarity_range_csv).read()
    
@app.route('/sentiment/trumptweets')
def trumptweets():
    return render_template('sentiment/trumptweets.html')

# TRANSPORTATION
@app.route('/transportation')
def transportation():
    return render_template('transportation/transportation.html')


@app.route('/transportation/nycpublic')
def nycpublic():
    return render_template('transportation/nycpublic.html')


@app.route('/transportation/mobility')
def mobility():
    return render_template('transportation/mobility.html')

# NUMBERS
@app.route('/numbers')
def numbers():
    return render_template('numbers.html')


# DATA TRANSFER
def transfer_csv(file_name):
    csv_file = os.path.dirname(
        os.path.abspath(__file__)) + '/static/data/' + file_name
    return open(csv_file).read()


def request_csv(url):
    req = urllib.request.Request(url)
    req = urllib.request.urlopen(req)
    return req.read().decode('utf8')


@app.route('/data/transportation/mta')
def turnstile_transfer():
    '''
    Retrieve the CSV file containing MTA turnstile data
    '''
    return transfer_csv('mta_turnstile.csv')


@app.route('/data/transportation/covid/<file_type>')
def covid_transfer(file_type):
    '''
    Retrieve CSV files from the official NYC Health GitHub repository
    '''
    return request_csv(f'https://raw.githubusercontent.com/nychealth/coronavirus-data/master/{file_type}.csv')


if __name__ == '__main__':
    app.debug = True
    app.run()
