Для запуска проекта необходимо:
    -Python 3.11
    -Node.js >18
    -Truffle
    -Ganache
Инструкция по запуску проекта:
    В папке etherium:
        -npm i
        -Запустить сеть ganache командой ganache-cli --deterministic
        -Мигрировать контракты с помощью truffle командой truffle migrate --network development
    В папке backend:
        -Установить пакеты для Python из requirements.txt
        -Запустить файл app.py
