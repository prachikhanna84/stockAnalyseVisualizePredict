import quandl
import pandas as pd
from config import apikey
from inputfile import tickers,startDate,endDate
from stockstats import StockDataFrame
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

quandl.ApiConfig.api_key = apikey
engine = create_engine("sqlite:///resources/stock.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()


@app.route('/')
def home():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/loadData<br/>"
        f"/api/v1.0/getData/<ticker><br/>"
    )    


@app.route("/api/v1.0/loadData")
def loadData():
    conn = engine.connect()
    session = Session(engine)
    data = quandl.get_table('WIKI/PRICES', qopts = { 'columns': ['ticker', 'date', 'open','high','low','close','volume'] }, ticker = tickers, date = { 'gte': startDate, 'lte': endDate })

    stock = StockDataFrame.retype(data)
    data['macd']=stock['macd']
    data['signal']=stock['macds']
    data=data.sort_values(by=['ticker','date'],ascending=False)

    for i in range(1, len(data)):
        #                          # If the MACD crosses the signal line upward
        if data.iloc[i,8] > data.iloc[i,12] and data.iloc[i-1,8] <= data.iloc[i-1,12]:
            data['suggestion']='BUY'
            #                          # The other way around
        elif data.iloc[i,8] < data.iloc[i,12] and data.iloc[i-1,8] >= data.iloc[i-1,12]:
            data['suggestion']='SELL'

        #                          # Do nothing if not crossed
        else:
            data['suggestion']='HOLD'


    data.sort_values(by=['suggestion'])
    data=data.reset_index()
    Base.metadata.drop_all(engine)   # all tables are deleted

    data.to_sql('stockdata', con=engine)
    print(Base.classes.keys())
    session.close()

    return "success"

@app.route("/api/v1.0/getData/<ticker>")
def getData(ticker):
    statement="select * from stockdata where ticker = '{}'".format(ticker)
    conn = engine.connect()
    df = pd.read_sql(statement, conn)
    df.set_index('index')
    print("after")
    return df.to_json(orient='index')
    # return statement