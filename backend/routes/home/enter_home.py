from flask import session, redirect, url_for, render_template


def home():
    username = session.get('username')
    if not username:
        return redirect(url_for('auth.login'))

    return render_template('home.html')
