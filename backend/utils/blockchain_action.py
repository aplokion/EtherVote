from web3 import Web3
import bcrypt
from .contracts_info import read_contract_info
import web3.exceptions as w3except
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))  # Замените на свой адрес Ethereum узла
w3.eth.defaultAccount = w3.eth.accounts[0]  # Устанавливаем аккаунт по умолчанию

print(w3.eth.defaultAccount)


def get_free_account():
    contract_info = read_contract_info()
    contract_info = contract_info.get('UserRegistry')
    contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))
    for token in w3.eth.accounts:
        user_data = contract.functions.getUserData(token).call()
        print(token, user_data)
        if user_data == ['', '']:
            return token
    return None


def register_user(login, password):
    free_account = get_free_account()
    if free_account is not None:
        contract_info = read_contract_info()
        contract_info = contract_info.get('UserRegistry')

        password = bytes(password, encoding='utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())

        # Создаем объект контракта
        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        # Вызываем функцию контракта для регистрации пользователя
        tx_hash = contract.functions.registerUser(free_account, login, hash_password.decode('utf-8')).transact({'from': free_account})

        # Ждем, пока транзакция будет подтверждена
        w3.eth.wait_for_transaction_receipt(tx_hash)
        return {'success': free_account}
    else:
        return {'error': "No free accounts available for registration."}


def get_user_info(token, login, password):
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('UserRegistry')

        # Создаем объект контракта
        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        # Вызываем функцию контракта для получения данных пользователя
        # user_data = contract.functions.getUserData().call({'from': token})
        user_data = contract.functions.getUserData(token).call()
        # Проверяем, совпадает ли пароль
        stored_password = user_data[1]
        try:
            stored_hash = stored_password.encode('utf-8')
            check_password = bcrypt.checkpw(password.encode(), stored_hash)
        except ValueError:
            return False
        if check_password:
            print(f"User {login} authenticated successfully.")
            print(user_data)
            return True
        else:
            print(f"Authentication failed for user {login}.")
            return False
    except w3except.InvalidAddress:
        return False