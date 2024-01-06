from flask import session, redirect, url_for, render_template, jsonify
from utils import get_user_elections_dict


def enter_account():
    username = session.get('username')
    if not username:
        return redirect(url_for('auth.login'))

    return render_template('account.html')


def get_elections_list():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({})

    election_dict = get_user_elections_dict(user_id)
    return jsonify(election_dict)
