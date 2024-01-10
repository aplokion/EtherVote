import os, json

script_dir = os.path.dirname(os.path.abspath(__file__))
directive_relative_path = os.path.join('../..', 'etherium', 'build', 'contracts')
directive_path = os.path.abspath(os.path.join(script_dir, directive_relative_path))


def read_contract_info():
    contract_info = {}
    for filename in os.listdir(directive_path):
        if filename.endswith(".json"):
            file_path = os.path.join(directive_path, filename)

            # Читаем JSON-файл
            with open(file_path, "r") as file:
                data = json.load(file)

                # Извлекаем нужную информацию из JSON
                contract_name = data.get("contractName")
                network_info = data.get("networks", {})

                # Перебираем информацию о контракте в разных сетях
                for network_id, network_data in network_info.items():
                    address = network_data.get("address")
                    transaction_hash = network_data.get("transactionHash")

                    # Проверяем наличие ключей и создаем запись в словаре
                    if contract_name and address and transaction_hash:
                        contract_info[contract_name] = {
                            "address": address,
                            "abi": data.get("abi", []),
                            "transaction_hash": transaction_hash
                        }

    return contract_info
