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


def is_user_exist(username: str, password: str) -> bool:
    salt = bcrypt.gensalt()
    password = bytes(password, encoding='utf-8')
    hash_password = bcrypt.hashpw(
        password=password,
        salt=salt
    )
    query = f'''SELECT COUNT(id) FROM ethervote.users WHERE username = \'{username}\' AND password = \'{hash_password.decode('utf-8')}\''''
    result = execute_query(query)
    return True if len(result[0]) == 1 else False


def register_user(username: str, password: str) -> bool | int:
    salt = bcrypt.gensalt()
    password = bytes(password, encoding='utf-8')
    hash_password = bcrypt.hashpw(
        password=password,
        salt=salt
    )
    query = '''INSERT INTO ethervote.users (username, password) VALUES (%s, %s)'''
    val = (username, hash_password.decode('utf-8'))
    result = execute_query(query, data=val)
    return True if result == [] else result
