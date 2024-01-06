import mysql.connector
import bcrypt


def execute_query(query, data=None):
    try:
        connection = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            database='ethervote'
        )

        if connection.is_connected():
            print('Connected to MySQL database')

            cursor = connection.cursor()
            if data:
                cursor.execute(query, data)
            else:
                cursor.execute(query)

            result = cursor.fetchall()

            cursor.close()
            connection.commit()
            if connection.is_connected():
                connection.close()
                print('Connection closed')
            return result

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return err.args[0]
    except Exception as e:
        print(e)
    finally:
        if connection.is_connected():
            connection.close()
            print('Connection closed')


def is_user_exist(username: str, password: str) -> int | bool:
    query = f'''SELECT id, password FROM ethervote.users WHERE username = \'{username}\''''
    result = execute_query(query)
    if len(result) == 0:
        return False
    database_hash = result[0][1].encode('utf-8')
    check_password = bcrypt.checkpw(password.encode(), database_hash)
    return result[0][0] if check_password else False


def register_user(username: str, password: str) -> bool | int:
    password = bytes(password, encoding='utf-8')
    hash_password = bcrypt.hashpw(password, bcrypt.gensalt())
    query = '''INSERT INTO ethervote.users (username, password) VALUES (%s, %s)'''
    val = (username, hash_password.decode('utf-8'))
    result = execute_query(query, data=val)
    return True if result == [] else result


def get_user_elections_dict(user_id):
    query = f'''SELECT uv.election_id, topic, date_start, date_end, creator, username, option_text
                FROM ethervote.users_votes as uv
                LEFT JOIN ethervote.elections as el ON uv.election_id = el.id
                LEFT JOIN ethervote.users as u on u.id = el.creator
                LEFT JOIN ethervote.elections_options AS eo ON el.id = eo.election_id
                AND eo.id = uv.election_option_id
                WHERE uv.user_id = {user_id}'''
    result = execute_query(query)
    if isinstance(result, int):
        return {}
    elections_dict = {el[0]: {"topic": el[1],
                              "date_start": el[2],
                              "date_end": el[3],
                              "creator": el[4],
                              "choice": el[5]} for el in result}
    return elections_dict
