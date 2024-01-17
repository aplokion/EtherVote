from flask import session, redirect, url_for, render_template, jsonify


def enter_account():
    user_token = session.get("token")
    if not user_token:
        return redirect(url_for('auth.login'))
    return render_template('account.html', username=session.get("username"))


def get_elections_list():
    user_token = session.get("token")
    if not user_token:
        return redirect(url_for('auth.login'))

    return jsonify({})
