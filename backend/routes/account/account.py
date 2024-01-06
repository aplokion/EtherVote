from flask import Blueprint
from .enter_account import enter_account, get_elections_list

account_bp = Blueprint('account', __name__)

account_bp.add_url_rule('/', view_func=(enter_account), endpoint='account', methods=['GET'])
account_bp.add_url_rule('/get_user_elections_list', view_func=(get_elections_list), endpoint='get_user_elections_list', methods=['GET'])
