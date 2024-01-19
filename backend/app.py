from flask import Flask, redirect, url_for, session

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


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))


if __name__ == '__main__':
    app.run(debug=True)
