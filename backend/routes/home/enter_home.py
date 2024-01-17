from flask import session, redirect, url_for, render_template, jsonify, request
from utils.blockchain_action import get_all_votings, vote_in_voting, create_voting


def home():
    print(session)
    username = session.get('username')
    if not username:
        return redirect(url_for('auth.login'))

    return render_template('home.html')


def get_all_votings_homepage():
    user_token = session.get('token')
    if not user_token:
        return redirect(url_for('auth.login'))
    votings = get_all_votings()
    response = {i: votings[i] for i in range(len(votings))}
    return jsonify(response)


def vote():
    try:
        user_token = session.get('token')
        if not user_token:
            return redirect(url_for('auth.login'))
        data = request.get_json(force=True)
        proposal_index = data.get('proposal_index')
        option_index = data.get('option_index')

        if not proposal_index or not option_index:
            raise Exception('Ошибка при получении варианта голоса')
        is_voted = vote_in_voting(user_token, proposal_index, option_index)
        if 'success' in is_voted:
            return jsonify({"success": "Ваш голос учтён"})
        elif 'error' in is_voted:
            raise Exception(is_voted.get('errorr'))

    except Exception as e:
        return jsonify({"error": "Ошибка при голосовании",
                        "message": str(e)}), 500


def create_voting_homepage():
    try:
        user_token = session.get('token')
        if not user_token:
            return redirect(url_for('auth.login'))
        data = request.get_json(force=True)
        topic = data.get('topic')
        description = data.get('description')
        options = data.get('options')

        is_voting_created = create_voting(user_token, topic, description, options)
        if 'success' in is_voting_created:
            return jsonify({"success": "Голосование успешно создано!"})
        elif 'error' in is_voting_created:
            raise Exception(is_voting_created.get('errorr'))
    except Exception as e:
        return jsonify({"error": "Ошибка при создании",
                        "message": str(e)}), 500