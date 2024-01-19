from web3 import Web3
import bcrypt, traceback
from contracts_info import read_contract_info
import web3.exceptions as w3except
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
w3.eth.defaultAccount = w3.eth.accounts[0]

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

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        tx_hash = contract.functions.registerUser(free_account, login, hash_password.decode('utf-8')).transact({'from': free_account})

        w3.eth.wait_for_transaction_receipt(tx_hash)
        return {'success': free_account}
    else:
        return {'error': "No free accounts available for registration."}


def get_user_info(token, login, password):
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('UserRegistry')

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

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

        tx_hash = contract.functions.addElection(topic, description, options).transact({'from': token})

        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(receipt['logs'])
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

        num_elections = contract.functions.electionsCount().call()

        votings = []

        for i in range(num_elections):
            election_info = contract.functions.getElectionInfo(i).call()
            topic, description, option_indices, votes = election_info
            votings.append({
                'topic': topic,
                'description': description,
                'option_indices': option_indices,
                'votes': votes
            })

        return votings

    except w3except.InvalidAddress:
        return None


def get_voting_info(election_index):
    try:
        contract_info = read_contract_info()
        contract_info = contract_info.get('Voting')

        contract = w3.eth.contract(address=contract_info.get('address'), abi=contract_info.get('abi'))

        election_info = contract.functions.getElectionInfo(election_index).call()
        topic, description, option_indices, votes = election_info

        return {'topic': topic,
                'description': description,
                'option_indices': option_indices,
                'votes': votes}

    except w3except.InvalidAddress:
        return None


def vote_in_voting(user_address, election_index, option_index):
    try:
        contract_info_voting = read_contract_info().get('Voting')

        contract_voting = w3.eth.contract(address=contract_info_voting.get('address'), abi=contract_info_voting.get('abi'))

        tx_hash = contract_voting.functions.vote(election_index, option_index).transact({'from': user_address})

        w3.eth.wait_for_transaction_receipt(tx_hash)

        return {'success': True}

    except Exception as e:
        return {'error': str(e)}


def get_elections_user_voted_in(user_token):
    try:
        contract_info_voting = read_contract_info().get('Voting')

        contract_voting = w3.eth.contract(address=contract_info_voting.get('address'), abi=contract_info_voting.get('abi'))

        elections_list = contract_voting.functions.getParticipatedElections(user_token).call()

        elections = {i: get_voting_info(i) for i in elections_list}
        return elections
    except Exception:
        print(traceback.format_exc())
        return {}


def get_elections_user_create(user_token):
    try:
        contract_info_voting = read_contract_info().get('Voting')

        contract_voting = w3.eth.contract(address=contract_info_voting.get('address'), abi=contract_info_voting.get('abi'))

        elections_list = contract_voting.functions.getCreatedElections(user_token).call()

        elections = {i: get_voting_info(i) for i in elections_list}
        return elections
    except Exception:
        print(traceback.format_exc())
        return {}


# def main():
#     token = w3.eth.accounts[0]

#     topic = "Лучший вариант7777"
#     description = "Выберите"
#     options = ["A", "B", "C"]

#     result = create_voting(token, topic, description, options)

#     if 'success' in result:
#         print("Голосование успешно создано!")
#     else:
#         print(f"Ошибка: {result.get('error')}")
#     print(get_elections_user_create(token))
    # print(get_all_votings())
    # user_token = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"
    # user_token = w3.eth.accounts[1]
    # proposal_index = 0
    # option_index = 2

    # result = vote_in_voting(user_token, proposal_index, option_index)

    # if 'success' in result:
    #     print("Голос успешно учтен!")
    # else:
    #     print(f"Ошибка: {result.get('error')}")

    # print(get_voting_info(0))
    # print(get_elections_user_create(w3.eth.accounts[1]))


# if __name__ == "__main__":
#     main()