from flask import Blueprint
from .enter_home import home

home_bp = Blueprint('home', __name__)


home_bp.add_url_rule('/', view_func=(home), methods=['GET'])
