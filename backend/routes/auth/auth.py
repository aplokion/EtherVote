from flask import Blueprint
from .login import login
from .register import register

auth_bp = Blueprint('auth', __name__)


auth_bp.add_url_rule('/login', view_func=(login), endpoint='login', methods=['POST', 'GET'])
auth_bp.add_url_rule('/register', view_func=(register), endpoint='register', methods=['POST', 'GET'])
