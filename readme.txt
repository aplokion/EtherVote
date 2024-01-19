Для запуска проекта необходимо:
    -Python 3.11
    -Node.js >18
    -Truffle
    -Ganache
Инструкция по запуску проекта:
    -Установить пакеты для Python из backend/requirements.txt
    В папке etherium:
        -npm i
        -Запустить сеть ganache командой ganache-cli --deterministic
        -Мигрировать контракты с помощью truffle командой truffle migrate --network development
    В папке backend:
        -Запустить файл app.py