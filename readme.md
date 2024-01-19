# EtherVote
Веб приложение для голосования через блокчейн.

## Содержание
- [Технологии](#технологии)
- [Начало работы](#начало-работы)
- [Тестирование](#тестирование)
- [Команда проекта](#команда-проекта)

## Технологии
- [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- [Solidity](https://soliditylang.org/)
- [Truffle](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/)

## Начало работы

### Установка зависимостей
##### В /etherium
Установите npm-пакеты:
```sh
npm i
```
##### В /backend
Установите pip-пакеты:
```sh
pip install -r requirements.txt
```

### Запуск Development сервера
##### В /etherium
Запустить тестовую сеть ganache:
```sh
ganache-cli --deterministic
```

Мигрировать контракты:
```sh
truffle migrate --network development
```

##### В /backend
Запустить app:
```sh
python app.py
```

## Тестирование
Для тестирования контрактов в /etherium
```sh
truffle test
```

## Команда проекта
- [Москвитин Аркадий](https://github.com/aplokion) — back-End + контракты
- [Лесков Марк](https://github.com/7Maersk) — front-End + контракты
