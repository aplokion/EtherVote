from web3 import Web3
import bcrypt
from .contracts_info import read_contract_info
import web3.exceptions as w3except
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))  # Замените на свой адрес Ethereum узла
w3.eth.defaultAccount = w3.eth.accounts[0]  # Устанавливаем аккаунт по умолчанию

# print(w3.eth.defaultAccount)


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


def create_voting(token, topic, description, options):
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('Voting')

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        tx_hash = contract.functions.addProposal(topic, description, options).transact({'from': token})

        w3.eth.wait_for_transaction_receipt(tx_hash)

        return {'success': True}
    except w3except.InvalidAddress:
        return {'error': "Invalid address."}
    except Exception as e:
        return {'error': str(e)}


def get_all_votings():
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('Voting')

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        # Получаем количество голосований
        num_proposals = contract.functions.proposalsCount().call()

        # Получаем информацию о каждом голосовании
        votings = []

        for i in range(num_proposals):
            proposal_info = contract.functions.getProposalInfo(i).call()
            topic, description, option_indices, votes = proposal_info
            votings.append({
                'topic': topic,
                'description': description,
                'option_indices': option_indices,
                'votes': votes
            })

        return votings

    except w3except.InvalidAddress:
        return None


def get_voting_info(proposal_index):
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('Voting')

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        # Получаем информацию о конкретном голосовании
        proposal_info = contract.functions.getProposalInfo(proposal_index).call()
        topic, description, option_indices, votes = proposal_info

        return {'topic': topic,
                'description': description,
                'option_indices': option_indices,
                'votes': votes}

    except w3except.InvalidAddress:
        return None


def vote_in_voting(user_address, proposal_index, option_index):
    try:
        contract_info_voting = read_contract_info().get('Voting')

        contract_voting = w3.eth.contract(address=contract_info_voting.get('address'), abi=contract_info_voting.get('abi'))

        tx_hash = contract_voting.functions.vote(proposal_index, option_index).transact({'from': user_address})

        w3.eth.wait_for_transaction_receipt(tx_hash)

        return {'success': True}

    except Exception as e:
        return {'error': str(e)}


# def main():
#     token = w3.eth.accounts[0]
#     topic = "Лучший вариант2"
#     description = "Выберите лучший вариант из предложенных2"
#     options = ["Вариант A1", "Вариант B1", "Вариант C1"]

#     result = create_voting(token, topic, description, options)

#     if 'success' in result:
#         print("Голосование успешно создано!")
#     else:
#         print(f"Ошибка: {result.get('error')}")

#     votings = get_all_votings()
#     print("Информация о голосованиях:", votings)
#     print(get_voting_info(0))
#     user_token = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"
#     proposal_index = 1
#     option_index = 1

#     result = vote_in_voting(user_token, proposal_index, option_index)

#     if 'success' in result:
#         print("Голос успешно учтен!")
#     else:
#         print(f"Ошибка: {result.get('error')}")

#     print(get_voting_info(0))


# if __name__ == "__main__":
#     main()