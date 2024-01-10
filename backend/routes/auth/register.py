from classes.registration import RegistrationForm
from flask import jsonify, request
from utils.blockchain_action import register_user


def register():
    if request.method == "POST":
        form = RegistrationForm()

        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            reg = register_user(username, password)
            if list(reg.keys())[0] == 'success':
                return jsonify({"success": reg.get("success")})
            else:
                return jsonify({"error": reg}, 500)
