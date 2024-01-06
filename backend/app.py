from flask import Flask, redirect, url_for
# from web3 import Web3
from routes import auth_bp, home_bp, account_bp

app = Flask(__name__)
# CORS(app)
app.config['SECRET_KEY'] = 'banana'


app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(home_bp, url_prefix='/home')
app.register_blueprint(account_bp, url_prefix='/account')


@app.route('/')
def go_home():
    return redirect(url_for('home.home'))


if __name__ == '__main__':
    app.run(debug=True)
