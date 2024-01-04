from flask import Flask
# from web3 import Web3
from routes import auth_bp, home_bp

app = Flask(__name__)
# CORS(app)
app.config['SECRET_KEY'] = 'banana'


app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(home_bp, url_prefix='/home')


if __name__ == '__main__':
    app.run(debug=True)
