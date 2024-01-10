from classes.login import LoginForm
from classes.registration import RegistrationForm
from flask import render_template, flash, request, session, jsonify
from utils.blockchain_action import get_user_info


def login():
    form_login = LoginForm()
    form_register = RegistrationForm()
    if request.method == "POST":
        if form_login.validate_on_submit():
            username = form_login.username.data
            password = form_login.password.data
            token = form_login.token.data
            user = get_user_info(token, username, password)
            if user:
                flash('Login successful!', 'success')
                session["username"] = username
                session["token"] = token
                return jsonify({"success": "Login successefuly"})
            else:
                return jsonify({"error": "Invalid username/password/token. Please try again."})

    if request.method == "GET":
        return render_template('login.html', form_login=form_login, form_register=form_register)
