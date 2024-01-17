from flask import Blueprint
from .enter_home import home, get_all_votings_homepage, vote, create_voting_homepage
# from flask_login import login_required

home_bp = Blueprint('home', __name__)


home_bp.add_url_rule('/', view_func=(home), methods=['GET'])
home_bp.add_url_rule('/get_all_votings', view_func=(get_all_votings_homepage), methods=['GET'])
home_bp.add_url_rule('/vote', view_func=(vote), methods=['POST'])
home_bp.add_url_rule('/create_voting', view_func=(create_voting_homepage), methods=['POST'])
