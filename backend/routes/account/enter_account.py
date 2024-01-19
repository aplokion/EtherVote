from flask import session, redirect, url_for, render_template, jsonify
from utils.blockchain_action import get_elections_user_voted_in, get_elections_user_create


def enter_account():
    user_token = session.get("token")
    if not user_token:
        return redirect(url_for('auth.login'))
    return render_template('account.html', username=session.get("username"))


def get_elections_list():
    try:
        user_token = session.get("token")
        if not user_token:
            return redirect(url_for('auth.login'))
        elections = get_elections_user_voted_in(user_token)
        return jsonify(elections)
    except Exception as e:
        return jsonify({"error": "Ошибка при получении голосований",
                        "message": str(e)}), 500


def get_created_elections_list():
    try:
        user_token = session.get("token")
        if not user_token:
            return redirect(url_for('auth.login'))
        elections = get_elections_user_create(user_token)
        return jsonify(elections)
    except Exception as e:
        return jsonify({"error": "Ошибка при получении голосований",
                        "message": str(e)}), 500
