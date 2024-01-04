from classes.registration import RegistrationForm
from flask import flash, jsonify, redirect, url_for, request
from utils.mysql_actions import register_user


def register():
    if request.method == "POST":
        form = RegistrationForm()

        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            reg = register_user(username, password)
            if reg and isinstance(reg, bool):
                flash('Registration successful! You can now log in.', 'success')
                return redirect(url_for('auth.login'))
            else:
                flash('Username already exists. Please choose a different one.', 'danger')
                return jsonify({"error": reg}, 500)
